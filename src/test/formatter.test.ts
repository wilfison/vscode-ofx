import * as assert from "assert";
import * as vscode from "vscode";
import { OFXDocumentFormattingProvider } from "../formatter";

suite("OFXDocumentFormattingProvider Test Suite", () => {
  let formatter: OFXDocumentFormattingProvider;
  let document: vscode.TextDocument;
  let options: vscode.FormattingOptions;

  setup(() => {
    formatter = new OFXDocumentFormattingProvider();
    options = {
      tabSize: 2,
      insertSpaces: true,
    };
  });

  test("should format OFX with proper indentation", async () => {
    const unformattedContent = `OFXHEADER:100
DATA:OFXSGML
VERSION:102

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
</SONRS>
</SIGNONMSGSRSV1>
</OFX>`;

    const expectedFormatted = `OFXHEADER:100
DATA:OFXSGML
VERSION:102

<OFX>
  <SIGNONMSGSRSV1>
    <SONRS>
      <STATUS>
        <CODE>0
        <SEVERITY>INFO
      </STATUS>
    </SONRS>
  </SIGNONMSGSRSV1>
</OFX>`;

    document = await vscode.workspace.openTextDocument({
      content: unformattedContent,
      language: "ofx",
    });

    const edits = formatter.provideDocumentFormattingEdits(
      document,
      options,
      new vscode.CancellationTokenSource().token
    );

    assert.strictEqual(edits.length, 1);
    assert.strictEqual(edits[0].newText, expectedFormatted);
  });

  test("should format OFX with tabs when insertSpaces is false", async () => {
    const unformattedContent = `OFXHEADER:100

<OFX>
<SIGNONMSGSRSV1>
</SIGNONMSGSRSV1>
</OFX>`;

    document = await vscode.workspace.openTextDocument({
      content: unformattedContent,
      language: "ofx",
    });

    const tabOptions: vscode.FormattingOptions = {
      tabSize: 2,
      insertSpaces: false,
    };

    const edits = formatter.provideDocumentFormattingEdits(
      document,
      tabOptions,
      new vscode.CancellationTokenSource().token
    );

    assert.strictEqual(edits.length, 1);
    assert.ok(edits[0].newText.includes("\t"));
  });

  test("should preserve header lines without indentation", async () => {
    const content = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII

<OFX>
<SIGNONMSGSRSV1>
</SIGNONMSGSRSV1>
</OFX>`;

    document = await vscode.workspace.openTextDocument({
      content: content,
      language: "ofx",
    });

    const edits = formatter.provideDocumentFormattingEdits(
      document,
      options,
      new vscode.CancellationTokenSource().token
    );

    const formatted = edits[0].newText;
    const lines = formatted.split("\n");

    assert.strictEqual(lines[0], "OFXHEADER:100");
    assert.strictEqual(lines[1], "DATA:OFXSGML");
    assert.strictEqual(lines[2], "VERSION:102");
    assert.strictEqual(lines[3], "SECURITY:NONE");
    assert.strictEqual(lines[4], "ENCODING:USASCII");
  });

  test("should handle XML-style single-line tags", async () => {
    const content = `OFXHEADER:100

<OFX>
<SIGNONMSGSRSV1>
<CODE>0</CODE>
</SIGNONMSGSRSV1>
</OFX>`;

    const expected = `OFXHEADER:100

<OFX>
  <SIGNONMSGSRSV1>
    <CODE>0</CODE>
  </SIGNONMSGSRSV1>
</OFX>`;

    document = await vscode.workspace.openTextDocument({
      content: content,
      language: "ofx",
    });

    const edits = formatter.provideDocumentFormattingEdits(
      document,
      options,
      new vscode.CancellationTokenSource().token
    );

    assert.strictEqual(edits[0].newText, expected);
  });

  test("should handle SGML-style tags without closing tags", async () => {
    const content = `OFXHEADER:100

<OFX>
<SIGNONMSGSRSV1>
<CODE>0
<SEVERITY>INFO
</SIGNONMSGSRSV1>
</OFX>`;

    const expected = `OFXHEADER:100

<OFX>
  <SIGNONMSGSRSV1>
    <CODE>0
    <SEVERITY>INFO
  </SIGNONMSGSRSV1>
</OFX>`;

    document = await vscode.workspace.openTextDocument({
      content: content,
      language: "ofx",
    });

    const edits = formatter.provideDocumentFormattingEdits(
      document,
      options,
      new vscode.CancellationTokenSource().token
    );

    assert.strictEqual(edits[0].newText, expected);
  });

  test("should preserve empty lines", async () => {
    const content = `OFXHEADER:100

<OFX>

<SIGNONMSGSRSV1>
</SIGNONMSGSRSV1>

</OFX>`;

    document = await vscode.workspace.openTextDocument({
      content: content,
      language: "ofx",
    });

    const edits = formatter.provideDocumentFormattingEdits(
      document,
      options,
      new vscode.CancellationTokenSource().token
    );

    const formatted = edits[0].newText;
    const lines = formatted.split("\n");

    assert.strictEqual(lines[1], "");
    assert.strictEqual(lines[3], "");
    assert.strictEqual(lines[6], "");
  });

  test("should handle comments", async () => {
    const content = `OFXHEADER:100

<OFX>
<!-- This is a comment -->
<SIGNONMSGSRSV1>
</SIGNONMSGSRSV1>
</OFX>`;

    const expected = `OFXHEADER:100

<OFX>
  <!-- This is a comment -->
  <SIGNONMSGSRSV1>
  </SIGNONMSGSRSV1>
</OFX>`;

    document = await vscode.workspace.openTextDocument({
      content: content,
      language: "ofx",
    });

    const edits = formatter.provideDocumentFormattingEdits(
      document,
      options,
      new vscode.CancellationTokenSource().token
    );

    assert.strictEqual(edits[0].newText, expected);
  });

  test("should handle deeply nested structures", async () => {
    const content = `<OFX>
<A>
<B>
<C>
<D>Value</D>
</C>
</B>
</A>
</OFX>`;

    const expected = `<OFX>
  <A>
    <B>
      <C>
        <D>Value</D>
      </C>
    </B>
  </A>
</OFX>`;

    document = await vscode.workspace.openTextDocument({
      content: content,
      language: "ofx",
    });

    const edits = formatter.provideDocumentFormattingEdits(
      document,
      options,
      new vscode.CancellationTokenSource().token
    );

    assert.strictEqual(edits[0].newText, expected);
  });

  test("should return empty array when formatting is disabled", async () => {
    const content = `<OFX>
<SIGNONMSGSRSV1>
</SIGNONMSGSRSV1>
</OFX>`;

    document = await vscode.workspace.openTextDocument({
      content: content,
      language: "ofx",
    });

    // Mock the configuration to return false for format.enable
    const originalConfig = vscode.workspace.getConfiguration;
    vscode.workspace.getConfiguration = (section?: string) => {
      return {
        get: (key: string, defaultValue?: any) => {
          if (key === "format.enable") {
            return false;
          }
          return defaultValue;
        },
        has: () => true,
        inspect: () => undefined,
        update: async () => {},
      } as any;
    };

    const edits = formatter.provideDocumentFormattingEdits(
      document,
      options,
      new vscode.CancellationTokenSource().token
    );

    // Restore original config
    vscode.workspace.getConfiguration = originalConfig;

    assert.strictEqual(edits.length, 0);
  });

  test("should handle different tab sizes", async () => {
    const content = `<OFX>
<SIGNONMSGSRSV1>
</SIGNONMSGSRSV1>
</OFX>`;

    document = await vscode.workspace.openTextDocument({
      content: content,
      language: "ofx",
    });

    const largeTabOptions: vscode.FormattingOptions = {
      tabSize: 4,
      insertSpaces: true,
    };

    const edits = formatter.provideDocumentFormattingEdits(
      document,
      largeTabOptions,
      new vscode.CancellationTokenSource().token
    );

    const formatted = edits[0].newText;
    const lines = formatted.split("\n");

    assert.ok(lines[1].startsWith("    ")); // 4 spaces
    assert.strictEqual(lines[1].indexOf("<"), 4);
  });

  test("should handle mixed content types", async () => {
    const content = `OFXHEADER:100
DATA:OFXSGML

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0</CODE>
<SEVERITY>INFO
</STATUS>
<DTSERVER>20250604000000
</SONRS>
</SIGNONMSGSRSV1>
</OFX>`;

    document = await vscode.workspace.openTextDocument({
      content: content,
      language: "ofx",
    });

    const edits = formatter.provideDocumentFormattingEdits(
      document,
      options,
      new vscode.CancellationTokenSource().token
    );

    const formatted = edits[0].newText;

    // Should preserve headers
    assert.ok(formatted.startsWith("OFXHEADER:100"));

    // Should have proper indentation
    assert.ok(formatted.includes("  <SIGNONMSGSRSV1>"));
    assert.ok(formatted.includes("    <SONRS>"));

    // Should handle mixed SGML and XML
    assert.ok(formatted.includes("      <CODE>0</CODE>"));
    assert.ok(formatted.includes("      <SEVERITY>INFO"));
  });
});
