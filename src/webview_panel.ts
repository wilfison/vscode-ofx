import fs from "node:fs";
import * as vscode from "vscode";

import ofxToJSON from "./parsers/ofx_to_json";
import { OFXDocument, OFXReport, ReportTransaction } from "./types/ofx";
import { getWebviewLabels } from "./languages";
import { Reporter } from "./reporter";

export class OFXWebviewPanel {
  private static currentPanel: OFXWebviewPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private disposables: vscode.Disposable[] = [];
  private reporter: Reporter = new Reporter();

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
  }

  public static createOrShow(extensionUri: vscode.Uri, documentUri: vscode.Uri) {
    const column = vscode.ViewColumn.Two;

    if (OFXWebviewPanel.currentPanel) {
      OFXWebviewPanel.currentPanel.panel.reveal(column);
      OFXWebviewPanel.currentPanel.update(documentUri);
      return;
    }

    const panel = vscode.window.createWebviewPanel("ofxTransactions", "OFX Transactions", column, {
      enableScripts: true,
      localResourceRoots: [extensionUri],
    });

    OFXWebviewPanel.currentPanel = new OFXWebviewPanel(panel, extensionUri);
    OFXWebviewPanel.currentPanel.update(documentUri);
  }

  private async update(documentUri: vscode.Uri) {
    const document = await vscode.workspace.openTextDocument(documentUri);
    const text = document.getText();

    try {
      const ofxData = ofxToJSON(text);
      const report = this.reporter.reportTransactions(ofxData.body.OFX);
      this.panel.webview.html = this.getHtmlContent(ofxData, report);

      // Handle messages from the webview
      this.panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case "filter":
              this.panel.webview.html = this.getHtmlContent(ofxData, report, message.filter);
              break;
          }
        },
        null,
        this.disposables
      );
    } catch (error) {
      this.panel.webview.html = this.getErrorHtml(String(error));
    }
  }

  private getHtmlContent(ofxData: OFXDocument, report: OFXReport, filter?: string): string {
    const filteredTransactions = filter
      ? report.transactions.filter((t) => t.type === filter)
      : report.transactions;

    let template = fs.readFileSync(__dirname + "/../templates/panel.html", "utf8");

    template = template.replace("{{ACCOUNT_INFO}}", report.info);
    template = template.replace(
      "{{TOTAL_INCOME}}",
      this.reporter.formatCurrency(report.total_income)
    );
    template = template.replace(
      "{{TOTAL_EXPENSES}}",
      this.reporter.formatCurrency(report.total_expenses)
    );
    template = template.replace(
      "{{NET_BALANCE}}",
      this.reporter.formatCurrency(report.net_balance)
    );
    template = template.replace("{{TOTAL_TRANSACTIONS}}", String(report.transactions_size));
    template = template.replaceAll("{{INCOME_PERCENT}}", report.income_percent.toFixed(2));
    template = template.replaceAll("{{EXPENSES_PERCENT}}", report.expenses_percent.toFixed(2));

    template = template.replace(
      "{{FILTER_BUTTONS}}",
      `
      <button class="filter-btn ${!filter ? "active" : ""}" onclick="filterTransactions('')">
        {{LABEL_FILTER_ALL}} (${report.transactions.length})
        </button>
        ${report.transaction_types
          .map(
            (type) => `
            <button
              class="filter-btn ${filter === type ? "active" : ""}" 
              onclick="filterTransactions('${type}')">
                ${type} (${report.transactions.filter((t) => t.type === type).length})
            </button>
        `
          )
          .join("")}
    `
    );

    if (filteredTransactions.length === 0) {
      template = template.replace(
        "{{TRANSACTIONS_ROWS}}",
        `
        <tr>
          <td colspan="5" style="text-align: center; padding: 20px;">
            <div class="empty-state">
              <p>No transactions found${filter ? ` for type: ${filter}` : ""}.</p>
            </div>
          </td>
        </tr>
      `
      );
    } else {
      template = template.replace(
        "{{TRANSACTIONS_ROWS}}",
        filteredTransactions.map((t) => this.getTransactionRowHtml(t)).join("")
      );
    }

    Object.entries(getWebviewLabels()).forEach(([key, value]) => {
      template = template.replaceAll(`{{LABEL_${key}}}`, value);
    });

    return template;
  }

  private getErrorHtml(error: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 40px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
        }
        .error {
            background: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            padding: 20px;
            border-radius: 4px;
        }
        h1 {
            color: var(--vscode-errorForeground);
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="error">
        <h1>Error parsing OFX file</h1>
        <p>${error}</p>
    </div>
</body>
</html>`;
  }

  private getTransactionRowHtml(transaction: ReportTransaction): string {
    const transacitionTypeClass = transaction.amount >= 0 ? "positive" : "negative";

    return `
      <tr>
        <td>
          ${transaction.date.toLocaleDateString()}
        </td>
        <td>
          <span class="transaction-type ${transacitionTypeClass}">
            ${transaction.type}
          </span>
        </td>
        <td>
          ${transaction.name || transaction.memo || "-"}
        </td>
        <td class="amount ${transacitionTypeClass}">
            ${transaction.ammount_currency}
        </td>
        <td style="font-family: monospace; font-size: 12px;">
          ${transaction.id}
        </td>
      </tr>
    `;
  }

  public dispose() {
    OFXWebviewPanel.currentPanel = undefined;

    this.panel.dispose();

    while (this.disposables.length) {
      const disposable = this.disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
