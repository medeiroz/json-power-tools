/**
 * Command: Open Settings
 * 
 * Opens the VS Code settings page filtered for JSON Power Tools settings
 */

const vscode = require('vscode');

/**
 * Opens the settings page filtered for JSON Power Tools
 * @returns {Promise<void>} - Promise that resolves when the settings are opened
 */
async function openSettings() {
    return vscode.commands.executeCommand('workbench.action.openSettings', 'json-power-tools');
}

/**
 * Command handler for opening settings
 * @returns {Promise<void>} - Promise that resolves when the settings are opened
 */
async function handler() {
    return openSettings();
}

/**
 * Register the open settings command
 * @param {vscode.ExtensionContext} context - The extension context
 */
function register(context) {
    const command = vscode.commands.registerCommand('json-power-tools.openSettings', handler);
    context.subscriptions.push(command);
}

module.exports = {
    register,
    handler,
    openSettings
};