import * as vscode from 'vscode';
import { Client } from 'node-osc';

const getClient = () => {
    return new Client('127.0.0.1', 4557);
}

const decorationType = vscode.window.createTextEditorDecorationType({
    fontWeight: 'bold',
    backgroundColor: 'white',
    color: 'deeppink'
});

const fullRange = [new vscode.Range(new vscode.Position(0, 0), new vscode.Position(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))];

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerTextEditorCommand('sonicpi4code.run', editor => {
        if (!editor || !editor.document) {
            return;
        }
        
        editor.setDecorations(decorationType, fullRange);
        console.info('[sonicpi4code] Sending code to SonicPi...');
        const osc = getClient();
		osc.send('/run-code', 'sonic-vscode', editor.document.getText(), () => {
            osc.close();
            setTimeout(() => editor.setDecorations(decorationType, []), 300);
        });
	});
    context.subscriptions.push(disposable);
    
    disposable = vscode.commands.registerCommand('sonicpi4code.stop', () => {
        console.info('[sonicpi4code] Stopping SonicPi...');
        const osc = getClient();
        osc.send('/stop-all-jobs', 'sonic-vscode', () => {
            osc.close();
        });
    });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
    
}