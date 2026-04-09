export type CopyMethod = "clipboard" | "execCommand";

export type CopyTextResult = {
  ok: boolean;
  method?: CopyMethod;
  reason?: "empty_source" | "unsupported" | "failed";
};

type ClipboardLike = {
  writeText?: (text: string) => Promise<void>;
};

type TextAreaLike = {
  value: string;
  style: Record<string, string>;
  setAttribute: (name: string, value: string) => void;
  focus: (options?: { preventScroll?: boolean }) => void;
  select: () => void;
  setSelectionRange?: (start: number, end: number) => void;
};

type DocumentLike = {
  body?: {
    appendChild: (node: unknown) => void;
    removeChild: (node: unknown) => void;
  };
  createElement: (tagName: string) => TextAreaLike;
  execCommand?: (command: string) => boolean;
};

export type ClipboardEnvironment = {
  clipboard?: ClipboardLike;
  document?: DocumentLike;
};

const WRITE_TIMEOUT_MS = 1800;

function normaliseClipboardText(text: string): string {
  return text.replace(/\r\n/g, "\n");
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("clipboard_timeout")), timeoutMs);
    }),
  ]);
}

function copyWithExecCommand(text: string, documentLike?: DocumentLike): boolean {
  if (!documentLike?.body || typeof documentLike.execCommand !== "function") {
    return false;
  }

  const textArea = documentLike.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("aria-hidden", "true");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  textArea.style.opacity = "0";
  textArea.style.pointerEvents = "none";

  documentLike.body.appendChild(textArea);

  try {
    textArea.focus({ preventScroll: true });
    textArea.select();
    textArea.setSelectionRange?.(0, textArea.value.length);
    return documentLike.execCommand("copy");
  } catch {
    return false;
  } finally {
    documentLike.body.removeChild(textArea);
  }
}

export async function copyTextToClipboard(
  source: string,
  environment?: ClipboardEnvironment,
): Promise<CopyTextResult> {
  const text = normaliseClipboardText(source);
  if (!text.trim()) {
    return {
      ok: false,
      reason: "empty_source",
    };
  }

  const clipboard =
    environment?.clipboard ?? (typeof navigator !== "undefined" ? navigator.clipboard : undefined);
  const documentLike =
    environment?.document ?? (typeof document !== "undefined" ? (document as DocumentLike) : undefined);

  if (clipboard?.writeText) {
    try {
      await withTimeout(clipboard.writeText(text), WRITE_TIMEOUT_MS);
      return {
        ok: true,
        method: "clipboard",
      };
    } catch {
      const fallbackCopied = copyWithExecCommand(text, documentLike);
      if (fallbackCopied) {
        return {
          ok: true,
          method: "execCommand",
        };
      }

      return {
        ok: false,
        reason: "failed",
      };
    }
  }

  const fallbackCopied = copyWithExecCommand(text, documentLike);
  if (fallbackCopied) {
    return {
      ok: true,
      method: "execCommand",
    };
  }

  return {
    ok: false,
    reason: documentLike ? "failed" : "unsupported",
  };
}
