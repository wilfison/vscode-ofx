import * as vscode from "vscode";

export class OFXCodeLensProvider implements vscode.CodeLensProvider {
  public provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    const codeLenses: vscode.CodeLens[] = [];

    // Add code lens at the top of the document
    const topOfDocument = new vscode.Range(0, 0, 0, 0);

    const viewTransactionsLens = new vscode.CodeLens(topOfDocument, {
      title: "📊 View Transactions",
      command: "ofx.viewTransactions",
      arguments: [document.uri],
    });

    codeLenses.push(viewTransactionsLens);

    return codeLenses;
  }
}
