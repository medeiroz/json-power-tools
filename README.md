# JSON Power Tools

<div align="center">

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue)](https://marketplace.visualstudio.com/items?itemName=medeiroz.json-power-tools)
[![Version](https://img.shields.io/visual-studio-marketplace/v/medeiroz.json-power-tools)](https://marketplace.visualstudio.com/items?itemName=medeiroz.json-power-tools)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/medeiroz.json-power-tools)](https://marketplace.visualstudio.com/items?itemName=medeiroz.json-power-tools)

**Transform your JSON workflow with intelligent formatting and powerful automation tools**

</div>

**JSON Power Tools** is a comprehensive VS Code extension that revolutionizes JSON handling. It intelligently converts nested JSON strings into properly structured objects, provides bulk processing capabilities, and offers complete control over formatting preferences. Perfect for developers working with APIs, configuration files, and complex JSON data structures.

## ✨ Key Features

### 🧠 **Intelligent JSON Processing**
- **🔄 Nested String Conversion**: Automatically detects and converts JSON strings within objects to properly nested structures
- **📁 Bulk Folder Processing**: Format hundreds of JSON files with a single command
- **🎯 Smart File Detection**: Supports `.json`, `.jsonc`, `.txt`, and custom extensions
- **⚡ Performance Optimized**: Lightning-fast processing with intelligent depth limits and memory management

### 🎨 **Advanced Formatting Options**
- **📏 Flexible Indentation**: Choose between spaces (2, 4, 8, etc.) or tabs with custom width
- **🔧 VS Code Integration**: Full integration with VS Code's built-in format command (`Shift+Alt+F`)
- **🖱️ Context Menu Support**: Right-click formatting for files, folders, and editor content
- **⚙️ Real-time Updates**: Configuration changes apply immediately without restart

### 🛡️ **Smart Filtering & Safety**
- **🚫 Intelligent Exclusion**: Automatically skips `node_modules`, `dist`, `.git`, and 35+ common directories
- **📄 Extension Filtering**: Process only the file types you specify
- **📊 Depth Control**: Prevent infinite recursion with configurable depth limits
- **🔍 Error Handling**: Gracefully handles malformed JSON without breaking the process

### 🚀 **Developer Experience**
- **📊 Progress Feedback**: Real-time progress reports for bulk operations
- **🎯 Multiple Access Methods**: 7 different ways to format your JSON files
- **⌨️ Keyboard Shortcuts**: Quick access via Command Palette and hotkeys
- **📈 Performance Metrics**: Duration and success rate reporting

## 📦 Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "JSON Power Tools"
4. Click **Install**

Or install via command line:
```bash
code --install-extension medeiroz.json-power-tools
```

## 🎯 How to Use

### 🎮 **Method 1: Command Palette**
Use `Ctrl+Shift+P` and search for JSON Power Tools commands:

![Command Palette Usage](documentation/[2]%20ctrl%20%2B%20shift%20%2B%20p%20--%20run%20command.gif)

### 📁 **Method 2: Right-Click on Files**
Right-click any JSON file in the Explorer:

![File Context Menu](documentation/[5]%20right%20click%20in%20file%20-%20file%20explorer.gif)

### 📂 **Method 3: Right-Click on Folders**
Process entire directories at once:

![Folder Context Menu](documentation/[6]%20right%20click%20in%20folder%20-%20file%20explorer.gif)

### ⌨️ **Method 4: Format Document (Hotkey)**
Set as default formatter and use `Shift+Alt+F`:

![Configure Default Formatter](documentation/[1]%20configure%20default%20formater.gif)

### 🎛️ **Method 5: Format Document With... (Context Menu)**
Right-click in the editor and choose formatting tool:

![Format Document With](documentation/[3]%20right%20click%20in%20actual%20content%20-%20format%20document%20with.gif)

### 🔧 **Method 6: Context Menu Formatting**
Use the dedicated formatting option in editor context menu:

![Context Menu Tool](documentation/[4]%20right%20click%20in%20actual%20content%20-%20format%20tool.gif)

### ⚡ **Method 7: Auto-Format on Save**
Configure automatic formatting when saving files:

![Auto Format Configuration](documentation/[7]%20configure%20auto%20format.gif)

## 🎭 Real-World Examples

### 📚 **Example 1: API Response Formatting**

**Before** (Raw API response with nested JSON strings):
```json
{
  "status": "success",
  "user": "John Doe",
  "profile": "{\"age\": 30, \"city\": \"New York\", \"preferences\": \"{\\\"theme\\\": \\\"dark\\\", \\\"notifications\\\": true}\"}"
}
```

**After** (Beautifully structured):
```json
{
  "status": "success",
  "user": "John Doe",
  "profile": {
    "age": 30,
    "city": "New York",
    "preferences": {
      "theme": "dark",
      "notifications": true
    }
  }
}
```

### 🏗️ **Example 2: Configuration Files**

**Before** (Minified config with escaped strings):
```json
{"database":"{\"host\":\"localhost\",\"credentials\":\"{\\\"username\\\":\\\"admin\\\",\\\"password\\\":\\\"secret\\\"}\"}","settings":"{\"debug\":true,\"logging\":{\"level\":\"info\"}}"}
```

**After** (Clean, readable configuration):
```json
{
  "database": {
    "host": "localhost",
    "credentials": {
      "username": "admin",
      "password": "secret"
    }
  },
  "settings": {
    "debug": true,
    "logging": {
      "level": "info"
    }
  }
}
```

### 🔍 **Example 3: Complex Nested Structures**

Perfect for handling logs, API responses, configuration files, and any JSON with multiple nesting levels!

## ⚙️ Configuration

### 🎛️ **Quick Settings Access**
- Use Command Palette: `Ctrl+Shift+P` → "JSON Power Tools: Open Settings"
- Or go to: `File > Preferences > Settings` → Search "JSON Power Tools"

### 📝 **Indentation Preferences**
Choose your preferred code style:

```json
{
  "json-power-tools.indentation.type": "spaces",  // "spaces" or "tabs"
  "json-power-tools.indentation.size": 2          // 2, 4, 8 spaces or tab width
}
```

**Popular Configurations:**
- **Standard**: 2 spaces (default)
- **Enterprise**: 4 spaces  
- **Compact**: Tabs with size 1

### 📁 **File Processing Control**
Customize which files get processed:

```json
{
  "json-power-tools.allowedExtensions": [".json", ".jsonc", ".txt", ".config"],
  "json-power-tools.maxDepth": 256  // Prevent infinite recursion
}
```

### 🚫 **Smart Folder Exclusion**
Skip unnecessary directories (35+ defaults included):

```json
{
  "json-power-tools.ignoredFolders": [
    "node_modules", "dist", "build", ".git", "vendor", 
    "bower_components", ".vscode", "coverage", "logs"
  ]
}
```

### 🔧 **Advanced Options**
Fine-tune the processing behavior:

| Setting | Purpose | Performance Impact |
|---------|---------|-------------------|
| `maxDepth: 50` | Faster for shallow structures | ⚡ High |
| `maxDepth: 256` | Standard (recommended) | ⚖️ Balanced |
| `maxDepth: 1000` | Deep nested projects | 🐌 Slower |

## 📋 Available Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `maxDepth` | `256` | Maximum depth for recursive folder processing |
| `indentation.type` | `"spaces"` | Indentation type: "spaces" or "tabs" |
| `indentation.size` | `2` | Number of spaces per indent level |
| `allowedExtensions` | `[".json"]` | File extensions to process |
| `ignoredFolders` | `[extensive list]` | Folder names to skip during processing |

## 🎮 Available Commands

### 📄 **Single File Commands**
| Command | Shortcut | Context | Description |
|---------|----------|---------|-------------|
| `JSON Power Tools: Format Current JSON File` | `Ctrl+Shift+P` | Active Editor | Format the currently open JSON file |
| `JSON Power Tools: Format JSON File` | Right-click | File Explorer | Format any selected JSON file |

### 📁 **Bulk Processing Commands**  
| Command | Context | Description |
|---------|---------|-------------|
| `JSON Power Tools: Format All JSON Files in Folder` | Right-click folder | Process entire directories recursively |

### ⚙️ **Utility Commands**
| Command | Purpose | Access |
|---------|---------|--------|
| `JSON Power Tools: Open Settings` | Quick settings access | Command Palette |

### 🔧 **VS Code Integration**
| Feature | Shortcut | Description |
|---------|----------|-------------|
| **Format Document** | `Shift+Alt+F` | Use as default JSON formatter |
| **Format Selection** | `Ctrl+K Ctrl+F` | Format selected JSON content |
| **Format on Save** | Auto | Configure in settings |

### 💡 **Pro Tips**
- **Batch Processing**: Select multiple files in Explorer, right-click → Format
- **Keyboard Workflow**: Set as default formatter for seamless `Shift+Alt+F` usage
- **Auto-Format**: Enable format-on-save for continuous JSON cleanup

## 🔧 Requirements

- VS Code 1.104.0 or higher
- No additional dependencies required

## 🐛 Troubleshooting

### ⚠️ **Common Issues & Solutions**

| Issue | Cause | Solution |
|-------|-------|----------|
| **Slow processing on large files** | Files >10MB | Increase `maxDepth` or process smaller batches |
| **Some JSON strings not converted** | Invalid nested JSON | Check for malformed escape sequences |
| **Binary files being processed** | Wrong file extension | Review `allowedExtensions` setting |
| **Missing files in folder processing** | Excluded directories | Check `ignoredFolders` configuration |

### 🔧 **Performance Optimization**
- **Large Projects**: Set `maxDepth: 50` for faster scanning
- **Monorepos**: Add project-specific folders to `ignoredFolders`
- **Network Drives**: Process local copies for better performance

### 💡 **Best Practices**
- ✅ **Test on small folders first** before processing large directories
- ✅ **Keep backups** when processing critical configuration files  
- ✅ **Use version control** to easily revert changes if needed
- ✅ **Configure auto-format** for seamless development workflow

## 🚀 Release Notes

### 0.0.1 (Initial Release)
### 0.0.2 (Add icons and screenshots to README)

#### Features
- ✅ Smart JSON string to object conversion
- ✅ Bulk folder processing with progress feedback
- ✅ Configurable indentation (spaces/tabs, size)
- ✅ File extension filtering
- ✅ Recursive directory processing with depth limits
- ✅ Context menu integration
- ✅ Document formatting provider
- ✅ Real-time configuration updates
- ✅ Comprehensive folder exclusion defaults

#### Performance
- ✅ Optimized recursive file discovery
- ✅ Efficient JSON parsing and stringifying
- ✅ Memory-conscious processing for large directories

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 **Report Issues**
Found a bug? [Open an issue](https://github.com/medeiroz/json-power-tools/issues) with:
- VS Code version
- Extension version  
- Sample JSON that causes the issue
- Expected vs actual behavior

### 💡 **Suggest Features**
Have an idea? We'd love to hear it! [Create a feature request](https://github.com/medeiroz/json-power-tools/issues/new) with:
- Use case description
- Expected behavior
- Benefits to other users

### 🔧 **Development Setup**
```bash
git clone https://github.com/medeiroz/json-power-tools.git
cd json-power-tools
npm install
npm test
```

## 📄 License

This extension is licensed under the [MIT License](LICENSE).

## 🙏 Show Your Support

If this extension saves you time and makes your JSON workflow better:

### ⭐ **Star Us**
- ⭐ Star the [GitHub repository](https://github.com/medeiroz/json-power-tools)
- 📈 Help others discover this tool

### 📝 **Share Your Experience**  
- 📝 Write a review on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=medeiroz.json-power-tools)
- � Share on social media with `#JSONPowerTools`
- 💬 Tell your team about it

### 🔗 **Stay Connected**
- 🔔 Watch the repo for updates
- 📢 Follow for new features and improvements
- 🤝 Join our growing community

---

<div align="center">

**Made with ❤️ for the developer community**

*Happy JSON formatting! 🎉*

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/medeiroz/json-power-tools)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=medeiroz.json-power-tools)

</div>
