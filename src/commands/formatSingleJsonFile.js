/**
 * Command: Format Single JSON File
 * 
 * Formats a specific JSON file selected from the explorer
 */

const vscode = require('vscode');
const path = require('path');
const { formatSingleJson } = require('../core/format-all-jsons');

/**
 * Formats a single JSON file
 * @param {string} filePath - Path to the file to be formatted
 * @returns {Promise<boolean>} - Promise resolved with true if successful, false otherwise
 */
async function formatJsonFile(filePath) {
    try {
        const success = formatSingleJson(filePath);
        if (success) {
            vscode.window.showInformationMessage(`JSON file formatted successfully: ${path.basename(filePath)}`);
            return true;
        } else {
            vscode.window.showErrorMessage(`Failed to format JSON file: ${path.basename(filePath)}`);
            return false;
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error processing JSON file: ${error.message}`);
        return false;
    }
}

/**
 * Command handler for formatting a single JSON file
 * @param {vscode.Uri} uri - The URI of the selected file
 * @returns {Promise<boolean>} - Promise resolved with true if successful, false otherwise
 */
async function handler(uri) {
    if (uri && uri.fsPath) {
        return formatJsonFile(uri.fsPath);
    } else {
        vscode.window.showErrorMessage('No JSON file selected');
        return false;
    }
}

/**
 * Register the format single JSON file command
 * @param {vscode.ExtensionContext} context - The extension context
 */
function register(context) {
    const command = vscode.commands.registerCommand('json-power-tools.formatSingleJsonFile', handler);
    context.subscriptions.push(command);
}

module.exports = {
    register,
    handler,
    formatJsonFile
};