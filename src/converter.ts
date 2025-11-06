import ofxToJSON from "./parsers/ofx_to_json";

export type ConversionFormat = "json";

export interface ConversionResult {
  content: string;
  format: ConversionFormat;
}

export class OFXConverter {
  convert(text: string, format: ConversionFormat): ConversionResult {
    switch (format) {
      case "json":
        return {
          content: this.toJSON(text),
          format: "json",
        };
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private toJSON(text: string): string {
    const content = ofxToJSON(text);

    return JSON.stringify(content, null, 2);
  }
}
