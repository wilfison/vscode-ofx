import * as vscode from "vscode";

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
    const result: any = {
      header: {},
      body: {},
    };

    const lines = text.split(/\r?\n/);
    let currentPath: any[] = [result.body];
    let inBody = false;

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed) {
        continue;
      }

      if (!inBody && trimmed.includes(":")) {
        const [key, value] = trimmed.split(":");
        result.header[key] = value;
        continue;
      }

      if (trimmed.startsWith("<") && !trimmed.startsWith("<!--")) {
        inBody = true;

        if (trimmed.match(/^<\/[A-Z][A-Z0-9]*>$/)) {
          currentPath.pop();
        } else if (trimmed.match(/^(<[A-Z][A-Z0-9]*>)(.+?)(<\/[A-Z][A-Z0-9]*>)$/)) {
          const match = trimmed.match(/^<([A-Z][A-Z0-9]*)>(.+?)<\/[A-Z][A-Z0-9]*>$/);
          if (match) {
            const [, tag, value] = match;
            const current = currentPath[currentPath.length - 1];
            this.setValue(current, tag, value);
          }
        } else if (trimmed.match(/^<[A-Z][A-Z0-9]*>(.+)$/)) {
          const match = trimmed.match(/^<([A-Z][A-Z0-9]*)>(.+)$/);
          if (match) {
            const [, tag, value] = match;
            const current = currentPath[currentPath.length - 1];
            this.setValue(current, tag, value);
          }
        } else if (trimmed.match(/^<[A-Z][A-Z0-9]*>$/)) {
          const tag = trimmed.slice(1, -1);
          const current = currentPath[currentPath.length - 1];
          const newObj = {};

          if (current[tag]) {
            if (Array.isArray(current[tag])) {
              current[tag].push(newObj);
            } else {
              current[tag] = [current[tag], newObj];
            }
          } else {
            current[tag] = newObj;
          }

          currentPath.push(newObj);
        }
      }
    }

    return JSON.stringify(result, null, 2);
  }

  private setValue(obj: any, key: string, value: string) {
    const numValue = parseFloat(value);
    const finalValue = !isNaN(numValue) && value.match(/^-?\d+(\.\d+)?$/) ? numValue : value;

    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(finalValue);
      } else {
        obj[key] = [obj[key], finalValue];
      }
    } else {
      obj[key] = finalValue;
    }
  }
}
