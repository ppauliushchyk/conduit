import { HTMLAttributes } from "react";
import { twJoin, twMerge } from "tailwind-merge";

import { UIThemeClasses } from "./types";

type UICardBodyProps = HTMLAttributes<HTMLDivElement>;

function Body(props: Readonly<UICardBodyProps>) {
  const { children, className, ...rest } = props;

  return (
    <div {...rest} className={twMerge("px-2.5 last:pb-2.5", className)}>
      {children}
    </div>
  );
}

const contentClasses: UIThemeClasses = {
  dark: twJoin("dark:bg-zinc-800"),
  light: twJoin("bg-zinc-300"),
};

type UICardContentProps = HTMLAttributes<HTMLDivElement>;

function Content(props: Readonly<UICardContentProps>) {
  const { children, className, ...rest } = props;

  return (
    <div
      {...rest}
      className={twMerge(
        "flex w-full flex-col gap-4 rounded-3xl p-1.5",
        contentClasses.dark,
        contentClasses.light,
        className,
      )}
    >
      {children}
    </div>
  );
}

const descriptionClasses: UIThemeClasses = {
  dark: twJoin("dark:text-zinc-400"),
  light: twJoin("text-zinc-600"),
};

type UICardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

function Description(props: Readonly<UICardDescriptionProps>) {
  const { children, className, ...rest } = props;

  return (
    <p
      {...rest}
      className={twMerge(
        "text-sm",
        descriptionClasses.dark,
        descriptionClasses.light,
        className,
      )}
    >
      {children}
    </p>
  );
}

type UICardFooterProps = HTMLAttributes<HTMLDivElement>;

function Footer(props: Readonly<UICardFooterProps>) {
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

type UICardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  description?: string;
  title?: string;
};

function Header(props: Readonly<UICardHeaderProps>) {
  const { children, className, title, description, ...rest } = props;

  return (
    <div
      {...rest}
      className={twMerge("flex flex-row items-start gap-1.5", className)}
    >
      {(title || description) && (
        <div className={twMerge("grow px-2.5 pt-2.5", children && "pe-0")}>
          {title && <Title>{title}</Title>}
          {description && <Description>{description}</Description>}
        </div>
      )}

      {children}
    </div>
  );
}

type UICardTitleProps = HTMLAttributes<HTMLHeadingElement>;

function Title(props: Readonly<UICardTitleProps>) {
  const { children, className, ...rest } = props;

  return (
    <h3 {...rest} className={twMerge("text-lg font-medium", className)}>
      {children}
    </h3>
  );
}

export const UICard = {
  Body,
  Content,
  Description,
  Footer,
  Header,
  Title,
};
