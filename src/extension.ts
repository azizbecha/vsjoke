import * as vscode from 'vscode';

import { getJoke } from './getJoke';
import { getNonce } from './getNonce';
import { readSettings } from './readSettings';
import { timeToMilliseconds } from './timeToMilliseconds';
import { updateSettings } from './updateSettings';

let getJokeStatusBarButton: vscode.StatusBarItem;
let openSettingsStatusBarButton: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {

	// Status Bar Buttons
	getJokeStatusBarButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	getJokeStatusBarButton.command = 'vsjoke.getJoke';
	getJokeStatusBarButton.text = `$(smiley) Get Joke`;
	getJokeStatusBarButton.tooltip = "Click to Get a Joke";
	context.subscriptions.push(getJokeStatusBarButton);
	getJokeStatusBarButton.show();

	openSettingsStatusBarButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 50);
	openSettingsStatusBarButton.command = 'vsjoke.settings';
	openSettingsStatusBarButton.text = `$(gear) VSJoke Settings`;
	openSettingsStatusBarButton.tooltip = "Click to Open VSJoke Settings";
	context.subscriptions.push(openSettingsStatusBarButton);
	openSettingsStatusBarButton.show();
	
	// const version = vscode.extensions.getExtension('azizbecha.vsjoke')?.packageJSON.version;

	const { timing } = readSettings();
	
	const showJoke = async () => {
		let data: any = await getJoke();
	
		if (data.error === false){
			const message = `${data.setup}\n${data.delivery}`;
			const response = await vscode.window.showInformationMessage(message);
			console.log(response);
		} else {
			vscode.window.showErrorMessage(`${data.additionalInfo}`);
		}
	};

	if (timing !== "None") {
		setInterval(() => {
			showJoke();
		}, timeToMilliseconds(timing));
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('vsjoke.getJoke', () => {
			showJoke();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('vsjoke.settings', () => {			
			VSJokePanel.createOrShow(context.extensionUri, context);
		})
	);


	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(VSJokePanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`);
				// Reset the webview options so we use latest uri for `localResourceRoots`.
				webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
				VSJokePanel.revive(webviewPanel, context.extensionUri, context);
			}
		});
	}
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,
	};
}

class VSJokePanel {

	public static currentPanel: VSJokePanel | undefined;

	public static readonly viewType = 'vsJoke';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri, context: vscode.ExtensionContext) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (VSJokePanel.currentPanel) {
			VSJokePanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			VSJokePanel.viewType,
			'VSJoke',
			vscode.ViewColumn.One,
			getWebviewOptions(extensionUri),
		);

		VSJokePanel.currentPanel = new VSJokePanel(panel, extensionUri, context);
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, extensionContext: vscode.ExtensionContext) {
		VSJokePanel.currentPanel = new VSJokePanel(panel, extensionUri, extensionContext);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, context: vscode.ExtensionContext) {
		this._panel = panel;
		this._extensionUri = extensionUri;

		// Set the webview's initial html content
		//this._update();
		this._panel.title = "VSJoke";
		
		this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'showJoke':
						getJoke().then((data: any) => {
							if (data.error === false){
								const message = `${data.setup}\n${data.delivery}`;

								vscode.window.showInformationMessage(message);
							} else {
								vscode.window.showErrorMessage("An error has been occured");
							}
							vscode.window.showErrorMessage(message.text);
							return;
						});
						break;
					case 'updateSettings':
						updateSettings(message.language, message.flags, message.timing);
						vscode.window.showInformationMessage("Settings updated successfully");
						
						break;

				}
			},
			null,
			this._disposables
		);
	}

	public dispose() {
		VSJokePanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _getHtmlForWebview(webview: vscode.Webview) {

		// Local path to main script run in the webview
		const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js');

		// And the uri we use to load this script in the webview
		const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

		// Local path to css styles
		const stylesVscodePath = vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css');
		const stylesPathMainPath= vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css');

		// Uri to load styles into webview
		const stylesResetUri = webview.asWebviewUri(stylesVscodePath);
		const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);

		// Use a nonce to only allow specific scripts to be run
		const nonce = getNonce();

		const languages = [
			{ name: 'English', prefix: 'en' },
			{ name: 'German', prefix: 'de' },
			{ name: 'Spanish', prefix: 'es' },
		];

		const flags = [
			{ name: 'NSFW', prefix: 'nsfw' },
			{ name: 'Religious', prefix: 'religious' },
			{ name: 'Political', prefix: 'political' },
			{ name: 'Racist', prefix: 'racist' },
			{ name: 'Sexist', prefix: 'sexist' },
			{ name: 'Explicit', prefix: 'explicit' }
		];

		const timings = ["None", "1 minute", "2 minutes", "3 minutes", "4 minutes", "5 minutes", "10 minutes", "15 minutes", " 30 minutes", " 1 hour"];

		const settings = readSettings();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">
				<link href="${stylesVscodePath}" rel="stylesheet">
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
				<title>VSJoke</title>
			</head>
			<body>
				<h1>VSJoke</h1>
				<p>Taking Programming Jokes to the moon 🚀</p>
				<hr />
				<div class="flex">
					<div class="w-50">
						<form class="mt-1" id="form" method="post">
							<h2><span class="fa fa-gear"></span> Settings</h2>
							<br />
							<label><span class="fa fa-globe"></span> Language</label><br />
							<select id="language" class="mt-1">
								${
									languages.map((language, key) => {
										return `<option ${language.prefix === settings.language && 'selected'} key="${key}" value="${language.prefix}">${language.name}</option>`;
									}).join('')
								}
							</select>

							<br /><br />
							<label><span class="fa fa-ban"></span> Blacklisted flags</label><br />
							<div class="mt-1">
								${
									flags.map((flag, key) => {
										return `<input key="${key}" ${settings.blacklistedFlags.includes(flag.prefix) && 'checked'} type="checkbox" name="flag" id="${flag.prefix}" value="${flag.prefix}"><label for="${flag.name}">${flag.name}</label><br />`;
									}).join('')
								}
							</div>
							<br>

							<label><span class="fa fa-clock"></span> Show Joke every</label><br />
							<select id="timing" class="mt-1">
								${
									timings.map((timing, key) => {
										return `<option ${timing === settings.timing && 'selected'} key="${key}" value="${timing}">${timing}</option>`;
									}).join('')
								}
							</select>

							<br /><br />
							
							<button type="submit"><span class="fa fa-save"></span> Save settings</button>
						</form>
					</div>
					<div class="w-50 ml-1">
						<img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />

						<button id="getjoke"><span class="fa fa-laugh-squint"></span> Get Joke</button>
					</div>
				</div>
				<script nonce="${nonce}" type="module" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}