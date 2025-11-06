import * as vscode from "vscode";

import { OFXDocumentFormattingProvider } from "./formatter";
import { OFXHoverProvider } from "./hoverProvider";
import { OFXConverter } from "./converter";
import { OFXCodeActionProvider } from "./codeActionProvider";
import { OFXCodeLensProvider } from "./codeLensProvider";
import { OFXWebviewPanel } from "./webview_panel";

export function activate(context: vscode.ExtensionContext) {
  const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider(
    "ofx",
    new OFXDocumentFormattingProvider()
  );

  const hoverProvider = vscode.languages.registerHoverProvider("ofx", new OFXHoverProvider());

  const codeActionProvider = vscode.languages.registerCodeActionsProvider(
    "ofx",
    new OFXCodeActionProvider(),
    {
      providedCodeActionKinds: [vscode.CodeActionKind.RefactorRewrite],
    }
  );

  const codeLensProvider = vscode.languages.registerCodeLensProvider(
    "ofx",
    new OFXCodeLensProvider()
  );

  const viewTransactionsCommand = vscode.commands.registerCommand(
    "ofx.viewTransactions",
    async (uri: vscode.Uri) => {
      OFXWebviewPanel.createOrShow(context.extensionUri, uri);
    }
  );

  const convertToJsonCommand = vscode.commands.registerCommand("ofx.convertToJson", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== "ofx") {
      vscode.window.showErrorMessage("Please open an OFX file");
      return;
    }

    const converter = new OFXConverter();
    const text = editor.document.getText();

    try {
      const result = converter.convert(text, "json");
      const doc = await vscode.workspace.openTextDocument({
        content: result.content,
        language: "json",
      });
      await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
    } catch (error) {
      vscode.window.showErrorMessage(`Conversion failed: ${error}`);
    }
  });

  context.subscriptions.push(
    formattingProvider,
    hoverProvider,
    codeActionProvider,
    codeLensProvider,
    convertToJsonCommand,
    viewTransactionsCommand
  );
}

export function deactivate() {}
