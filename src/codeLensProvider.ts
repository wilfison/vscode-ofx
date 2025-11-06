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
      title: "$(dashboard) View Transactions",
      command: "ofx.viewTransactions",
      arguments: [document.uri],
    });

    const exportToJsonLens = new vscode.CodeLens(topOfDocument, {
      title: "$(json) Export to JSON",
      command: "ofx.convertToJson",
      arguments: [document.uri],
    });

    codeLenses.push(viewTransactionsLens);
    codeLenses.push(exportToJsonLens);

    return codeLenses;
  }
}
