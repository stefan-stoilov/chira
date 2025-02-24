import { cn } from "@/lib/utils";

/**
 * Typography styles for various HTML elements.
 */
export const typography = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
  link: "text-primary underline-offset-4 hover:underline hover:text-primary-hovered active:text-primary-pressed",
};

export type TypographyProps = {
  className?: string;
  children?: React.ReactNode;
};

/**
 * Heading 1 element `<h1>`.
 *
 * @param children The content of the heading.
 * @param className Additional CSS classes to apply. Will override existing Tailwind classes if there is a conflict.
 * @returns The heading element.
 */
export function H1({ children, className }: TypographyProps) {
  return <h1 className={cn(typography.h1, className)}>{children}</h1>;
}

/**
 * Heading 2 element `<h2>`.
 *
 * @param children The content of the heading.
 * @param className Additional CSS classes to apply. Will override existing Tailwind classes if there is a conflict.
 * @returns The heading element.
 */
export function H2({ children, className }: TypographyProps) {
  return <h2 className={cn(typography.h2, className)}>{children}</h2>;
}

/**
 * Heading 3 element `<h3>`.
 *
 * @param children The content of the heading.
 * @param className Additional CSS classes to apply. Will override existing Tailwind classes if there is a conflict.
 * @returns The heading element.
 */
export function H3({ children, className }: TypographyProps) {
  return <h3 className={cn(typography.h3, className)}>{children}</h3>;
}

/**
 * Heading 4 element `<h4>`.
 *
 * @param children The content of the heading.
 * @param className Additional CSS classes to apply. Will override existing Tailwind classes if there is a conflict.
 * @returns The heading element.
 */
export function H4({ children, className }: TypographyProps) {
  return <h4 className={cn(typography.h4, className)}>{children}</h4>;
}

/**
 * Paragraph element `<p>`.
 *
 * @param children The content of the paragraph.
 * @param className Additional CSS classes to apply. Will override existing Tailwind classes if there is a conflict.
 * @returns The paragraph element.
 */
export function Paragraph({ children, className }: TypographyProps) {
  return <p className={cn(typography.p, className)}>{children}</p>;
}

/**
 * Paragraph element `<p>`.
 *
 * @param children The content of the paragraph.
 * @param className Additional CSS classes to apply. Will override existing Tailwind classes if there is a conflict.
 * @returns The paragraph element.
 */
export function Lead({ children, className }: TypographyProps) {
  return <p className={cn(typography.lead, className)}>{children}</p>;
}

/**
 * Div element `<div>`.
 *
 * @param children The content of the div.
 * @param className Additional CSS classes to apply. Will override existing Tailwind classes if there is a conflict.
 * @returns The div element.
 */
export function Large({ children, className }: TypographyProps) {
  return <div className={cn(typography.large, className)}>{children}</div>;
}

/**
 * Small element `<small>`.
 *
 * @param children The content of the small.
 * @param className Additional CSS classes to apply. Will override existing Tailwind classes if there is a conflict.
 * @returns The small element.
 */
export function Small({ children, className }: TypographyProps) {
  return <small className={cn(typography.small, className)}>{children}</small>;
}

/**
 * Paragraph element `<p>`.
 *
 * @param children The content of the paragraph.
 * @param className Additional CSS classes to apply. Will override existing Tailwind classes if there is a conflict.
 * @returns The paragraph element.
 */
export function Muted({ children, className }: TypographyProps) {
  return <p className={cn(typography.muted, className)}>{children}</p>;
}
