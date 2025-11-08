import { OFXBody, OFXReport, ReportTransaction } from "./types/ofx";

const BLANK_REPORT: OFXReport = {
  total_income: 0,
  total_expenses: 0,
  net_balance: 0,
  total_transactions: 0,
  income_percent: 0,
  expenses_percent: 0,
  transaction_types: [],
  transactions: [],
};

export class Reporter {
  reportTransactions(ofxBody: OFXBody): OFXReport {
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
      total_transactions: transactions.length,
      income_percent: Number(incomePercent),
      expenses_percent: Number(expensesPercent),
      transaction_types: transactionTypes,
      transactions: transactions,
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
