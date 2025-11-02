import * as assert from "assert";
import { OFXConverter } from "../converter";

suite("OFXConverter Test Suite", () => {
  let converter: OFXConverter;

  setup(() => {
    converter = new OFXConverter();
  });

  test("should convert OFX to JSON", () => {
    const ofxContent = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<DTSERVER>20250604000000
<LANGUAGE>ENG
</SONRS>
</SIGNONMSGSRSV1>
</OFX>`;

    const result = converter.convert(ofxContent, "json");

    assert.strictEqual(result.format, "json");
    assert.ok(result.content);

    const parsed = JSON.parse(result.content);
    assert.ok(parsed.header);
    assert.ok(parsed.body);
    assert.strictEqual(parsed.header.OFXHEADER, "100");
    assert.strictEqual(parsed.header.VERSION, "102");
  });

  test("should parse OFX header correctly", () => {
    const ofxContent = `OFXHEADER:100
DATA:OFXSGML
VERSION:102

<OFX>
</OFX>`;

    const result = converter.convert(ofxContent, "json");
    const parsed = JSON.parse(result.content);

    assert.strictEqual(parsed.header.OFXHEADER, "100");
    assert.strictEqual(parsed.header.DATA, "OFXSGML");
    assert.strictEqual(parsed.header.VERSION, "102");
  });

  test("should parse nested OFX tags", () => {
    const ofxContent = `OFXHEADER:100

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0
</STATUS>
</SONRS>
</SIGNONMSGSRSV1>
</OFX>`;

    const result = converter.convert(ofxContent, "json");
    const parsed = JSON.parse(result.content);

    assert.ok(parsed.body.OFX);
    assert.ok(parsed.body.OFX.SIGNONMSGSRSV1);
    assert.ok(parsed.body.OFX.SIGNONMSGSRSV1.SONRS);
    assert.ok(parsed.body.OFX.SIGNONMSGSRSV1.SONRS.STATUS);
    assert.strictEqual(parsed.body.OFX.SIGNONMSGSRSV1.SONRS.STATUS.CODE, 0);
  });

  test("should convert numeric values to numbers", () => {
    const ofxContent = `OFXHEADER:100

<OFX>
<BANKTRANLIST>
<STMTTRN>
<TRNAMT>1000.00
<FITID>TXN001
</STMTTRN>
</BANKTRANLIST>
</OFX>`;

    const result = converter.convert(ofxContent, "json");
    const parsed = JSON.parse(result.content);

    assert.strictEqual(typeof parsed.body.OFX.BANKTRANLIST.STMTTRN.TRNAMT, "number");
    assert.strictEqual(parsed.body.OFX.BANKTRANLIST.STMTTRN.TRNAMT, 1000.0);
    assert.strictEqual(typeof parsed.body.OFX.BANKTRANLIST.STMTTRN.FITID, "string");
    assert.strictEqual(parsed.body.OFX.BANKTRANLIST.STMTTRN.FITID, "TXN001");
  });

  test("should handle multiple transactions as array", () => {
    const ofxContent = `OFXHEADER:100

<OFX>
<BANKTRANLIST>
<STMTTRN>
<TRNAMT>100.00
<FITID>TXN001
</STMTTRN>
<STMTTRN>
<TRNAMT>200.00
<FITID>TXN002
</STMTTRN>
</BANKTRANLIST>
</OFX>`;

    const result = converter.convert(ofxContent, "json");
    const parsed = JSON.parse(result.content);

    assert.ok(Array.isArray(parsed.body.OFX.BANKTRANLIST.STMTTRN));
    assert.strictEqual(parsed.body.OFX.BANKTRANLIST.STMTTRN.length, 2);
    assert.strictEqual(parsed.body.OFX.BANKTRANLIST.STMTTRN[0].TRNAMT, 100.0);
    assert.strictEqual(parsed.body.OFX.BANKTRANLIST.STMTTRN[1].TRNAMT, 200.0);
  });

  test("should handle XML-style single-line tags", () => {
    const ofxContent = `OFXHEADER:100

<OFX>
<BANKID>999</BANKID>
<ACCTID>123456</ACCTID>
</OFX>`;

    const result = converter.convert(ofxContent, "json");
    const parsed = JSON.parse(result.content);

    assert.strictEqual(parsed.body.OFX.BANKID, 999);
    assert.strictEqual(parsed.body.OFX.ACCTID, 123456);
  });

  test("should throw error for unsupported format", () => {
    const ofxContent = `<OFX></OFX>`;

    assert.throws(() => {
      converter.convert(ofxContent, "xml" as any);
    }, /Unsupported format/);
  });

  test("should handle empty lines", () => {
    const ofxContent = `OFXHEADER:100

<OFX>

<BANKID>999

</OFX>`;

    const result = converter.convert(ofxContent, "json");
    const parsed = JSON.parse(result.content);

    assert.ok(parsed.body.OFX);
    assert.strictEqual(parsed.body.OFX.BANKID, 999);
  });

  test("should convert complex OFX file", () => {
    const ofxContent = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<DTSERVER>20250604000000
<LANGUAGE>ENG
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1001
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<STMTRS>
<CURDEF>BRL
<BANKACCTFROM>
<BANKID>999
<ACCTID>123456
<ACCTTYPE>CHECKING
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>20250401000000
<DTEND>20250430000000
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20250401000000
<TRNAMT>1000.00
<FITID>TXN001
<MEMO>Test Transaction
</STMTTRN>
</BANKTRANLIST>
<LEDGERBAL>
<BALAMT>1000.00
<DTASOF>20250430000000
</LEDGERBAL>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`;

    const result = converter.convert(ofxContent, "json");
    const parsed = JSON.parse(result.content);

    assert.ok(parsed.header);
    assert.ok(parsed.body);
    assert.strictEqual(parsed.header.OFXHEADER, "100");
    assert.ok(parsed.body.OFX.BANKMSGSRSV1);
    assert.ok(parsed.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN);
    assert.strictEqual(
      parsed.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.TRNAMT,
      1000.0
    );
  });
});
