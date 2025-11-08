import { currencyLocales, getWebviewLabels } from "./languages";
import { OFXBody, OFXReport, ReportTransaction } from "./types/ofx";

const BLANK_REPORT: OFXReport = {
  info: "",
  total_income: 0,
  total_expenses: 0,
  net_balance: 0,
  balance: 0,
  transactions_size: 0,
  income_percent: 0,
  expenses_percent: 0,
  transaction_types: [],
  transactions: [],
};

export class Reporter {
  private formatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  reportTransactions(ofxBody: OFXBody): OFXReport {
    this.setFormatter(ofxBody);
    const transactions = this.extractTransactions(ofxBody);

    if (transactions.length === 0) {
      return BLANK_REPORT;
    }

    const income = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = Math.abs(
      transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)
    );

    const incomePercent = ((income * 100) / (income + expenses || 1)).toFixed(2);
    const expensesPercent = ((expenses * 100) / (income + expenses || 1)).toFixed(2);

    const transactionTypes = Array.from(new Set(transactions.map((t) => t.type)));

    return {
      total_income: income,
      total_expenses: expenses,
      net_balance: income - expenses,
      transactions_size: transactions.length,
      income_percent: Number(incomePercent),
      expenses_percent: Number(expensesPercent),
      transaction_types: transactionTypes,
      transactions: transactions,
      ...this.getAccountInfo(ofxBody),
    };
  }

  extractTransactions(ofxBody: OFXBody): ReportTransaction[] {
    const transactions: ReportTransaction[] = [];

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
                date: this.parseDate(tran.DTPOSTED),
                amount: Number(tran.TRNAMT),
                ammount_currency: this.formatCurrency(Number(tran.TRNAMT)),
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
                date: this.parseDate(tran.DTPOSTED),
                amount: Number(tran.TRNAMT),
                ammount_currency: this.formatCurrency(Number(tran.TRNAMT)),
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

  formatCurrency(amount: number): string {
    return this.formatter.format(amount);
  }

  setFormatter(ofxBody: OFXBody): void {
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

    this.formatter = new Intl.NumberFormat(locale.locale, {
      style: "currency",
      currency: locale.currency,
    });
  }

  private getAccountInfo(ofxBody: OFXBody) {
    let info = "";
    let balance = 0;

    if (ofxBody.BANKMSGSRSV1) {
      const stmt = Array.isArray(ofxBody.BANKMSGSRSV1.STMTTRNRS)
        ? ofxBody.BANKMSGSRSV1.STMTTRNRS[0]
        : ofxBody.BANKMSGSRSV1.STMTTRNRS;

      if (stmt?.STMTRS?.BANKACCTFROM) {
        const acct = stmt.STMTRS.BANKACCTFROM;
        info = `{{LABEL_BANK}}: ${acct.BANKID} | {{LABEL_ACCOUNT}}: ${acct.ACCTID} | {{LABEL_TYPE}}: ${acct.ACCTTYPE}`;
      }

      if (stmt?.STMTRS?.LEDGERBAL) {
        balance = stmt.STMTRS.LEDGERBAL.BALAMT;
        info += ` | {{LABEL_BALANCE}}: ${this.formatCurrency(balance)}`;
      }
    }

    Object.entries(getWebviewLabels()).forEach(([key, value]) => {
      info = info.replaceAll(`{{LABEL_${key}}}`, value);
    });

    return { info, balance };
  }

  private parseDate(dateStr: string): Date {
    if (!dateStr || dateStr.length < 8) {
      return new Date();
    }

    const year = String(dateStr).substring(0, 4);
    const month = String(dateStr).substring(4, 6);
    const day = String(dateStr).substring(6, 8);

    return new Date(`${year}-${month}-${day}`);
  }
}
