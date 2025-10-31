import * as vscode from "vscode";

export class OFXDocumentFormattingProvider implements vscode.DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.TextEdit[] {
    // Check if formatting is enabled
    const config = vscode.workspace.getConfiguration("ofx");
    const enabled = config.get<boolean>("format.enable", true);

    if (!enabled) {
      return [];
    }

    const text = document.getText();
    const formatted = this.formatOFX(text, options);

    const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));

    return [vscode.TextEdit.replace(fullRange, formatted)];
  }

  private formatOFX(text: string, options: vscode.FormattingOptions): string {
    const lines = text.split(/\r?\n/);
    const formattedLines: string[] = [];
    let indentLevel = 0;
    const indentChar = options.insertSpaces ? " ".repeat(options.tabSize) : "\t";
    let inHeader = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Empty lines
      if (line === "") {
        formattedLines.push("");
        continue;
      }

      // Header lines (KEY:VALUE format)
      if (line.match(/^[A-Z]+:/) && inHeader) {
        formattedLines.push(line);
        continue;
      }

      // After headers, we're in the body
      if (line.startsWith("<")) {
        inHeader = false;
      }

      // Comments
      if (line.startsWith("<!--")) {
        formattedLines.push(indentChar.repeat(indentLevel) + line);
        continue;
      }

      // XML style: <TAG>value</TAG> on same line
      const xmlSingleLineMatch = line.match(/^(<[A-Z][A-Z0-9]*>)(.+?)(<\/[A-Z][A-Z0-9]*>)$/);
      if (xmlSingleLineMatch) {
        formattedLines.push(indentChar.repeat(indentLevel) + line);
        continue;
      }

      // Closing tag only
      if (line.match(/^<\/[A-Z][A-Z0-9]*>$/)) {
        indentLevel = Math.max(0, indentLevel - 1);
        formattedLines.push(indentChar.repeat(indentLevel) + line);
        continue;
      }

      // Opening tag only (will increase indent)
      if (line.match(/^<[A-Z][A-Z0-9]*>$/)) {
        formattedLines.push(indentChar.repeat(indentLevel) + line);
        indentLevel++;
        continue;
      }

      // SGML style: <TAG>value (no closing tag)
      const sgmlMatch = line.match(/^<[A-Z][A-Z0-9]*>(.+)$/);
      if (sgmlMatch) {
        formattedLines.push(indentChar.repeat(indentLevel) + line);
        continue;
      }

      // Regular content lines (plain text between tags)
      formattedLines.push(indentChar.repeat(indentLevel) + line);
    }

    return formattedLines.join("\n");
  }
}
