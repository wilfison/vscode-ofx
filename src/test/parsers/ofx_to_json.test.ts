import * as assert from "assert";
import ofxToJson from "../../parsers/ofx_to_json";

suite("ofxToJson Test Suite", () => {
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

    const result = ofxToJson(ofxContent);

    assert.ok(result);
    assert.strictEqual(typeof result, "object");

    assert.ok(result.header);
    assert.ok(result.body);
    assert.strictEqual(result.header.OFXHEADER, "100");
    assert.strictEqual(result.header.VERSION, "102");
  });

  test("should parse OFX header correctly", () => {
    const ofxContent = `OFXHEADER:100
DATA:OFXSGML
VERSION:102

<OFX>
</OFX>`;

    const result = ofxToJson(ofxContent);

    assert.strictEqual(result.header.OFXHEADER, "100");
    assert.strictEqual(result.header.DATA, "OFXSGML");
    assert.strictEqual(result.header.VERSION, "102");
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

    const result = ofxToJson(ofxContent);

    assert.ok(result.body.OFX);
    assert.ok(result.body.OFX.SIGNONMSGSRSV1);
    assert.ok(result.body.OFX.SIGNONMSGSRSV1.SONRS);
    assert.ok(result.body.OFX.SIGNONMSGSRSV1.SONRS.STATUS);
    assert.strictEqual(result.body.OFX.SIGNONMSGSRSV1.SONRS.STATUS.CODE, 0);
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

    const result = ofxToJson(ofxContent);

    assert.strictEqual(typeof result.body.OFX.BANKTRANLIST.STMTTRN.TRNAMT, "number");
    assert.strictEqual(result.body.OFX.BANKTRANLIST.STMTTRN.TRNAMT, 1000.0);
    assert.strictEqual(typeof result.body.OFX.BANKTRANLIST.STMTTRN.FITID, "string");
    assert.strictEqual(result.body.OFX.BANKTRANLIST.STMTTRN.FITID, "TXN001");
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

    const result = ofxToJson(ofxContent);

    assert.ok(Array.isArray(result.body.OFX.BANKTRANLIST.STMTTRN));
    assert.strictEqual(result.body.OFX.BANKTRANLIST.STMTTRN.length, 2);
    assert.strictEqual(result.body.OFX.BANKTRANLIST.STMTTRN[0].TRNAMT, 100.0);
    assert.strictEqual(result.body.OFX.BANKTRANLIST.STMTTRN[1].TRNAMT, 200.0);
  });

  test("should handle XML-style single-line tags", () => {
    const ofxContent = `OFXHEADER:100

<OFX>
<BANKID>999</BANKID>
<ACCTID>123456</ACCTID>
</OFX>`;

    const result = ofxToJson(ofxContent);

    assert.strictEqual(result.body.OFX.BANKID, 999);
    assert.strictEqual(result.body.OFX.ACCTID, 123456);
  });

  test("should handle empty lines", () => {
    const ofxContent = `OFXHEADER:100

<OFX>

<BANKID>999

</OFX>`;

    const result = ofxToJson(ofxContent);

    assert.ok(result.body.OFX);
    assert.strictEqual(result.body.OFX.BANKID, 999);
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

    const result = ofxToJson(ofxContent);

    assert.ok(result.header);
    assert.ok(result.body);
    assert.strictEqual(result.header.OFXHEADER, "100");
    assert.ok(result.body.OFX.BANKMSGSRSV1);
    assert.ok(result.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN);
    assert.strictEqual(
      result.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.TRNAMT,
      1000.0
    );
  });
});
