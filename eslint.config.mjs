import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * The generated look comes from defaults, so the fix is to make the defaults fail the
 * build. Each entry below is a pattern this codebase deliberately moved away from; if
 * one reappears, lint stops it rather than a reviewer having to notice.
 *
 * Matched against string literals and template chunks alike, so it catches classes
 * hidden in `const styles = "..."` as well as inline className props.
 */
const banned = [
  {
    pattern: "\\b(bg|text|border)-(indigo|violet|purple|slate|zinc|gray|neutral)-\\d",
    message:
      "Default Tailwind palette. Use the project tokens (teal / cyan / orange / cream / ink / muted).",
  },
  {
    pattern: "\\brounded-(?!full\\b)\\S",
    message:
      "Arbitrary corner radius. The vocabulary is: square by default, `.arch` for imagery, `rounded-full` for the one pill.",
  },
  {
    pattern: "\\bbg-(linear|gradient)-to-",
    message:
      "Diagonal gradient utility. Flat colour and photography carry this design; write a scrim as an explicit bg-[linear-gradient(...)] if it is genuinely functional.",
  },
  {
    pattern: "\\bfont-(extrabold|black)\\b",
    message:
      "Headlines get their weight from size and the display face, not from 800. Use font-medium or font-semibold.",
  },
];

const noSlop = banned.flatMap(({ pattern, message }) => [
  { selector: `Literal[value=/${pattern}/]`, message },
  { selector: `TemplateElement[value.raw=/${pattern}/]`, message },
]);

const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: { "no-restricted-syntax": ["error", ...noSlop] },
  },
];

export default eslintConfig;
