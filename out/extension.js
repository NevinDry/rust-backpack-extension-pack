"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const preferredSettings = [
    ['rustPanicHighlighter.icon.enabled', false]
];
const STATE_KEY = 'preferredRustSettingsStatus';
async function activate(context) {
    const status = context.globalState.get(STATE_KEY);
    if (status === 'applied' || status === 'skipped') {
        return;
    }
    const config = vscode.workspace.getConfiguration();
    const summary = preferredSettings
        .map(([key, value]) => `• ${key} = ${JSON.stringify(value)}`)
        .join('\n');
    const choice = await vscode.window.showInformationMessage(`Apply the following recommended Rust settings?\n\n${summary}`, 'Apply All', 'Review Individually', 'Skip');
    if (choice === 'Apply All') {
        for (const [key, value] of preferredSettings) {
            await config.update(key, value, vscode.ConfigurationTarget.Global);
        }
        vscode.window.showInformationMessage('All recommended Rust settings applied.');
        await context.globalState.update(STATE_KEY, 'applied');
    }
    else if (choice === 'Review Individually') {
        for (const [key, value] of preferredSettings) {
            const itemChoice = await vscode.window.showQuickPick(['Apply', 'Skip'], {
                placeHolder: `Set ${key} = ${JSON.stringify(value)}?`
            });
            if (itemChoice === 'Apply') {
                await config.update(key, value, vscode.ConfigurationTarget.Global);
            }
        }
        vscode.window.showInformationMessage('Selected Rust settings applied.');
        await context.globalState.update(STATE_KEY, 'applied');
    }
    else if (choice === 'Skip') {
        await context.globalState.update(STATE_KEY, 'skipped');
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map