import { LanguageRegistry } from ".";
import { OFXTagDescriptions } from "../types/tags";

/**
 * English descriptions for OFX tags
 */
export const ofxTags: OFXTagDescriptions = {
  // Root elements
  OFX: "Open Financial Exchange - Root element containing all OFX data",
  SIGNONMSGSRSV1: "Sign-on Message Response Set - Contains authentication and session information",
  BANKMSGSRSV1: "Bank Message Response Set - Contains bank account statements and transactions",
  CREDITCARDMSGSRSV1:
    "Credit Card Message Response Set - Contains credit card statements and transactions",

  // Signon Response
  SONRS: "Sign-on Response - Authentication and session status information",
  STATUS: "Status - Response status information",
  CODE: "Status Code - Numeric code indicating success or error type",
  SEVERITY: "Severity - Indicates if the status is INFO, WARN, or ERROR",
  DTSERVER: "Server Date/Time - Date and time on the server when the response was generated",
  LANGUAGE: "Language - Language used in the response",
  FI: "Financial Institution - Information about the financial institution",
  ORG: "Organization - Name or identifier of the financial institution",
  FID: "Financial Institution ID - Unique identifier for the financial institution",

  // Bank Statement Response
  STMTTRNRS: "Statement Transaction Response - Wrapper for bank statement response",
  TRNUID: "Transaction Unique ID - Unique identifier for this transaction request",
  STMTRS: "Statement Response - Contains the actual statement data",
  CURDEF: "Currency Definition - Default currency for all amounts in the statement",
  BANKACCTFROM: "Bank Account From - Identifies the bank account for this statement",
  BANKID: "Bank ID - Routing number or other bank identifier",
  ACCTID: "Account ID - Account number",
  ACCTTYPE: "Account Type - Type of account (CHECKING, SAVINGS, MONEYMRKT, CREDITLINE)",

  // Bank Transaction List
  BANKTRANLIST: "Bank Transaction List - List of all transactions in the statement period",
  DTSTART: "Start Date - Beginning date of the statement period",
  DTEND: "End Date - Ending date of the statement period",
  STMTTRN: "Statement Transaction - A single financial transaction",
  TRNTYPE: "Transaction Type - Type of transaction (DEBIT, CREDIT, etc.)",
  DTPOSTED: "Date Posted - Date the transaction was posted to the account",
  TRNAMT: "Transaction Amount - Amount of the transaction (negative for debits)",
  FITID: "Financial Institution Transaction ID - Unique identifier assigned by the FI",
  CHECKNUM: "Check Number - Check number for check transactions",
  REFNUM: "Reference Number - Reference number assigned by the FI",
  MEMO: "Memo - Additional information about the transaction",
  NAME: "Name - Payee or description of the transaction",

  // Ledger Balance
  LEDGERBAL: "Ledger Balance - Current ledger balance of the account",
  BALAMT: "Balance Amount - The actual balance amount",
  DTASOF: "Date As Of - Date and time of the balance",

  // Available Balance
  AVAILBAL: "Available Balance - Amount available for withdrawal",

  // Credit Card Statement Response
  CCSTMTTRNRS: "Credit Card Statement Transaction Response - Wrapper for credit card statement",
  CCSTMTRS: "Credit Card Statement Response - Contains credit card statement data",
  CCACCTFROM: "Credit Card Account From - Identifies the credit card account",
  ACCTKEY: "Account Key - Checksum or other identifier for the account number",

  // Transaction Types
  CREDIT: "Credit - Generic credit transaction",
  DEBIT: "Debit - Generic debit transaction",
  INT: "Interest - Interest earned or paid",
  DIV: "Dividend - Dividend payment",
  FEE: "Fee - Fee charged by the financial institution",
  SRVCHG: "Service Charge - Service charge or monthly fee",
  DEP: "Deposit - Deposit transaction",
  ATM: "ATM Transaction - ATM withdrawal or deposit",
  POS: "Point of Sale - Debit card point of sale transaction",
  XFER: "Transfer - Transfer between accounts",
  CHECK: "Check - Check payment",
  PAYMENT: "Payment - Electronic payment",
  CASH: "Cash Withdrawal - Cash withdrawal",
  DIRECTDEP: "Direct Deposit - Direct deposit (e.g., payroll)",
  DIRECTDEBIT: "Direct Debit - Direct debit payment",
  REPEATPMT: "Repeating Payment - Recurring payment",
  OTHER: "Other - Other transaction type",
};

const en: LanguageRegistry = {
  ofxTags,
};

export default en;
