import * as vscode from "vscode";

import { OFXDocumentFormattingProvider } from "./formatter";
import { OFXHoverProvider } from "./hoverProvider";

export function activate(context: vscode.ExtensionContext) {
  const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider(
    "ofx",
    new OFXDocumentFormattingProvider()
  );

  const hoverProvider = vscode.languages.registerHoverProvider("ofx", new OFXHoverProvider());

  context.subscriptions.push(formattingProvider, hoverProvider);
}

export function deactivate() {}
