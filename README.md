# OFX Language Support

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

- **Auto-closing tags**: Automatically closes OFX tags
- **Bracket matching**: Highlights matching opening and closing tags
- **Code folding**: Fold/unfold OFX tag blocks for better readability
- **Indentation**: Smart indentation for nested OFX structures
- **Comment support**: Block comments using `<!-- -->` syntax

## File Extensions

The extension automatically activates for files with the `.ofx` extension.

## Usage

Simply open any `.ofx` file in VS Code and the syntax highlighting will be applied automatically.

## OFX Format Support

This extension supports both OFX formats:

- **SGML format** (OFX 1.x): Tags without explicit closing
- **XML format** (OFX 2.x): Standard XML with closing tags

## Examples

The extension correctly highlights OFX files from various financial institutions, including:

- Banking statements
- Credit card transactions
- Investment accounts
- And more

## Requirements

- Visual Studio Code 1.105.0 or higher

## Known Issues

None at this time. Please report issues on the GitHub repository.

## Release Notes

### 0.0.1

Initial release of OFX Language Support

- Syntax highlighting for OFX files
- Language configuration for auto-closing, folding, and indentation
- Support for both SGML and XML OFX formats

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This extension is licensed under the MIT License.

**Enjoy!**
