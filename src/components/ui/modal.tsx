"use client";

import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  FloatingFocusManager,
  FloatingOverlay,
  useId,
  useTransitionStyles,
  autoUpdate,
} from "@floating-ui/react";
import {
  ButtonHTMLAttributes,
  cloneElement,
  createContext,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  RefAttributes,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { MdOutlineClose } from "react-icons/md";
import { twJoin, twMerge } from "tailwind-merge";

import { UIButton } from "./button";
import { UIThemeClasses } from "./types";

type ModalProps = {
  initialOpen?: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange?(open: boolean): void;
  open?: boolean;
};

function useModal(props: ModalProps) {
  const {
    initialOpen = false,
    onOpenChange: setControlledOpen,
    open: controlledOpen,
  } = props;

  const [uncontrolledOpen, setUncontrolledOpen] =
    useState<boolean>(initialOpen);
  const [descriptionId, setDescriptionId] = useState<string | undefined>();
  const [labelId, setLabelId] = useState<string | undefined>();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    onOpenChange: setOpen,
    open,
    whileElementsMounted: autoUpdate,
  });

  const { context } = data;

  const click = useClick(context, { enabled: controlledOpen == null });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "dialog" });

  const interactions = useInteractions([click, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      descriptionId,
      labelId,
      setDescriptionId,
      setLabelId,
    }),
    [open, setOpen, interactions, data, labelId, descriptionId],
  );
}

type ContextType = ReturnType<typeof useModal> | null;

const ModalContext = createContext<ContextType>(null);

function useModalContext() {
  const context = useContext(ModalContext);

  if (context == null) {
    throw new Error(
      "Modal components must be wrapped in the Wrapper component",
    );
  }

  return context;
}

type UIModalCloseProps = ButtonHTMLAttributes<HTMLButtonElement> &
  RefAttributes<HTMLButtonElement> & { asChild?: boolean };

function Close(props: Readonly<UIModalCloseProps>) {
  const { asChild, children, className, ref, ...rest } = props;

  const { setOpen } = useModalContext();

  const handleClick = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      onClick: handleClick,
      ref,
    } as Record<string, unknown>);
  }

  return (
    <UIButton
      {...rest}
      Icon={MdOutlineClose}
      aria-label="Close modal"
      className={twMerge(className)}
      onClick={handleClick}
      ref={ref}
      type="button"
      variant="zinc-outline"
    />
  );
}

const containerClasses: UIThemeClasses = {
  dark: twJoin("dark:bg-zinc-900/20"),
  light: twJoin("bg-zinc-200/20"),
};

type UIModalContainerProps = HTMLAttributes<HTMLDivElement> &
  RefAttributes<HTMLDivElement>;

function Container(props: Readonly<UIModalContainerProps>) {
  const context = useModalContext();
  const ref = useMergeRefs([context.refs.setFloating, props.ref]);

  if (!context.open) {
    return null;
  }

  return (
    <FloatingPortal>
      <FloatingOverlay
        className={twMerge(
          "z-[999] grid place-items-center p-4 backdrop-blur-sm",
          containerClasses.dark,
          containerClasses.light,
        )}
        lockScroll
      >
        <FloatingFocusManager
          context={context.context}
          initialFocus={-1}
          restoreFocus
        >
          <div
            aria-describedby={context.descriptionId}
            aria-labelledby={context.labelId}
            ref={ref}
            {...context.getFloatingProps(props)}
            className={twMerge("grid w-full gap-4", props.className)}
          >
            {props.children}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}

const contentClasses: UIThemeClasses = {
  dark: twJoin("dark:bg-zinc-900"),
  light: twJoin("bg-zinc-200"),
};

type UIModalContentProps = HTMLAttributes<HTMLDivElement>;

function Content(props: Readonly<UIModalContentProps>) {
  const { children, className, ...rest } = props;

  const context = useModalContext();

  const { isMounted, styles } = useTransitionStyles(context.context);

  return (
    isMounted && (
      <div
        {...rest}
        className={twMerge(
          "flex w-full flex-col gap-4 rounded-3xl p-1.5 shadow-2xl shadow-zinc-950/50",
          contentClasses.dark,
          contentClasses.light,
          className,
        )}
        style={styles}
      >
        {children}
      </div>
    )
  );
}

const descriptionClasses: UIThemeClasses = {
  dark: twJoin("dark:text-zinc-400"),
  light: twJoin("text-zinc-600"),
};

type UIModalDescriptionProps = HTMLAttributes<HTMLParagraphElement> &
  RefAttributes<HTMLParagraphElement>;

function Description(props: Readonly<UIModalDescriptionProps>) {
  const { children, className, ref, ...rest } = props;

  const { setDescriptionId } = useModalContext();
  const id = useId();

  useLayoutEffect(() => {
    setDescriptionId(id);

    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return (
    <p
      {...rest}
      className={twMerge(
        "text-sm",
        descriptionClasses.dark,
        descriptionClasses.light,
        className,
      )}
      id={id}
      ref={ref}
    >
      {children}
    </p>
  );
}

type UIModalFooterProps = HTMLAttributes<HTMLDivElement>;

function Footer(props: Readonly<UIModalFooterProps>) {
  const { children, className, ...rest } = props;

  return (
    <div
      {...rest}
      className={twMerge("flex flex-row-reverse items-end gap-1.5", className)}
    >
      {children}
    </div>
  );
}

type UIModalHeaderProps = HTMLAttributes<HTMLDivElement> & {
  description?: string;
  hasClose?: boolean;
  title?: string;
};

function Header(props: Readonly<UIModalHeaderProps>) {
  const {
    children,
    className,
    description,
    hasClose = false,
    title,
    ...rest
  } = props;

  return (
    <div
      {...rest}
      className={twMerge("flex flex-row items-start gap-1.5", className)}
    >
      {(title || description) && (
        <div
          className={twMerge(
            "grow px-2.5 pt-2.5",
            (children || hasClose) && "pe-0",
          )}
        >
          {title && <Title>{title}</Title>}
          {description && <Description>{description}</Description>}
        </div>
      )}

      {children}
      {hasClose && <Close />}
    </div>
  );
}

type UIModalTitleProps = HTMLAttributes<HTMLHeadingElement> &
  RefAttributes<HTMLHeadingElement>;

function Title(props: Readonly<UIModalTitleProps>) {
  const { children, className, ref, ...rest } = props;

  const { setLabelId } = useModalContext();
  const id = useId();

  useLayoutEffect(() => {
    setLabelId(id);

    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <h3
      {...rest}
      className={twMerge("text-lg font-medium", className)}
      id={id}
      ref={ref}
    >
      {children}
    </h3>
  );
}

type UIModalTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> &
  RefAttributes<HTMLButtonElement> & { asChild?: boolean };

function Trigger(props: Readonly<UIModalTriggerProps>) {
  const { asChild, children, ...rest } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const converted = (children || {}) as any;

  const context = useModalContext();
  const ref = useMergeRefs([
    context.refs.setReference,
    props.ref,
    converted.ref,
  ]);

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        children,
        ref,
        ...rest,
        ...converted.props,
        "data-state": context.open ? "open" : "closed",
      }),
    );
  }

  return (
    <UIButton
      data-state={context.open ? "open" : "closed"}
      ref={ref}
      {...context.getReferenceProps(props)}
    >
      {children}
    </UIButton>
  );
}

type UIModalWrapperProps = ModalProps & { children: ReactNode };

function Wrapper(props: Readonly<UIModalWrapperProps>) {
  const { children, ...rest } = props;

  const modal = useModal(rest);

  return (
    <ModalContext.Provider value={modal}>{children}</ModalContext.Provider>
  );
}

export const UIModal = {
  Close,
  Container,
  Content,
  Description,
  Footer,
  Header,
  Title,
  Trigger,
  Wrapper,
};
