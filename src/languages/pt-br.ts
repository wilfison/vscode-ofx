import { LanguageRegistry } from ".";
import { OFXTagDescriptions } from "../types/tags";

/**
 * Portuguese (Brazil) descriptions for OFX tags
 */
const ofxTags: OFXTagDescriptions = {
  // Root elements
  OFX: "Open Financial Exchange - Elemento raiz contendo todos os dados OFX",
  SIGNONMSGSRSV1:
    "Conjunto de Respostas de Mensagens de Autenticação - Contém informações de autenticação e sessão",
  BANKMSGSRSV1:
    "Conjunto de Respostas de Mensagens Bancárias - Contém extratos e transações bancárias",
  CREDITCARDMSGSRSV1:
    "Conjunto de Respostas de Mensagens de Cartão de Crédito - Contém extratos e transações de cartão de crédito",

  // Signon Response
  SONRS: "Resposta de Autenticação - Informações de status de autenticação e sessão",
  STATUS: "Status - Informações de status da resposta",
  CODE: "Código de Status - Código numérico indicando sucesso ou tipo de erro",
  SEVERITY: "Severidade - Indica se o status é INFO, WARN ou ERROR",
  DTSERVER: "Data/Hora do Servidor - Data e hora no servidor quando a resposta foi gerada",
  LANGUAGE: "Idioma - Idioma usado na resposta",
  FI: "Instituição Financeira - Informações sobre a instituição financeira",
  ORG: "Organização - Nome ou identificador da instituição financeira",
  FID: "ID da Instituição Financeira - Identificador único da instituição financeira",

  // Bank Statement Response
  STMTTRNRS: "Resposta de Transação de Extrato - Envelope para resposta de extrato bancário",
  TRNUID: "ID Único da Transação - Identificador único para esta requisição de transação",
  STMTRS: "Resposta de Extrato - Contém os dados reais do extrato",
  CURDEF: "Definição de Moeda - Moeda padrão para todos os valores no extrato",
  BANKACCTFROM: "Conta Bancária De - Identifica a conta bancária deste extrato",
  BANKID: "ID do Banco - Número de roteamento ou outro identificador do banco",
  ACCTID: "ID da Conta - Número da conta",
  ACCTTYPE: "Tipo de Conta - Tipo da conta (CHECKING, SAVINGS, MONEYMRKT, CREDITLINE)",

  // Bank Transaction List
  BANKTRANLIST:
    "Lista de Transações Bancárias - Lista de todas as transações no período do extrato",
  DTSTART: "Data Inicial - Data de início do período do extrato",
  DTEND: "Data Final - Data de término do período do extrato",
  STMTTRN: "Transação do Extrato - Uma única transação financeira",
  TRNTYPE: "Tipo de Transação - Tipo da transação (DEBIT, CREDIT, etc.)",
  DTPOSTED: "Data de Lançamento - Data em que a transação foi lançada na conta",
  TRNAMT: "Valor da Transação - Valor da transação (negativo para débitos)",
  FITID: "ID da Transação da IF - Identificador único atribuído pela instituição financeira",
  CHECKNUM: "Número do Cheque - Número do cheque para transações de cheque",
  REFNUM: "Número de Referência - Número de referência atribuído pela IF",
  MEMO: "Memo - Informações adicionais sobre a transação",
  NAME: "Nome - Beneficiário ou descrição da transação",

  // Ledger Balance
  LEDGERBAL: "Saldo Contábil - Saldo contábil atual da conta",
  BALAMT: "Valor do Saldo - O valor real do saldo",
  DTASOF: "Data do Saldo - Data e hora do saldo",

  // Available Balance
  AVAILBAL: "Saldo Disponível - Valor disponível para saque",

  // Credit Card Statement Response
  CCSTMTTRNRS:
    "Resposta de Transação de Extrato de Cartão de Crédito - Envelope para extrato de cartão de crédito",
  CCSTMTRS:
    "Resposta de Extrato de Cartão de Crédito - Contém dados do extrato de cartão de crédito",
  CCACCTFROM: "Conta de Cartão de Crédito De - Identifica a conta de cartão de crédito",
  ACCTKEY: "Chave da Conta - Checksum ou outro identificador para o número da conta",

  // Transaction Types
  CREDIT: "Crédito - Transação de crédito genérica",
  DEBIT: "Débito - Transação de débito genérica",
  INT: "Juros - Juros ganhos ou pagos",
  DIV: "Dividendo - Pagamento de dividendos",
  FEE: "Taxa - Taxa cobrada pela instituição financeira",
  SRVCHG: "Tarifa de Serviço - Tarifa de serviço ou taxa mensal",
  DEP: "Depósito - Transação de depósito",
  ATM: "Transação ATM - Saque ou depósito em caixa eletrônico",
  POS: "Ponto de Venda - Transação de cartão de débito em ponto de venda",
  XFER: "Transferência - Transferência entre contas",
  CHECK: "Cheque - Pagamento com cheque",
  PAYMENT: "Pagamento - Pagamento eletrônico",
  CASH: "Saque - Saque em dinheiro",
  DIRECTDEP: "Depósito Direto - Depósito direto (ex: folha de pagamento)",
  DIRECTDEBIT: "Débito Direto - Pagamento por débito direto",
  REPEATPMT: "Pagamento Recorrente - Pagamento recorrente",
  OTHER: "Outro - Outro tipo de transação",
};

const webviewLabels = {
  PAGE_TITLE: "Transações OFX",
  INCOME: "Receita",
  EXPENSES: "Despesas",
  OFX_TRANSACTION_VIEWER: "Visualizador de Transações OFX",
  BANK: "Banco",
  ACCOUNT: "Conta",
  BALANCE: "Saldo",
  TOTAL_INCOME: "Receita Total",
  TOTAL_EXPENSES: "Despesas Totais",
  NET_BALANCE: "Saldo Líquido",
  TOTAL_TRANSACTIONS: "Total de Transações",
  INCOME_VS_EXPENSES: "Receita vs Despesas",
  TRANSACTIONS: "Transações",
  DATE: "Data",
  TYPE: "Tipo",
  DESCRIPTION: "Descrição",
  AMOUNT: "Valor",
  ID: "ID",
  FILTER_ALL: "Todas",
  SEARCH_PLACEHOLDER: "Buscar transações...",
};

const ptBr: LanguageRegistry = {
  ofxTags,
  webviewLabels,
};

export default ptBr;
