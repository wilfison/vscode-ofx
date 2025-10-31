# OFX File Support

Language support for Open Financial Exchange (OFX) files in Visual Studio Code.

## Features

This extension provides syntax highlighting and language support for OFX (Open Financial Exchange) files, commonly used by financial institutions to exchange financial data.

### Syntax Highlighting

- **Header fields**: Highlights OFX header fields like `OFXHEADER`, `DATA`, `VERSION`, etc.
- **XML/SGML tags**: Recognizes both XML-style tags with closing tags and SGML-style tags without explicit closing
- **Data types**: Distinguishes between different value types:
  - Numeric values (integers and decimals)
  - Date/time values with timezone information
  - Currency codes (BRL, USD, EUR)
  - Transaction types (CREDIT, DEBIT)
  - Status values (INFO, WARN, ERROR)
  - Account types (CHECKING, SAVINGS)

### Language Features

- **Document Formatting**: Format OFX documents with proper indentation
  - Use `Shift+Alt+F` (Windows/Linux) or `Shift+Option+F` (Mac) to format
  - Right-click and select "Format Document"
  - Automatically handles both SGML and XML formats
  - Preserves header section formatting
- **Auto-closing tags**: Automatically closes OFX tags
- **Bracket matching**: Highlights matching opening and closing tags
- **Code folding**: Fold/unfold OFX tag blocks for better readability
- **Indentation**: Smart indentation for nested OFX structures
- **Comment support**: Block comments using `<!-- -->` syntax

## OFX Format Support

This extension supports both OFX formats:

- **SGML format** (OFX 1.x): Tags without explicit closing
- **XML format** (OFX 2.x): Standard XML with closing tags

### Formatting OFX Files

To format an OFX document:

1. Open an `.ofx` file
2. Press:
   - `Shift+Alt+F` (Windows)
   - `Ctrl+Shift+I` (Linux)
   - `⇧⌥F` (Mac)
3. Or right-click in the editor and select "Format Document"

The formatter will:

- Keep header lines (KEY:VALUE) unindented
- Properly indent nested XML/SGML tags
- Handle both OFX 1.x (SGML) and OFX 2.x (XML) formats

## Configuration

This extension contributes the following settings:

- `ofx.format.enable`: Enable/disable OFX document formatting (default: `true`)

## Requirements

- Visual Studio Code 1.105.0 or higher

## Known Issues

None at this time. Please report issues on the [GitHub repository](https://github.com/wilfison/vscode-ofx).

## Contributing

Contributions are welcome! Please feel free to submit [issues](https://github.com/wilfison/vscode-ofx/issues) or [pull requests](https://github.com/wilfison/vscode-ofx/pulls).

## License

This extension is licensed under the MIT License.

**Enjoy!**
