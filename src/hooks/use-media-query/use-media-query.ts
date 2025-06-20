"use client";
import { useState, useEffect, useMemo } from "react";

export type BreakpointsValuesType = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
  "3xl": number;
};

type MaxWidthType = `(max-width: ${number}px)`;
type MinWidthType = `(min-width: ${number}px)`;

export type MinWidthBreakpointsType = Record<
  keyof BreakpointsValuesType,
  MinWidthType
>;
export type MaxWidthBreakpointsType = Record<
  keyof BreakpointsValuesType,
  MaxWidthType
>;

export const breakpoints: BreakpointsValuesType = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
};

export const maxWidth: MaxWidthBreakpointsType = {
  sm: `(max-width: ${breakpoints.sm - 1}px)`,
  md: `(max-width: ${breakpoints.md - 1}px)`,
  lg: `(max-width: ${breakpoints.lg - 1}px)`,
  xl: `(max-width: ${breakpoints.xl - 1}px)`,
  "2xl": `(max-width: ${breakpoints["2xl"] - 1}px)`,
  "3xl": `(max-width: ${breakpoints["3xl"] - 1}px)`,
};

export const minWidth: MinWidthBreakpointsType = {
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  "2xl": `(min-width: ${breakpoints["2xl"]}px)`,
  "3xl": `(min-width: ${breakpoints["3xl"]}px)`,
};

/**
 * Hook for checking media queries based on predefined breakpoints.
 *
 * @param {Object} query - Configuration object for the media query.
 * @param {('min'|'max')} query.type - Type of media query ('min' or 'max').
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'} query.breakpoint - Breakpoint to check against.
 *
 * @returns {boolean} Whether the specified breakpoint matches the current viewport size.
 */
export const useMediaQuery = (query: {
  type: "min" | "max";
  breakpoint: keyof BreakpointsValuesType;
}) => {
  const [breakpointMatched, setBreakpointMatched] = useState(false);

  const mediaQuery = useMemo(
    () =>
      query.type === "max"
        ? maxWidth[query.breakpoint]
        : minWidth[query.breakpoint],
    [query],
  );

  useEffect(() => {
    const mediaQueryHandler = (event: MediaQueryListEvent) => {
      setBreakpointMatched(event.matches);
    };

    if (window.matchMedia(mediaQuery).matches) {
      setBreakpointMatched(true);
    }

    window.matchMedia(mediaQuery).addEventListener("change", mediaQueryHandler);

    return () => {
      window
        .matchMedia(mediaQuery)
        .removeEventListener("change", mediaQueryHandler);
    };
  }, [mediaQuery]);

  return breakpointMatched;
};
