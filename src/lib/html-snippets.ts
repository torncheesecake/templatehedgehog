function normalise(source: string): string {
  return source.replace(/\r\n/g, "\n").trim();
}

function extractBetweenCommentMarkers(source: string): string | null {
  const startMarker = source.match(/<!--[^>]*START[^>]*-->/i);
  if (!startMarker || typeof startMarker.index !== "number") {
    return null;
  }

  const startIndex = startMarker.index;
  const afterStartIndex = startIndex + startMarker[0].length;
  const afterStart = source.slice(afterStartIndex);
  const endMarker = afterStart.match(/<!--[^>]*END[^>]*-->/i);

  if (!endMarker || typeof endMarker.index !== "number") {
    return null;
  }

  const contentBetween = afterStart.slice(0, endMarker.index);
  return `${startMarker[0]}${contentBetween}${endMarker[0]}`.trim();
}

function extractBodyInnerHtml(source: string): string | null {
  const bodyMatch = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch || typeof bodyMatch[1] !== "string") {
    return null;
  }

  return bodyMatch[1].trim();
}

export function extractComponentHtmlSnippet(standaloneHtml: string): string {
  const normalised = normalise(standaloneHtml);
  if (!normalised) {
    return "";
  }

  const commentSlice = extractBetweenCommentMarkers(normalised);
  if (commentSlice) {
    return commentSlice;
  }

  const bodySlice = extractBodyInnerHtml(normalised);
  if (bodySlice) {
    return bodySlice;
  }

  return normalised;
}

