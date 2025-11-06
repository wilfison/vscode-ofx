import fs from "node:fs";
import * as vscode from "vscode";

import ofxToJSON from "./parsers/ofx_to_json";
import { OFXBody, OFXDocument } from "./types/ofx";
import { currencyLocales, getWebviewLabels } from "./languages";

interface Transaction {
  type: string;
  date: string;
  amount: number;
  id: string;
  memo?: string;
  name?: string;
}

export class OFXWebviewPanel {
  private static currentPanel: OFXWebviewPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private disposables: vscode.Disposable[] = [];
  private formatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

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
      this.formatter = this.buildFormatter(ofxData.body.OFX);
      const transactions = this.extractTransactions(ofxData.body.OFX);
      this.panel.webview.html = this.getHtmlContent(ofxData, transactions);

      // Handle messages from the webview
      this.panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case "filter":
              this.panel.webview.html = this.getHtmlContent(ofxData, transactions, message.filter);
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

  private extractTransactions(ofxBody: OFXBody): Transaction[] {
    const transactions: Transaction[] = [];

    // Extract bank transactions
    if (ofxBody.BANKMSGSRSV1) {
      const bankMsg = ofxBody.BANKMSGSRSV1;
      const stmtTrnrs = Array.isArray(bankMsg.STMTTRNRS) ? bankMsg.STMTTRNRS : [bankMsg.STMTTRNRS];

      for (const stmt of stmtTrnrs) {
        if (stmt.STMTRS?.BANKTRANLIST) {
          const tranList = stmt.STMTRS.BANKTRANLIST.STMTTRN;
          const trans = Array.isArray(tranList) ? tranList : [tranList];

          for (const tran of trans) {
            if (tran) {
              transactions.push({
                type: tran.TRNTYPE,
                date: this.formatDate(tran.DTPOSTED),
                amount: Number(tran.TRNAMT),
                id: tran.FITID,
                memo: tran.MEMO,
                name: tran.NAME,
              });
            }
          }
        }
      }
    }

    // Extract credit card transactions
    if (ofxBody.CREDITCARDMSGSRSV1) {
      const ccMsg = ofxBody.CREDITCARDMSGSRSV1;
      const ccStmtTrnrs = Array.isArray(ccMsg.CCSTMTTRNRS)
        ? ccMsg.CCSTMTTRNRS
        : [ccMsg.CCSTMTTRNRS];

      for (const stmt of ccStmtTrnrs) {
        if (stmt.CCSTMTRS?.BANKTRANLIST) {
          const tranList = stmt.CCSTMTRS.BANKTRANLIST.STMTTRN;
          const trans = Array.isArray(tranList) ? tranList : [tranList];

          for (const tran of trans) {
            if (tran) {
              transactions.push({
                type: tran.TRNTYPE,
                date: this.formatDate(tran.DTPOSTED),
                amount: Number(tran.TRNAMT),
                id: tran.FITID,
                memo: tran.MEMO,
                name: tran.NAME,
              });
            }
          }
        }
      }
    }

    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private formatDate(dateStr: string): string {
    if (!dateStr || dateStr.length < 8) {
      return dateStr;
    }

    const year = String(dateStr).substring(0, 4);
    const month = String(dateStr).substring(4, 6);
    const day = String(dateStr).substring(6, 8);

    return `${year}-${month}-${day}`;
  }

  private getAccountInfo(ofxBody: OFXBody): string {
    let accountInfo = "";

    if (ofxBody.BANKMSGSRSV1) {
      const stmt = Array.isArray(ofxBody.BANKMSGSRSV1.STMTTRNRS)
        ? ofxBody.BANKMSGSRSV1.STMTTRNRS[0]
        : ofxBody.BANKMSGSRSV1.STMTTRNRS;

      if (stmt?.STMTRS?.BANKACCTFROM) {
        const acct = stmt.STMTRS.BANKACCTFROM;
        accountInfo = `{{LABEL_BANK}}: ${acct.BANKID} | {{LABEL_ACCOUNT}}: ${acct.ACCTID} | {{LABEL_TYPE}}: ${acct.ACCTTYPE}`;
      }

      if (stmt?.STMTRS?.LEDGERBAL) {
        const balance = stmt.STMTRS.LEDGERBAL;
        accountInfo += ` | {{LABEL_BALANCE}}: ${this.formatCurrency(balance.BALAMT)}`;
      }
    }

    return accountInfo;
  }

  private buildFormatter(ofxBody: OFXBody): Intl.NumberFormat {
    let ofxCurrency = "USD";

    if (ofxBody.BANKMSGSRSV1?.STMTTRNRS) {
      const stmtTrnrs = ofxBody.BANKMSGSRSV1.STMTTRNRS;
      if (Array.isArray(stmtTrnrs)) {
        ofxCurrency = String(stmtTrnrs[0]?.STMTRS?.CURDEF);
      } else {
        ofxCurrency = String(stmtTrnrs?.STMTRS?.CURDEF);
      }
    }

    if (!ofxCurrency) {
      ofxCurrency = "USD";
    }

    const locale =
      Object.entries(currencyLocales).find(([, v]) => v.currency === ofxCurrency)?.[1] ||
      currencyLocales.USD;

    return new Intl.NumberFormat(locale.locale, {
      style: "currency",
      currency: locale.currency,
    });
  }

  private formatCurrency(amount: number): string {
    return this.formatter.format(amount);
  }

  private getHtmlContent(
    ofxData: OFXDocument,
    transactions: Transaction[],
    filter?: string
  ): string {
    const filteredTransactions = filter
      ? transactions.filter((t) => t.type === filter)
      : transactions;

    const income = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = Math.abs(
      transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)
    );

    const incomePercent = ((income * 100) / (income + expenses || 1)).toFixed(2);
    const expensesPercent = ((expenses * 100) / (income + expenses || 1)).toFixed(2);

    const transactionTypes = Array.from(new Set(transactions.map((t) => t.type)));
    const accountInfo = this.getAccountInfo(ofxData.body.OFX);

    let template = fs.readFileSync(__dirname + "/../templates/panel.html", "utf8");

    template = template.replace("{{ACCOUNT_INFO}}", accountInfo);
    template = template.replace("{{TOTAL_INCOME}}", this.formatCurrency(income));
    template = template.replace("{{TOTAL_EXPENSES}}", this.formatCurrency(expenses));
    template = template.replace("{{NET_BALANCE}}", this.formatCurrency(income - expenses));
    template = template.replace("{{TOTAL_TRANSACTIONS}}", transactions.length.toString());
    template = template.replaceAll("{{INCOME_PERCENT}}", incomePercent);
    template = template.replaceAll("{{EXPENSES_PERCENT}}", expensesPercent);

    template = template.replace(
      "{{FILTER_BUTTONS}}",
      `
      <button class="filter-btn ${!filter ? "active" : ""}" onclick="filterTransactions('')">
        All (${transactions.length})
        </button>
        ${transactionTypes
          .map(
            (type) => `
            <button
              class="filter-btn ${filter === type ? "active" : ""}" 
              onclick="filterTransactions('${type}')">
                ${type} (${transactions.filter((t) => t.type === type).length})
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

  private getTransactionRowHtml(transaction: Transaction): string {
    const transacitionTypeClass = transaction.amount >= 0 ? "positive" : "negative";

    return `
      <tr>
        <td>
          ${transaction.date}
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
            ${this.formatCurrency(transaction.amount)}
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
