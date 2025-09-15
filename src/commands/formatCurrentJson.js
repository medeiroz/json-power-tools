/**
 * Command: Format Current JSON File
 * 
 * Formats the currently active JSON file in the editor
 */

const vscode = require('vscode');
const { formatJsonContent } = require('../core/format-all-jsons');

/**
 * Returns the complete range of a document
 * @param {vscode.TextDocument} document - The VS Code document
 * @returns {vscode.Range} The complete range of the document
 */
function getEntireDocumentRange(document) {
    return new vscode.Range(
        0, 
        0, 
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
    );
}

/**
 * Formats the text of a JSON document
 * @param {string} text - JSON text to be formatted
 * @param {vscode.Range} range - The range to be replaced
 * @returns {vscode.TextEdit[] | null} Array of TextEdits if formatting was successful, or null on error
 */
function formatJsonText(text, range) {
    try {
        let formatted = formatJsonContent(text);

        if (formatted) {
            return [vscode.TextEdit.replace(range, formatted)];
        } else {
            console.warn('Formatting returned a falsy value');
        }
    } catch (error) {
        console.error('Error formatting JSON:', error.message);
    }
    return null;
}

/**
 * Formats an entire document
 * @param {vscode.TextDocument} document - The document to be formatted
 * @returns {vscode.TextEdit[] | null} Array of TextEdits if formatting was successful, or null on error
 */
function formatEntireDocument(document) {
    const text = document.getText();
    const entireRange = getEntireDocumentRange(document);
    return formatJsonText(text, entireRange);
}

/**
 * Executes formatting in an active editor
 * @param {vscode.TextEditor} editor - The active editor
 * @returns {Promise<boolean>} Promise resolved with true if successful, false otherwise
 */
async function executeFormatting(editor) {
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return false;
    }

    const { document } = editor;
    
    if (document.languageId !== 'json') {
        vscode.window.showErrorMessage('Active file is not a JSON file');
        return false;
    }

    const edits = formatEntireDocument(document);
    
    if (!edits) {
        vscode.window.showErrorMessage('Invalid JSON content');
        return false;
    }

    const success = await editor.edit(editBuilder => {
        const entireRange = getEntireDocumentRange(document);
        const formatted = edits[0].newText;
        editBuilder.replace(entireRange, formatted);
    });
    
    if (success) {
        vscode.window.showInformationMessage('JSON formatted successfully');
        return true;
    } else {
        vscode.window.showErrorMessage('Failed to format JSON');
        return false;
    }
}

/**
 * Register the format current JSON command
 * @param {vscode.ExtensionContext} context - The extension context
 */
function register(context) {
    // Register document formatter provider
    const documentFormatterProvider = vscode.languages.registerDocumentFormattingEditProvider('json', {
        provideDocumentFormattingEdits(document) {
            return formatEntireDocument(document) || [];
        }
    });

    // Register command
    const command = vscode.commands.registerCommand('json-power-tools.formatCurrentJson', () => {
        return executeFormatting(vscode.window.activeTextEditor);
    });

    context.subscriptions.push(documentFormatterProvider);
    context.subscriptions.push(command);
}

module.exports = {
    register,
    executeFormatting,
    formatEntireDocument
};