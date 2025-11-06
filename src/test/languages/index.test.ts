import * as assert from "assert";
import * as vscode from "vscode";
import {
  getLanguageDescriptions,
  getTagDescription,
  getWebviewLabels,
  currencyLocales,
} from "../../languages";
import en from "../../languages/en";
import ptBr from "../../languages/pt-br";

suite("Internationalization Module Test Suite", () => {
  suite("getLanguageDescriptions", () => {
    test("should return English descriptions for 'en' locale", () => {
      const originalLanguage = vscode.env.language;
      Object.defineProperty(vscode.env, "language", {
        value: "en",
        writable: true,
        configurable: true,
      });

      const descriptions = getLanguageDescriptions();

      assert.strictEqual(descriptions, en);

      Object.defineProperty(vscode.env, "language", {
        value: originalLanguage,
        writable: true,
        configurable: true,
      });
    });

    test("should return Portuguese descriptions for 'pt-br' locale", () => {
      const originalLanguage = vscode.env.language;
      Object.defineProperty(vscode.env, "language", {
        value: "pt-br",
        writable: true,
        configurable: true,
      });

      const descriptions = getLanguageDescriptions();

      assert.strictEqual(descriptions, ptBr);

      Object.defineProperty(vscode.env, "language", {
        value: originalLanguage,
        writable: true,
        configurable: true,
      });
    });

    test("should return Portuguese descriptions for 'pt' locale", () => {
      const originalLanguage = vscode.env.language;
      Object.defineProperty(vscode.env, "language", {
        value: "pt",
        writable: true,
        configurable: true,
      });

      const descriptions = getLanguageDescriptions();

      assert.strictEqual(descriptions, ptBr);

      Object.defineProperty(vscode.env, "language", {
        value: originalLanguage,
        writable: true,
        configurable: true,
      });
    });

    test("should return Portuguese descriptions for 'pt-PT' locale", () => {
      const originalLanguage = vscode.env.language;
      Object.defineProperty(vscode.env, "language", {
        value: "pt-PT",
        writable: true,
        configurable: true,
      });

      const descriptions = getLanguageDescriptions();

      assert.strictEqual(descriptions, ptBr);

      Object.defineProperty(vscode.env, "language", {
        value: originalLanguage,
        writable: true,
        configurable: true,
      });
    });

    test("should fallback to English for unsupported locale", () => {
      const originalLanguage = vscode.env.language;
      Object.defineProperty(vscode.env, "language", {
        value: "fr-FR",
        writable: true,
        configurable: true,
      });

      const descriptions = getLanguageDescriptions();

      assert.strictEqual(descriptions, en);

      Object.defineProperty(vscode.env, "language", {
        value: originalLanguage,
        writable: true,
        configurable: true,
      });
    });

    test("should handle case-insensitive locale matching", () => {
      const originalLanguage = vscode.env.language;
      Object.defineProperty(vscode.env, "language", {
        value: "EN-US",
        writable: true,
        configurable: true,
      });

      const descriptions = getLanguageDescriptions();

      assert.strictEqual(descriptions, en);

      Object.defineProperty(vscode.env, "language", {
        value: originalLanguage,
        writable: true,
        configurable: true,
      });
    });
  });

  suite("getTagDescription", () => {
    test("should return description for valid OFX tag", () => {
      const originalLanguage = vscode.env.language;
      Object.defineProperty(vscode.env, "language", {
        value: "en",
        writable: true,
        configurable: true,
      });

      const description = getTagDescription("OFX");

      assert.ok(description);
      assert.ok(description.includes("Open Financial Exchange"));

      Object.defineProperty(vscode.env, "language", {
        value: originalLanguage,
        writable: true,
        configurable: true,
      });
    });

    test("should return undefined for unknown tag", () => {
      const description = getTagDescription("UNKNOWNTAG");
      assert.strictEqual(description, undefined);
    });

    test("should return localized description based on locale", () => {
      const originalLanguage = vscode.env.language;

      // Test English
      Object.defineProperty(vscode.env, "language", {
        value: "en",
        writable: true,
        configurable: true,
      });
      const enDescription = getTagDescription("BANKID");
      assert.ok(enDescription?.includes("Routing"));

      // Test Portuguese
      Object.defineProperty(vscode.env, "language", {
        value: "pt-br",
        writable: true,
        configurable: true,
      });
      const ptDescription = getTagDescription("BANKID");
      assert.ok(ptDescription?.includes("roteamento"));

      Object.defineProperty(vscode.env, "language", {
        value: originalLanguage,
        writable: true,
        configurable: true,
      });
    });
  });

  suite("getWebviewLabels", () => {
    test("should return webview labels for current locale", () => {
      const labels = getWebviewLabels();

      assert.ok(labels);
      assert.ok(labels.PAGE_TITLE);
      assert.ok(labels.INCOME);
      assert.ok(labels.EXPENSES);
    });

    test("should return English labels for 'en' locale", () => {
      const originalLanguage = vscode.env.language;
      Object.defineProperty(vscode.env, "language", {
        value: "en",
        writable: true,
        configurable: true,
      });

      const labels = getWebviewLabels();

      assert.strictEqual(labels.PAGE_TITLE, "OFX Transactions");
      assert.strictEqual(labels.INCOME, "Income");
      assert.strictEqual(labels.EXPENSES, "Expenses");

      Object.defineProperty(vscode.env, "language", {
        value: originalLanguage,
        writable: true,
        configurable: true,
      });
    });

    test("should return Portuguese labels for 'pt-br' locale", () => {
      const originalLanguage = vscode.env.language;
      Object.defineProperty(vscode.env, "language", {
        value: "pt-br",
        writable: true,
        configurable: true,
      });

      const labels = getWebviewLabels();

      assert.strictEqual(labels.PAGE_TITLE, "Transações OFX");
      assert.strictEqual(labels.INCOME, "Receita");
      assert.strictEqual(labels.EXPENSES, "Despesas");

      Object.defineProperty(vscode.env, "language", {
        value: originalLanguage,
        writable: true,
        configurable: true,
      });
    });
  });

  suite("currencyLocales", () => {
    test("should have USD configuration", () => {
      assert.ok(currencyLocales.USD);
      assert.strictEqual(currencyLocales.USD.locale, "en-US");
      assert.strictEqual(currencyLocales.USD.currency, "USD");
    });

    test("should have BRL configuration", () => {
      assert.ok(currencyLocales.BRL);
      assert.strictEqual(currencyLocales.BRL.locale, "pt-BR");
      assert.strictEqual(currencyLocales.BRL.currency, "BRL");
    });
  });

  suite("Language Registry Consistency", () => {
    test("all languages should have the same ofxTags keys as English", () => {
      const enKeys = Object.keys(en.ofxTags).sort();
      const ptBrKeys = Object.keys(ptBr.ofxTags).sort();

      assert.strictEqual(
        ptBrKeys.length,
        enKeys.length,
        "Portuguese (pt-br) should have the same number of ofxTags keys as English"
      );

      const missingInPtBr = enKeys.filter((key) => !ptBrKeys.includes(key));
      const extraInPtBr = ptBrKeys.filter((key) => !enKeys.includes(key));

      assert.strictEqual(
        missingInPtBr.length,
        0,
        `Portuguese (pt-br) is missing these ofxTags keys: ${missingInPtBr.join(", ")}`
      );

      assert.strictEqual(
        extraInPtBr.length,
        0,
        `Portuguese (pt-br) has extra ofxTags keys: ${extraInPtBr.join(", ")}`
      );

      // Verify exact match
      assert.deepStrictEqual(
        ptBrKeys,
        enKeys,
        "Portuguese (pt-br) ofxTags keys should exactly match English keys"
      );
    });

    test("all languages should have the same webviewLabels keys as English", () => {
      const enKeys = Object.keys(en.webviewLabels).sort();
      const ptBrKeys = Object.keys(ptBr.webviewLabels).sort();

      assert.strictEqual(
        ptBrKeys.length,
        enKeys.length,
        "Portuguese (pt-br) should have the same number of webviewLabels keys as English"
      );

      const missingInPtBr = enKeys.filter((key) => !ptBrKeys.includes(key));
      const extraInPtBr = ptBrKeys.filter((key) => !enKeys.includes(key));

      assert.strictEqual(
        missingInPtBr.length,
        0,
        `Portuguese (pt-br) is missing these webviewLabels keys: ${missingInPtBr.join(", ")}`
      );

      assert.strictEqual(
        extraInPtBr.length,
        0,
        `Portuguese (pt-br) has extra webviewLabels keys: ${extraInPtBr.join(", ")}`
      );

      // Verify exact match
      assert.deepStrictEqual(
        ptBrKeys,
        enKeys,
        "Portuguese (pt-br) webviewLabels keys should exactly match English keys"
      );
    });

    test("all ofxTags values should be non-empty strings", () => {
      const languages = [
        { name: "English", data: en },
        { name: "Portuguese (pt-br)", data: ptBr },
      ];

      languages.forEach(({ name, data }) => {
        Object.entries(data.ofxTags).forEach(([key, value]) => {
          assert.ok(
            typeof value === "string" && value.length > 0,
            `${name}: ofxTags['${key}'] should be a non-empty string`
          );
        });
      });
    });

    test("all webviewLabels values should be non-empty strings", () => {
      const languages = [
        { name: "English", data: en },
        { name: "Portuguese (pt-br)", data: ptBr },
      ];

      languages.forEach(({ name, data }) => {
        Object.entries(data.webviewLabels).forEach(([key, value]) => {
          assert.ok(
            typeof value === "string" && value.length > 0,
            `${name}: webviewLabels['${key}'] should be a non-empty string`
          );
        });
      });
    });

    test("all languages should have valid LanguageRegistry structure", () => {
      const languages = [
        { name: "English", data: en },
        { name: "Portuguese (pt-br)", data: ptBr },
      ];

      languages.forEach(({ name, data }) => {
        assert.ok(data.ofxTags, `${name} should have ofxTags`);
        assert.ok(data.webviewLabels, `${name} should have webviewLabels`);
        assert.ok(typeof data.ofxTags === "object", `${name} ofxTags should be an object`);
        assert.ok(
          typeof data.webviewLabels === "object",
          `${name} webviewLabels should be an object`
        );
      });
    });
  });

  suite("OFX Tag Coverage", () => {
    test("should have descriptions for common OFX root elements", () => {
      const rootElements = ["OFX", "SIGNONMSGSRSV1", "BANKMSGSRSV1", "CREDITCARDMSGSRSV1"];

      rootElements.forEach((tag) => {
        assert.ok(
          en.ofxTags[tag as keyof typeof en.ofxTags],
          `English should have description for ${tag}`
        );
        assert.ok(
          ptBr.ofxTags[tag as keyof typeof ptBr.ofxTags],
          `Portuguese should have description for ${tag}`
        );
      });
    });

    test("should have descriptions for common transaction types", () => {
      const transactionTypes = [
        "CREDIT",
        "DEBIT",
        "INT",
        "DIV",
        "FEE",
        "SRVCHG",
        "DEP",
        "ATM",
        "POS",
        "XFER",
        "CHECK",
        "PAYMENT",
        "CASH",
        "DIRECTDEP",
        "DIRECTDEBIT",
        "REPEATPMT",
        "OTHER",
      ];

      transactionTypes.forEach((type) => {
        assert.ok(
          en.ofxTags[type as keyof typeof en.ofxTags],
          `English should have description for transaction type ${type}`
        );
        assert.ok(
          ptBr.ofxTags[type as keyof typeof ptBr.ofxTags],
          `Portuguese should have description for transaction type ${type}`
        );
      });
    });

    test("should have descriptions for bank account elements", () => {
      const accountElements = [
        "BANKACCTFROM",
        "BANKID",
        "ACCTID",
        "ACCTTYPE",
        "LEDGERBAL",
        "AVAILBAL",
      ];

      accountElements.forEach((element) => {
        assert.ok(
          en.ofxTags[element as keyof typeof en.ofxTags],
          `English should have description for ${element}`
        );
        assert.ok(
          ptBr.ofxTags[element as keyof typeof ptBr.ofxTags],
          `Portuguese should have description for ${element}`
        );
      });
    });
  });

  suite("Webview Labels Coverage", () => {
    test("should have all essential webview labels", () => {
      const essentialLabels = [
        "PAGE_TITLE",
        "INCOME",
        "EXPENSES",
        "OFX_TRANSACTION_VIEWER",
        "BANK",
        "ACCOUNT",
        "BALANCE",
        "TOTAL_INCOME",
        "TOTAL_EXPENSES",
        "NET_BALANCE",
        "TOTAL_TRANSACTIONS",
        "INCOME_VS_EXPENSES",
        "TRANSACTIONS",
        "DATE",
        "TYPE",
        "DESCRIPTION",
        "AMOUNT",
        "ID",
      ];

      essentialLabels.forEach((label) => {
        assert.ok(en.webviewLabels[label], `English should have label for ${label}`);
        assert.ok(ptBr.webviewLabels[label], `Portuguese should have label for ${label}`);
      });
    });
  });
});
