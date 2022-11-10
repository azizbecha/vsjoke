import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vsjoke" is now active!');

	let disposable = vscode.commands.registerCommand('vsjoke.getJoke', () => {
		vscode.window.showInformationMessage('Hello World from vsjoke!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
