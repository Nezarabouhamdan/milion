/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,vue}",
    "./components/**/*.{ts,tsx,vue}",
    "./app/**/*.{ts,tsx,vue}",
    "./src/**/*.{ts,tsx,vue}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      primary: "#0A0A0A",
      secondary: "#C9A028",
      accent: "#3C3C3C",
      neutral: "#1a1a1a",
      dark: "#0A0A0A",
      white: "#FFFFFF",
      "white-transparent": "rgba(255, 255, 255, 0.1)",
      black: {
        100: "#0A0A0A",
        200: "#141414",
      },
      gray: {
        50: "#252525",
        100: "#2d2d2d",
        200: "#3a3a3a",
        300: "#505050",
        400: "#888888",
        500: "#aaaaaa",
        700: "#cccccc",
        800: "#e0e0e0",
      },
      border: "rgba(10, 10, 10, 0.1)",
      ring: {
        indigo: {
          500: "#6366F1",
        },
      },
    },
    backgroundImage: {
      "hero-gradient":
        "linear-gradient(135deg, rgba(10, 10, 10, 0.85) 0%, rgba(10, 10, 10, 0.65) 100%)",
      "card-gradient": "linear-gradient(145deg, #FFFFFF 0%, #F9F9F9 100%)",
      "property-gradient":
        "linear-gradient(to top, rgba(10, 10, 10, 0.8) 0%, rgba(10, 10, 10, 0) 60%)",
      "gold-gradient": "linear-gradient(145deg, #D4AF37 0%, #F2DC9E 100%)",
    },
    extend: {
      fontFamily: {
        sans: ["Arshelina", "sans-serif"],
        heading: ["Arshelina", "serif"],
        alt: ["Arshelina", "sans-serif"],
        arabic: ["Noto Sans Arabic", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 40px rgba(10, 10, 10, 0.05)",
        "card-hover": "0 15px 60px rgba(10, 10, 10, 0.1)",
        subtle: "0 4px 20px rgba(10, 10, 10, 0.03)",
        gold: "0 10px 30px rgba(212, 175, 55, 0.2)",
      },
      borderRadius: {
        none: "0",
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "rgb(var(--border))",
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        placeholder: {
          gray: {
            50: "#F9F9F9",
            100: "#F5F5F5",
            200: "#E5E5E5",
            300: "#CCCCCC",
            400: "#666666",
            500: "#555555",
            700: "#333333",
            800: "#222222",
          },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 1s ease-out forwards",
        "slide-right": "slideRight 0.8s ease-out forwards",
        "zoom-in": "zoomIn 1.2s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        slideUp: {
          "0%": {
            transform: "translateY(20px)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
        slideRight: {
          "0%": {
            transform: "translateX(-20px)",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
        zoomIn: {
          "0%": {
            transform: "scale(0.95)",
            opacity: 0,
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1,
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--reka-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--reka-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
