import { motion, AnimatePresence } from "motion/react";
import { useCallback, useId, useState } from "react";
import { twMerge } from "tailwind-merge";

const commonClasses = twMerge("flex gap-0.5 rounded-full border-1 p-0.25");

const variantClasses = twMerge(
  "border-zinc-500 bg-zinc-300",
  "dark:border-zinc-500 dark:bg-zinc-800",
);

const itemCommonClasses = twMerge(
  "relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-1 border-transparent px-6 py-2 text-sm leading-5 font-medium",
  "focus:outline-none",
  "disabled:pointer-events-none disabled:opacity-50",
);

const itemVariantClasses = twMerge(
  "text-zinc-900",
  "hover:bg-zinc-400/60",
  "focus:bg-zinc-400/60",
  "active:bg-zinc-400/80",
  "dark:text-zinc-100",
  "dark:hover:bg-zinc-700/60",
  "dark:focus:bg-zinc-700/60",
  "dark:active:bg-zinc-700/80",
);

const indicatorCommonClasses = twMerge(
  "absolute -inset-[1px] z-1 inline-flex items-center justify-center rounded-full",
);

const indicatorVariantClasses = twMerge(
  "bg-lime-500 text-lime-950",
  "dark:bg-lime-300 dark:text-lime-950",
);

type Option = {
  disabled?: boolean;
  label: string;
  value: string;
};

type ToggleProps = {
  id?: string;
  options: Option[];
};

export function Toggle(props: Readonly<ToggleProps>) {
  const { id: controlledId, options } = props;

  const uncontrolledId = useId();
  const id = controlledId ?? uncontrolledId;

  const [selected, setSelected] = useState<string | null>(
    options[0].value ?? null,
  );

  const handleClick = useCallback(
    (value: string) => () => {
      if (selected !== value) {
        setSelected(value);
      }
    },
    [selected],
  );

  const renderItem = useCallback(
    (item: Option) => {
      return (
        <motion.li key={item.value}>
          <motion.button
            className={twMerge(itemCommonClasses, itemVariantClasses)}
            disabled={item.disabled}
            onClick={handleClick(item.value)}
          >
            {item.label}

            <AnimatePresence mode="wait">
              {item.value === selected && (
                <motion.div
                  className={twMerge(
                    indicatorCommonClasses,
                    indicatorVariantClasses,
                  )}
                  id={id}
                  layoutId={`${id}-toggle-indicator`}
                >
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.li>
      );
    },
    [handleClick, id, selected],
  );

  return (
    <ul className={twMerge(commonClasses, variantClasses)}>
      {options.map(renderItem)}
    </ul>
  );
}
