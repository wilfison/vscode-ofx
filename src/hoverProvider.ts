import * as vscode from "vscode";
import { getTagDescription } from "./languages";
import { TRANSACTION_TYPES } from "./constants";

/**
 * Provides hover information for OFX tags
 */
export class OFXHoverProvider implements vscode.HoverProvider {
  /**
   * Provides hover information for the given position in the document
   */
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    // Get the word at the current position
    const wordRange = document.getWordRangeAtPosition(position, /\/?[A-Z][A-Z0-9]*/);

    if (!wordRange) {
      return undefined;
    }

    const word = document.getText(wordRange).replace("/", ""); // Remove leading slash from closing tags

    // Get the description for this tag
    const description = getTagDescription(word);

    if (!description) {
      return undefined;
    }

    // Check if this is actually a tag (enclosed in < >)
    const line = document.lineAt(position.line).text;
    const wordStart = wordRange.start.character;
    const isTransactionType = TRANSACTION_TYPES.includes(word);

    // Look for opening tag
    let isTag = false;
    if (wordStart > 0 && line[wordStart - 1] === "<") {
      isTag = true;
    }

    if (!isTag && !isTransactionType) {
      return undefined;
    }

    // Create hover content with markdown
    const markdown = new vscode.MarkdownString();
    markdown.appendCodeblock(word, "ofx");
    markdown.appendMarkdown(description);

    return new vscode.Hover(markdown, wordRange);
  }
}
