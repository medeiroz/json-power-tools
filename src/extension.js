/**
 * JSON Power Tools - VS Code Extension
 * 
 * This extension provides advanced JSON formatting tools,
 * including the ability to convert JSON strings into nested objects.
 */

const vscode = require('vscode');
const { setConfig } = require('./core/format-all-jsons');
const { registerAllCommands } = require('./commands');

/**
 * Gets the extension configuration
 * @returns {object} - Object with the configuration
 */
function getExtensionConfig() {
    const config = vscode.workspace.getConfiguration('json-power-tools');
    return {
        maxDepth: config.get('maxDepth', 256),
        ignoredFolders: config.get('ignoredFolders', []),
        indentationType: config.get('indentation.type', 'spaces'),
        indentationSize: config.get('indentation.size', 2),
        allowedExtensions: config.get('allowedExtensions', ['.json'])
    };
}

/**
 * Updates the format-all-jsons module configuration with current VS Code settings
 */
function updateModuleConfig() {
    const { maxDepth, ignoredFolders, indentationType, indentationSize, allowedExtensions } = getExtensionConfig();
    setConfig(maxDepth, ignoredFolders, indentationType, indentationSize, allowedExtensions);
}

/**
 * Activation function called when the extension is activated
 * @param {vscode.ExtensionContext} context - The extension context
 */
function activate(context) {
    console.log('Extension "json-power-tools" is now active!');
    
    // Initialize settings on extension load
    updateModuleConfig();

    // Listener to detect configuration changes
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('json-power-tools')) {
            console.log('JSON Power Tools: Configuration changed, updating...');
            updateModuleConfig();
        }
    });

    // Register all commands
    registerAllCommands(context);

    // Add configuration change listener to subscriptions
    context.subscriptions.push(configChangeListener);
}

/**
 * This method is called when your extension is deactivated
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};