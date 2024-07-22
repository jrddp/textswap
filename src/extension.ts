import * as vscode from "vscode";

let firstSelection: { content: string; range: vscode.Range } | null = null;
const decorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: "rgba(255,255,0,0.5)",
});

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "textswap" is now active!');

  const helloWorldCmd = vscode.commands.registerCommand("textswap.helloWorld", () => {
    vscode.window.showInformationMessage("Hello World from textswap!");
  });

  let textSwapCmd = vscode.commands.registerCommand("textswap.textswap", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    let selection = editor.selection;
    let selectedText = editor.document.getText(selection);

    // If there's no selection, get the word at the cursor
    if (selection.isEmpty) {
      const wordRange = editor.document.getWordRangeAtPosition(selection.active);
      if (wordRange) {
        selection = new vscode.Selection(wordRange.start, wordRange.end);
        selectedText = editor.document.getText(wordRange);
      } else {
        // If there's no word at the cursor, we can't proceed
        vscode.window.showInformationMessage("No word at cursor position.");
        return;
      }
    }

    if (!firstSelection) {
      // First press: store the selection and apply highlight
      firstSelection = { content: selectedText, range: selection };
      editor.setDecorations(decorationType, [selection]);

      // Exit Vim visual mode
      await vscode.commands.executeCommand("extension.vim_escape");

      // Move cursor to end of selection
      const newPosition = selection.end;
      editor.selection = new vscode.Selection(newPosition, newPosition);
    } else {
      // Second press: swap text
      await editor.edit(editBuilder => {
        editBuilder.replace(firstSelection!.range, selectedText);
        editBuilder.replace(selection, firstSelection!.content);
      });
      await vscode.commands.executeCommand("extension.vim_escape");

      // Clear stored selection and highlights
      firstSelection = null;
      editor.setDecorations(decorationType, []);
    }
  });

  context.subscriptions.push(helloWorldCmd);
  context.subscriptions.push(textSwapCmd);
}

export function deactivate() {}
