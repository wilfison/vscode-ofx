/**
 * OFX (Open Financial Exchange) Type Definitions
 */

// OFX file header
export interface OFXHeader {
  OFXHEADER?: string;
  DATA?: string;
  VERSION?: string;
  SECURITY?: string;
  ENCODING?: string;
  CHARSET?: string;
  COMPRESSION?: string;
  OLDFILEUID?: string;
  NEWFILEUID?: string;
  [key: string]: string | undefined;
}

// Common status in OFX responses
export interface OFXStatus {
  CODE: number | string;
  SEVERITY: string;
  MESSAGE?: string;
}

// Signon response
export interface OFXSignonResponse {
  STATUS: OFXStatus;
  DTSERVER: string;
  LANGUAGE: string;
  FI?: {
    ORG: string;
    FID: string;
  };
}

// Bank account information
export interface OFXBankAccount {
  BANKID: string;
  ACCTID: string;
  ACCTTYPE: string;
  BRANCHID?: string;
}

// Bank transaction
export interface OFXBankTransaction {
  TRNTYPE: string;
  DTPOSTED: string;
  TRNAMT: number;
  FITID: string;
  CHECKNUM?: string;
  REFNUM?: string;
  MEMO?: string;
  NAME?: string;
  PAYEE?: {
    NAME: string;
    ADDR1?: string;
    CITY?: string;
    STATE?: string;
    POSTALCODE?: string;
    COUNTRY?: string;
    PHONE?: string;
  };
  BANKACCTTO?: OFXBankAccount;
}

// List of bank transactions
export interface OFXBankTransactionList {
  DTSTART: string;
  DTEND: string;
  STMTTRN: OFXBankTransaction | OFXBankTransaction[];
}

// Balance
export interface OFXBalance {
  BALAMT: number;
  DTASOF: string;
}

// Bank statement response
export interface OFXStatementResponse {
  CURDEF: string;
  BANKACCTFROM: OFXBankAccount;
  BANKTRANLIST?: OFXBankTransactionList;
  LEDGERBAL: OFXBalance;
  AVAILBAL?: OFXBalance;
  BALLIST?: {
    BAL: OFXBalance | OFXBalance[];
  };
}

// Statement transaction response
export interface OFXStatementTransaction {
  TRNUID: string;
  STATUS: OFXStatus;
  STMTRS?: OFXStatementResponse;
  CLTCOOKIE?: string;
}

// Bank messages
export interface OFXBankMessages {
  STMTTRNRS: OFXStatementTransaction | OFXStatementTransaction[];
}

// Credit card transaction
export interface OFXCreditCardTransaction {
  TRNTYPE: string;
  DTPOSTED: string;
  TRNAMT: number;
  FITID: string;
  REFNUM?: string;
  MEMO?: string;
  NAME?: string;
}

// Credit card account information
export interface OFXCreditCardAccount {
  ACCTID: string;
}

// List of credit card transactions
export interface OFXCreditCardTransactionList {
  DTSTART: string;
  DTEND: string;
  STMTTRN: OFXCreditCardTransaction | OFXCreditCardTransaction[];
}

// Credit card statement response
export interface OFXCreditCardStatementResponse {
  CURDEF: string;
  CCACCTFROM: OFXCreditCardAccount;
  BANKTRANLIST?: OFXCreditCardTransactionList;
  LEDGERBAL: OFXBalance;
  AVAILBAL?: OFXBalance;
}

// Credit card statement transaction response
export interface OFXCreditCardStatementTransaction {
  TRNUID: string;
  STATUS: OFXStatus;
  CCSTMTRS?: OFXCreditCardStatementResponse;
}

// Credit card messages
export interface OFXCreditCardMessages {
  CCSTMTTRNRS: OFXCreditCardStatementTransaction | OFXCreditCardStatementTransaction[];
}

// OFX body
export interface OFXBody {
  SIGNONMSGSRSV1?: {
    SONRS: OFXSignonResponse;
  };
  BANKMSGSRSV1?: OFXBankMessages;
  CREDITCARDMSGSRSV1?: OFXCreditCardMessages;
  [key: string]: any;
}

// Complete OFX file structure
export interface OFXDocument {
  header: OFXHeader;
  body: {
    OFX: OFXBody;
  };
}

// Auxiliary types for parsing
export type OFXValue = string | number | OFXObject | OFXArray;
export type OFXObject = { [key: string]: OFXValue };
export type OFXArray = OFXValue[];
