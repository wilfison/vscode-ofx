import * as vscode from "vscode";

import { OFXDocumentFormattingProvider } from "./formatter";

export function activate(context: vscode.ExtensionContext) {
  const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider(
    "ofx",
    new OFXDocumentFormattingProvider()
  );

  context.subscriptions.push(formattingProvider);

  // Future enhancements can include:
  // - Hover provider for OFX tag information
  // - Validation and diagnostics
}

export function deactivate() {}
