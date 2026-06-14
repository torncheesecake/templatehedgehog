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
  /**
   * Absolute path of the source file. Only used on the trusted build/pack path so
   * mjml can resolve <mj-include> relative to the file. Ignored on the untrusted path,
   * where includes are rejected up front by assertSafeUntrustedMjml.
   */
  filePath?: string;
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
    // Untrusted (Studio/local-compile) input must never reach mjml's include resolver.
    // This rejects <mj-include>, file:// paths and remote mj-font fetches before compilation.
    assertSafeUntrustedMjml(source);
  }

  let result: MjmlCompileResult;
  try {
    result = await mjml2html(source, {
      validationLevel: "soft",
      keepComments: true,
      minify: false,
      // Resolve <mj-include> only on the trusted first-party build/pack path (so the
      // Enterprise shared head resolves at build time). On the untrusted path includes
      // are already rejected above, so we hard-disable resolution as defence in depth.
      ignoreIncludes: !trusted,
      ...(trusted && options.filePath ? { filePath: options.filePath } : {}),
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
