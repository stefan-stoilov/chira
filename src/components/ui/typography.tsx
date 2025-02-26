import { cn } from "@/lib/utils";

/**
 * Typography styles.
 */
export const typography = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  p: "leading-7",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
  link: "text-primary underline-offset-4 underline hover:text-primary-hovered active:text-primary-pressed",
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  blockquote: "border-l-2 pl-6 italic",
};

export type TypographyProps = {
  className?: string;
} & React.PropsWithChildren;

/**
 * Heading 1 element `<h1>`.
 *
 * @param children The content of the heading.
 * @param className Additional classes to apply.
 * @returns The heading element.
 */
export function H1({ children, className }: TypographyProps) {
  return <h1 className={cn(typography.h1, className)}>{children}</h1>;
}

/**
 * Heading 2 element `<h2>`.
 *
 * @param children The content of the heading.
 * @param className Additional classes to apply.
 * @returns The heading element.
 */
export function H2({ children, className }: TypographyProps) {
  return <h2 className={cn(typography.h2, className)}>{children}</h2>;
}

/**
 * Heading 3 element `<h3>`.
 *
 * @param children The content of the heading.
 * @param className Additional classes to apply.
 * @returns The heading element.
 */
export function H3({ children, className }: TypographyProps) {
  return <h3 className={cn(typography.h3, className)}>{children}</h3>;
}

/**
 * Heading 4 element `<h4>`.
 *
 * @param children The content of the heading.
 * @param className Additional classes to apply.
 * @returns The heading element.
 */
export function H4({ children, className }: TypographyProps) {
  return <h4 className={cn(typography.h4, className)}>{children}</h4>;
}

/**
 * Paragraph element `<p>`.
 *
 * @param children The content of the paragraph.
 * @param className Additional classes to apply.
 * @returns The paragraph element.
 */
export function Paragraph({ children, className }: TypographyProps) {
  return <p className={cn(typography.p, className)}>{children}</p>;
}

/**
 * Paragraph element `<span>`.
 *
 * @param children The content of the span.
 * @param className Additional classes to apply.
 * @returns The span element.
 */
export function Lead({ children, className }: TypographyProps) {
  return <span className={cn(typography.lead, className)}>{children}</span>;
}

/**
 * Div element `<span>`.
 *
 * @param children The content of the span.
 * @param className Additional classes to apply.
 * @returns The span element.
 */
export function Large({ children, className }: TypographyProps) {
  return <span className={cn(typography.large, className)}>{children}</span>;
}

/**
 * Small element `<small>`.
 *
 * @param children The content of the small.
 * @param className Additional classes to apply.
 * @returns The small element.
 */
export function Small({ children, className }: TypographyProps) {
  return <small className={cn(typography.small, className)}>{children}</small>;
}

/**
 * Paragraph element `<span>`.
 *
 * @param children The content of the span.
 * @param className Additional classes to apply.
 * @returns The span element.
 */
export function Muted({ children, className }: TypographyProps) {
  return <span className={cn(typography.muted, className)}>{children}</span>;
}

/**
 * Code element `<code>`.
 *
 * @param children The content of the code block.
 * @param className Additional classes to apply.
 * @returns The code block element.
 */
export function InlineCode({ children, className }: TypographyProps) {
  return <code className={cn(typography.code, className)}>{children}</code>;
}

/**
 * Code element `<blockquote>`.
 *
 * @param children The content of the blockquote block.
 * @param className Additional classes to apply.
 * @returns The code block element.
 */
export function Blockquote({ children, className }: TypographyProps) {
  return (
    <blockquote className={cn(typography.blockquote, className)}>
      {children}
    </blockquote>
  );
}
