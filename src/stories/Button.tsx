import React from "react";

import "./button.css";

export interface ButtonProps {
  backgroundColor?: string;
  label: string;
  onClick?: () => void;
  primary?: boolean;
  size?: "small" | "medium" | "large";
}

export const Button = ({
  primary = false,
  size = "medium",
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary
    ? "storybook-button--primary"
    : "storybook-button--secondary";

  return (
    <button
      className={["storybook-button", `storybook-button--${size}`, mode].join(
        " ",
      )}
      type="button"
      {...props}
    >
      {label}

      <style jsx>{`
        button {
          background-color: ${backgroundColor};
        }
      `}</style>
    </button>
  );
};
