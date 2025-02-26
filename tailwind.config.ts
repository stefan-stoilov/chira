import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: {
          DEFAULT: "hsl(var(--background))",
          hovered: "hsl(var(--background-hovered))",
          pressed: "hsl(var(--background-pressed))",
          neutral: {
            DEFAULT: "hsl(var(--background-neutral) / 0.07)",
            hovered: "hsl(var(--background-neutral) / 0.15)",
            pressed: "hsl(var(--background-neutral) / 0.295)",
          },
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          subtle: "hsl(var(--foreground-subtle))",
          muted: "hsl(var(--foreground-muted))",
          inverse: "hsl(var(--foreground-inverse))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hovered: "hsl(var(--primary-hovered))",
          pressed: "hsl(var(--primary-pressed))",
          subtle: {
            DEFAULT: "hsl(var(--primary-subtle))",
            hovered: "hsl(var(--primary-subtle-hovered))",
            pressed: "hsl(var(--primary-subtle-pressed))",
          },
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          hovered: "hsl(var(--muted-hovered))",
          pressed: "hsl(var(--muted-pressed))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          hovered: "hsl(var(--accent-hovered))",
          pressed: "hsl(var(--accent-pressed))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          hovered: "hsl(var(--destructive-hovered))",
          pressed: "hsl(var(--destructive-pressed))",
          subtle: {
            DEFAULT: "hsl(var(--destructive-subtle))",
            hovered: "hsl(var(--destructive-subtle-hovered))",
            pressed: "hsl(var(--destructive-subtle-pressed))",
          },
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          hovered: "hsl(var(--warning-hovered))",
          pressed: "hsl(var(--warning-pressed))",
          subtle: {
            DEFAULT: "hsl(var(--warning-subtle))",
            hovered: "hsl(var(--warning-subtle-hovered))",
            pressed: "hsl(var(--warning-subtle-pressed))",
          },
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          hovered: "hsl(var(--success-hovered))",
          pressed: "hsl(var(--success-pressed))",
          subtle: {
            DEFAULT: "hsl(var(--success-subtle))",
            hovered: "hsl(var(--success-subtle-hovered))",
            pressed: "hsl(var(--success-subtle-pressed))",
          },
        },
        border: "hsl(var(--border) / 0.15)",
        input: "hsl(var(--input) / 0.15)",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border) / 0.15)",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
