import test from "node:test";
import assert from "node:assert/strict";
import { copyTextToClipboard } from "./clipboard";

function createDocumentDouble(options?: { execCommandResult?: boolean }) {
  const created: {
    value: string;
    style: Record<string, string>;
    attributes: Record<string, string>;
    focused: boolean;
    selected: boolean;
    selectionRange: [number, number] | null;
  } = {
    value: "",
    style: {},
    attributes: {},
    focused: false,
    selected: false,
    selectionRange: null,
  };

  const appended: unknown[] = [];

  const textarea = {
    value: "",
    style: created.style,
    setAttribute(name: string, value: string) {
      created.attributes[name] = value;
    },
    focus() {
      created.focused = true;
    },
    select() {
      created.selected = true;
    },
    setSelectionRange(start: number, end: number) {
      created.selectionRange = [start, end];
    },
  };

  const documentDouble = {
    body: {
      appendChild(node: unknown) {
        appended.push(node);
      },
      removeChild(node: unknown) {
        const index = appended.indexOf(node);
        if (index >= 0) {
          appended.splice(index, 1);
        }
      },
    },
    createElement(tagName: string) {
      assert.equal(tagName, "textarea");
      return textarea;
    },
    execCommand(command: string) {
      assert.equal(command, "copy");
      return options?.execCommandResult ?? true;
    },
  };

  return {
    documentDouble,
    created,
    appended,
    textarea,
  };
}

test("copyTextToClipboard uses navigator clipboard when available", async () => {
  let received = "";
  const result = await copyTextToClipboard("line1\r\nline2", {
    clipboard: {
      async writeText(text: string) {
        received = text;
      },
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.method, "clipboard");
  assert.equal(received, "line1\nline2");
});

test("copyTextToClipboard falls back to execCommand", async () => {
  const { documentDouble, created, appended } = createDocumentDouble({
    execCommandResult: true,
  });

  const result = await copyTextToClipboard("<mjml>demo</mjml>", {
    clipboard: {
      async writeText() {
        throw new Error("permission_denied");
      },
    },
    document: documentDouble,
  });

  assert.equal(result.ok, true);
  assert.equal(result.method, "execCommand");
  assert.equal(created.focused, true);
  assert.equal(created.selected, true);
  assert.deepEqual(created.selectionRange, [0, "<mjml>demo</mjml>".length]);
  assert.equal(appended.length, 0);
});

test("copyTextToClipboard rejects empty input", async () => {
  const result = await copyTextToClipboard("   ");

  assert.equal(result.ok, false);
  assert.equal(result.reason, "empty_source");
});
