'use strict';

(function () {
    const vscode = acquireVsCodeApi();

    const button = document.getElementById('getjoke');
    const form = document.getElementById("form");
    const languageSelector = document.getElementById("language");

    button.addEventListener('click', () => {
        vscode.postMessage({
            command: 'showJoke',
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        vscode.postMessage({
            command: 'updateSettings',
            language: languageSelector.value
        });
    });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        
        // switch (message.command) {
            
        // }
    });
}());