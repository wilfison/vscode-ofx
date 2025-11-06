/**
 * Interface for OFX tag descriptions in different languages
 * This ensures all language files have all tags defined
 */
export interface OFXTagDescriptions {
  // Root elements
  OFX: string;
  SIGNONMSGSRSV1: string;
  BANKMSGSRSV1: string;
  CREDITCARDMSGSRSV1: string;

  // Signon Response
  SONRS: string;
  STATUS: string;
  CODE: string;
  SEVERITY: string;
  DTSERVER: string;
  LANGUAGE: string;
  FI: string;
  ORG: string;
  FID: string;

  // Bank Statement Response
  STMTTRNRS: string;
  TRNUID: string;
  STMTRS: string;
  CURDEF: string;
  BANKACCTFROM: string;
  BANKID: string;
  ACCTID: string;
  ACCTTYPE: string;

  // Bank Transaction List
  BANKTRANLIST: string;
  DTSTART: string;
  DTEND: string;
  STMTTRN: string;
  TRNTYPE: string;
  DTPOSTED: string;
  TRNAMT: string;
  FITID: string;
  CHECKNUM: string;
  REFNUM: string;
  MEMO: string;
  NAME: string;

  // Ledger Balance
  LEDGERBAL: string;
  BALAMT: string;
  DTASOF: string;

  // Available Balance
  AVAILBAL: string;

  // Credit Card Statement Response
  CCSTMTTRNRS: string;
  CCSTMTRS: string;
  CCACCTFROM: string;
  ACCTKEY: string;

  // Transaction Types
  CREDIT: string;
  DEBIT: string;
  INT: string;
  DIV: string;
  FEE: string;
  SRVCHG: string;
  DEP: string;
  ATM: string;
  POS: string;
  XFER: string;
  CHECK: string;
  PAYMENT: string;
  CASH: string;
  DIRECTDEP: string;
  DIRECTDEBIT: string;
  REPEATPMT: string;
  OTHER: string;
}

export type SupportedLanguage = "en" | "pt-br";
