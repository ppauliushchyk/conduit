"use client";

import type { Placement } from "@floating-ui/react";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTransitionStyles,
  useTypeahead,
} from "@floating-ui/react";
import {
  ButtonHTMLAttributes,
  cloneElement,
  createContext,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  RefAttributes,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import { twJoin, twMerge } from "tailwind-merge";

import { UIButton } from "./button";
import { UIThemeClasses } from "./types";

type DropdownProps = {
  initialOpen?: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange?(open: boolean): void;
  open?: boolean;
  placement?: Placement;
};

function useDropdown(props: DropdownProps) {
  const {
    initialOpen = false,
    onOpenChange: setControlledOpen,
    open: controlledOpen,
    placement = "bottom-end",
  } = props;

  const [uncontrolledOpen, setUncontrolledOpen] =
    useState<boolean>(initialOpen);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const elementsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    middleware: [
      offset(6),
      flip({
        crossAxis: placement.includes("-"),
        fallbackAxisSideDirection: "end",
        padding: 6,
      }),
      shift({ padding: 6 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    onOpenChange: setOpen,
    open,
    placement,
    whileElementsMounted: autoUpdate,
  });

  const { context } = data;

  const click = useClick(context, { enabled: controlledOpen == null });
  const dismiss = useDismiss(context);
  const listNavigation = useListNavigation(context, {
    activeIndex,
    listRef: elementsRef,
    onNavigate: setActiveIndex,
  });
  const role = useRole(context, { role: "menu" });
  const typeahead = useTypeahead(context, {
    activeIndex,
    listRef: labelsRef,
    onMatch: setActiveIndex,
  });

  const interactions = useInteractions([
    click,
    dismiss,
    listNavigation,
    role,
    typeahead,
  ]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      activeIndex,
      elementsRef,
      labelsRef,
    }),
    [open, setOpen, interactions, data, activeIndex],
  );
}

type ContextType = ReturnType<typeof useDropdown> | null;

const DropdownContext = createContext<ContextType>(null);

function useDropdownContext() {
  const context = useContext(DropdownContext);

  if (context == null) {
    throw new Error(
      "Dropdown components must be wrapped in the Wrapper component",
    );
  }

  return context;
}

type UIDropdownContainerProps = HTMLAttributes<HTMLDivElement> &
  RefAttributes<HTMLDivElement>;

function Container(props: Readonly<UIDropdownContainerProps>) {
  const context = useDropdownContext();
  const ref = useMergeRefs([context.refs.setFloating, props.ref]);

  if (!context.open) {
    return null;
  }

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context.context} modal={false}>
        <div
          ref={ref}
          style={context.floatingStyles}
          {...context.getFloatingProps(props)}
          className="focus:outline-none"
        />
      </FloatingFocusManager>
    </FloatingPortal>
  );
}

const contentClasses: UIThemeClasses = {
  dark: twJoin("dark:bg-zinc-700"),
  light: twJoin("bg-zinc-400"),
};

type UIDropdownContentProps = HTMLAttributes<HTMLDivElement>;

function Content(props: Readonly<UIDropdownContentProps>) {
  const { children, className, ...rest } = props;

  const context = useDropdownContext();
  const { elementsRef, labelsRef } = context;

  const { isMounted, styles } = useTransitionStyles(context.context);

  return (
    isMounted && (
      <div
        {...rest}
        className={twMerge(
          "overflow-hidden rounded-2xl py-2 shadow-2xl shadow-zinc-950/50",
          contentClasses.dark,
          contentClasses.light,
          className,
        )}
        style={styles}
      >
        <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
          {children}
        </FloatingList>
      </div>
    )
  );
}

const itemClasses: UIThemeClasses = {
  dark: twJoin(
    "dark:hover:bg-zinc-600/60",
    "dark:focus:bg-zinc-600/60",
    "dark:active:bg-zinc-600/80",
  ),
  light: twJoin(
    "hover:bg-zinc-500/60",
    "focus:bg-zinc-500/60",
    "active:bg-zinc-500/80",
  ),
};

type UIDropdownItemProps = ButtonHTMLAttributes<HTMLButtonElement>;

function Item(props: Readonly<UIDropdownItemProps>) {
  const { children, className, onClick, ...rest } = props;

  const { activeIndex, getItemProps } = useDropdownContext();
  const { ref, index } = useListItem();

  return (
    <button
      {...rest}
      className={twMerge(
        "block w-full cursor-pointer px-4 py-3 text-left text-sm font-medium",
        "focus:outline-none",
        itemClasses.dark,
        itemClasses.light,
        className,
      )}
      key={index}
      ref={ref}
      role="menuitem"
      tabIndex={activeIndex === index ? 0 : -1}
      type="button"
      {...getItemProps({ onClick })}
    >
      {children}
    </button>
  );
}

type UIDropdownTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> &
  RefAttributes<HTMLButtonElement> & { asChild?: boolean };

function Trigger(props: Readonly<UIDropdownTriggerProps>) {
  const { asChild, children, ...rest } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const converted = (children || {}) as any;

  const context = useDropdownContext();
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
      IconRight={context.open ? MdOutlineArrowDropUp : MdOutlineArrowDropDown}
      data-state={context.open ? "open" : "closed"}
      ref={ref}
      {...context.getReferenceProps(props)}
    >
      {children}
    </UIButton>
  );
}

type UIDropdownWrapperProps = DropdownProps & { children: ReactNode };

function Wrapper(props: Readonly<UIDropdownWrapperProps>) {
  const { children, ...rest } = props;

  const dropdown = useDropdown(rest);

  return (
    <DropdownContext.Provider value={dropdown}>
      {children}
    </DropdownContext.Provider>
  );
}

export const UIDropdown = {
  Container,
  Content,
  Item,
  Trigger,
  Wrapper,
};
