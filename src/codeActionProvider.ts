import * as vscode from "vscode";
import { OFXConverter } from "./converter";

export class OFXCodeActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.CodeAction[] | undefined {
    const convertAction = new vscode.CodeAction(
      "Convert to JSON",
      vscode.CodeActionKind.RefactorRewrite
    );
    convertAction.command = {
      command: "ofx.convertToJson",
      title: "Convert OFX to JSON",
    };

    return [convertAction];
  }
}
