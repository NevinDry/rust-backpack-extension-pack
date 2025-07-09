import * as vscode from 'vscode';

const preferredSettings: [string, any][] = [
    ['rustPanicHighlighter.icon.enabled', false],
];

export async function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration();

    const summary = preferredSettings
        .map(([key, value]) => `• ${key} = ${JSON.stringify(value)}`)
        .join('\n');

    const choice = await vscode.window.showInformationMessage(
        `Apply the following recommended Rust settings?\n\n${summary}`,
        'Apply All',
        'Review Individually',
        'Cancel'
    );

    if (choice === 'Apply All') {
        for (const [key, value] of preferredSettings) {
            await config.update(key, value, vscode.ConfigurationTarget.Global);
        }
        vscode.window.showInformationMessage('All recommended Rust settings applied.');
    } else if (choice === 'Review Individually') {
        for (const [key, value] of preferredSettings) {
            const itemChoice = await vscode.window.showQuickPick(
                ['Apply', 'Skip'],
                {
                    placeHolder: `Set ${key} = ${JSON.stringify(value)}?`
                }
            );
            if (itemChoice === 'Apply') {
                await config.update(key, value, vscode.ConfigurationTarget.Global);
            }
        }
        vscode.window.showInformationMessage('Selected Rust settings applied.');
    }
}

export function deactivate() { }