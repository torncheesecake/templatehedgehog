import mjml2html from "mjml";
import { assertSafeUntrustedMjml } from "./safety";

const MJML_MAX_INPUT_LENGTH = 500_000;

type MjmlErrorEntry = {
  line?: number;
  formattedMessage?: string;
  message?: string;
};

type MjmlCompileResult = {
  html: string;
  errors: MjmlErrorEntry[];
};

type CompileMjmlOptions = {
  trusted?: boolean;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Unknown MJML compile error";
}

export async function compileMjml(
  mjml: string,
  options: CompileMjmlOptions = {},
): Promise<string> {
  const source = String(mjml ?? "");
  const trusted = options.trusted ?? true;

  if (!source.trim()) {
    throw new Error("MJML source is empty.");
  }

  if (source.length > MJML_MAX_INPUT_LENGTH) {
    throw new Error("MJML source is too large to compile safely.");
  }

  if (!trusted) {
    assertSafeUntrustedMjml(source);
  }

  let result: MjmlCompileResult;
  try {
    result = await mjml2html(source, {
      validationLevel: "soft",
      keepComments: true,
      minify: false,
    }) as MjmlCompileResult;
  } catch (error) {
    throw new Error(`MJML compilation failed: ${toErrorMessage(error)}`);
  }

  const errors = Array.isArray(result.errors) ? result.errors : [];

  if (errors.length > 0) {
    const formatted = errors
      .map((entry) => {
        const line = typeof entry.line === "number" ? `line ${entry.line}` : "unknown line";
        const message =
          typeof entry.formattedMessage === "string"
            ? entry.formattedMessage
            : typeof entry.message === "string"
              ? entry.message
              : "Unknown MJML validation error";
        return `${line}: ${message}`;
      })
      .join(" | ");
    throw new Error(`MJML validation failed: ${formatted}`);
  }

  return result.html;
}
