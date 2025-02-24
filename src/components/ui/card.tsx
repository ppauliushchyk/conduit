import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type BodyProps = HTMLAttributes<HTMLDivElement>;

function Body(props: Readonly<BodyProps>) {
  const { children, className, ...rest } = props;

  return (
    <div {...rest} className={twMerge("px-2.5 last:pb-2.5", className)}>
      {children}
    </div>
  );
}

type ContentProps = HTMLAttributes<HTMLDivElement>;

function Content(props: Readonly<ContentProps>) {
  const { children, className, ...rest } = props;

  return (
    <div
      {...rest}
      className={twMerge(
        "flex w-full flex-col gap-4 rounded-3xl bg-zinc-300 p-1.5 dark:bg-zinc-800",
        className,
      )}
    >
      {children}
    </div>
  );
}

type DescriptionProps = HTMLAttributes<HTMLParagraphElement>;

function Description(props: Readonly<DescriptionProps>) {
  const { children, className, ...rest } = props;

  return (
    <p
      {...rest}
      className={twMerge("text-sm text-zinc-600 dark:text-zinc-400", className)}
    >
      {children}
    </p>
  );
}

type FooterProps = HTMLAttributes<HTMLDivElement>;

function Footer(props: Readonly<FooterProps>) {
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

type HeaderProps = HTMLAttributes<HTMLDivElement> & {
  description?: string;
  title?: string;
};

function Header(props: Readonly<HeaderProps>) {
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

type TitleProps = HTMLAttributes<HTMLHeadingElement>;

function Title(props: Readonly<TitleProps>) {
  const { children, className, ...rest } = props;

  return (
    <h3 {...rest} className={twMerge("text-lg font-medium", className)}>
      {children}
    </h3>
  );
}

const Card = {
  Body,
  Content,
  Description,
  Footer,
  Header,
  Title,
};

export default Card;
