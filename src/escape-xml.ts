const XML_ESCAPES: Record<string, string> = {
  '"': "&quot;",
  "&": "&amp;",
  "'": "&apos;",
  "<": "&lt;",
  ">": "&gt;",
};

export function escapeXml(value: string): string {
  return value.replace(/["&'<>]/g, (character) => XML_ESCAPES[character] ?? character);
}
