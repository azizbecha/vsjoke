import * as vscode from 'vscode';
import fetch, { Response } from 'node-fetch';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('vsjoke.getJoke', () => {
		fetch('https://v2.jokeapi.dev/joke/Programming')
		.then((response: Response) => response.json())
  		.then(async (data: any) => {
			if (data.error === false){
				const message = `${data.setup}\n${data.delivery}`;
				const response = await vscode.window.showInformationMessage(message, "Another one");
				console.log(response);
			} else {
				vscode.window.showErrorMessage("An error has been occured");
			}
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
