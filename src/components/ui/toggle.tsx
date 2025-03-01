import { motion, AnimatePresence } from "motion/react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
import type { IconType } from "react-icons/lib";
import { twJoin, twMerge } from "tailwind-merge";

import { UIThemeClasses } from "./types";

type ToggleProps = {
  defaultValue?: string;
  id?: string;
  // eslint-disable-next-line no-unused-vars
  onValueChange?(value: string): void;
  value?: string;
};

function useToggle(props: ToggleProps) {
  const {
    defaultValue,
    id: controlledId,
    onValueChange: setControlledValue,
    value: controlledValue,
  } = props;

  const uncontrolledId = useId();
  const id = controlledId ?? uncontrolledId;

  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(
    defaultValue || null,
  );

  const value = controlledValue ?? uncontrolledValue;
  const setValue = setControlledValue ?? setUncontrolledValue;

  return useMemo(
    () => ({
      id,
      setValue,
      value,
    }),
    [id, setValue, value],
  );
}

type ContextType = ReturnType<typeof useToggle> | null;

const ToggleContext = createContext<ContextType>(null);

function useToggleContext() {
  const context = useContext(ToggleContext);

  if (!context) {
    throw new Error(
      "Toggle components must be wrapped in the Wrapper component",
    );
  }

  return context;
}

const itemCommonClasses = twMerge(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-1 border-transparent leading-5 font-medium",
  "focus:outline-none",
  "disabled:pointer-events-none disabled:opacity-50",
);

const itemClasses: UIThemeClasses = {
  dark: twJoin(
    "dark:text-zinc-100",
    "dark:hover:bg-zinc-700/60",
    "dark:focus:bg-zinc-700/60",
    "dark:active:bg-zinc-700/80",
  ),
  light: twJoin(
    "text-zinc-900",
    "hover:bg-zinc-400/60",
    "focus:bg-zinc-400/60",
    "active:bg-zinc-400/80",
  ),
};

const indicatorCommonClasses = twMerge(
  "absolute inset-0 z-1 inline-flex items-center justify-center gap-2 rounded-full",
);

const indicatorClasses: UIThemeClasses = {
  dark: twJoin("dark:bg-lime-300 dark:text-lime-950"),
  light: twJoin("bg-lime-500 text-lime-950"),
};

type UIToggleItemCommonProps = {
  disabled?: boolean;
  value: string;
};

type UIIconToggleItemProps = UIToggleItemCommonProps & {
  Icon: IconType;
  children?: never;
};

type UITextToggleItemProps = UIToggleItemCommonProps & {
  Icon?: never;
  children: string;
};

type UIToggleItemProps = UIIconToggleItemProps | UITextToggleItemProps;

function Item(props: Readonly<UIToggleItemProps>) {
  const { Icon, children, value, disabled } = props;

  const { id, setValue, ...context } = useToggleContext();

  const handleClick = useCallback(() => {
    setValue(value);
  }, [setValue, value]);

  const content = useMemo(() => {
    return Icon ? <Icon /> : children;
  }, [Icon, children]);

  return (
    <motion.li className="relative" key={value}>
      <motion.button
        className={twMerge(
          itemCommonClasses,
          Icon ? "p-2 text-xl" : "px-6 py-2 text-sm",
          itemClasses.dark,
          itemClasses.light,
        )}
        disabled={disabled}
        onClick={handleClick}
      >
        {content}

        <AnimatePresence mode="wait">
          {value === context.value && (
            <motion.div
              className={twMerge(
                indicatorCommonClasses,
                indicatorClasses.dark,
                indicatorClasses.light,
              )}
              id={id}
              layoutId={id}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.li>
  );
}

const wrapperCommonClasses = twJoin(
  "flex gap-0.5 rounded-full border-1 p-0.25",
);

const wrapperClasses: UIThemeClasses = {
  dark: twJoin("dark:border-zinc-500 dark:bg-zinc-800"),
  light: twJoin("border-zinc-500 bg-zinc-300"),
};

type UIToggleWrapperProps = ToggleProps & { children: ReactNode };

function Wrapper(props: Readonly<UIToggleWrapperProps>) {
  const { children, ...rest } = props;

  const toggle = useToggle(rest);

  return (
    <ToggleContext.Provider value={toggle}>
      <motion.ul
        className={twMerge(
          wrapperCommonClasses,
          wrapperClasses.dark,
          wrapperClasses.light,
        )}
      >
        {children}
      </motion.ul>
    </ToggleContext.Provider>
  );
}

export const UIToggle = {
  Item,
  Wrapper,
};
