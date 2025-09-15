# Change Log

All notable changes to the **JSON Power Tools** extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2025-09-11
## [0.0.2] - 2025-09-12 - Add icons and screenshots to README

### Added
- **Smart JSON Processing**: Converts JSON strings within objects to properly nested structures
- **Bulk Folder Processing**: Format entire directories with configurable depth limits
- **Flexible Indentation**: Support for spaces (customizable size) and tabs
- **File Extension Filtering**: Process `.json`, `.jsonc`, and custom extensions
- **Intelligent Folder Exclusion**: Skip `node_modules`, `dist`, `.git`, and 35+ other common directories
- **VS Code Integration**: Document formatting provider with `Shift+Alt+F` support
- **Context Menu Commands**: Right-click formatting for files and folders in Explorer
- **Real-time Configuration**: Settings update immediately without extension restart
- **Performance Optimization**: Efficient recursive processing with memory management

### Configuration Options
- `json-power-tools.maxDepth`: Maximum recursion depth (default: 256)
- `json-power-tools.indentation.type`: "spaces" or "tabs" (default: "spaces")
- `json-power-tools.indentation.size`: Indentation size (default: 2)
- `json-power-tools.allowedExtensions`: File types to process (default: [".json"])
- `json-power-tools.ignoredFolders`: Directories to skip (comprehensive defaults)

### Commands
- `JSON Power Tools: Format Current JSON File`
- `JSON Power Tools: Format JSON File` (Explorer context)
- `JSON Power Tools: Format All JSON Files in Folder` (Explorer context)
- `JSON Power Tools: Open Settings`

### Technical Features
- Full English localization
- ESLint compliance
- Comprehensive error handling
- Progress reporting with statistics
- Case-insensitive extension matching
- Recursive directory traversal with depth limits