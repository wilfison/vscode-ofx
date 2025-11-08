# Change Log

All notable changes to the "OFX File Support" extension will be documented in this file.

## [1.0.4]

- Inprove report performance.
- Add search functionality in dashboard webview panel.

## [1.0.3]

- Add preview image in README.md

## [1.0.2]

- Add export OFX to JSON functionality
- Add dashboard webview panel

## [1.0.1]

- Remake extension icon

## [1.0.0]

- Initial release
- Syntax highlighting for OFX (Open Financial Exchange) files
- Support for both SGML (OFX 1.x) and XML (OFX 2.x) formats
- Language configuration with auto-closing tags
- Code folding support for OFX tag blocks
- Smart indentation for nested structures
- Bracket matching for opening and closing tags
- Comment support using `<!-- -->` syntax
- Recognition of OFX header fields
- Highlighting for data types: numeric values, dates, currency codes, transaction types
- File association for `.ofx` extension
- **Document formatting provider** for automatic code formatting
  - Proper indentation of nested tags
  - Handles both SGML and XML formats
  - Preserves header section formatting
  - Configurable via `ofx.format.enable` setting
