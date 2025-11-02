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
  });

  test("should throw error for unsupported format", () => {
    const ofxContent = `<OFX></OFX>`;

    assert.throws(() => {
      converter.convert(ofxContent, "xml" as any);
    }, /Unsupported format/);
  });
});
