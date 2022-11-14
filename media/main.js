// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
    const vscode = acquireVsCodeApi();

    const button = /** @type {HTMLElement} */ (document.getElementById('getjoke'));
    const form = document.getElementById("form");

    button.addEventListener('click', () => {
        vscode.postMessage({
            command: 'showJoke',
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case 'refactor':
                currentCount = Math.ceil(currentCount * 0.5);
                counter.textContent = `${currentCount}`;
                break;
        }
    });
}());