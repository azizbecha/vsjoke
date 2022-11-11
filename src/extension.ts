import * as vscode from 'vscode';
import { getJoke } from './getJoke';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('vsjoke.getJoke', async () => {
		const data: any = await getJoke();

		if (data.error === false){
			const message = `${data.setup}\n${data.delivery}`;
			const response = await vscode.window.showInformationMessage(message, "Another one");
			console.log(response);
		} else {
			vscode.window.showErrorMessage("An error has been occured");
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('vsjoke.getJoke', async () => {
		vscode.window.showErrorMessage("VSJoke is deactivated");
	}));
}
