import * as vscode from "vscode";

let firstSelection: { content: string; range: vscode.Range } | null = null;
const decorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: "rgba(255,255,0,0.5)",
});

export function activate(context: vscode.ExtensionContext) {
  let textSwapCmd = vscode.commands.registerCommand("textswap.textswap", () =>
    handleTextSwap("word")
  );

  let textSwapLineCmd = vscode.commands.registerCommand("textswap.textswapline", () =>
    handleTextSwap("line")
  );

  context.subscriptions.push(textSwapCmd, textSwapLineCmd);
}

async function handleTextSwap(defaultSelection: "word" | "line") {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  let selection = editor.selection;
  let selectedText = editor.document.getText(selection);

  // If there's no selection, get the word or line at the cursor
  if (selection.isEmpty) {
    if (defaultSelection === "word") {
      const wordRange = editor.document.getWordRangeAtPosition(selection.active);
      if (wordRange) {
        selection = new vscode.Selection(wordRange.start, wordRange.end);
        selectedText = editor.document.getText(wordRange);
      } else {
        vscode.window.showInformationMessage("No word at cursor position.");
        return;
      }
    } else {
      // defaultSelection === 'line'
      const line = editor.document.lineAt(selection.active.line);
      selection = new vscode.Selection(line.range.start, line.range.end);
      selectedText = line.text;
    }
  }

  if (!firstSelection) {
    // First press: store the selection and apply highlight
    firstSelection = { content: selectedText, range: selection };
    editor.setDecorations(decorationType, [selection]);

    // Exit Vim visual mode
    await vscode.commands.executeCommand("extension.vim_escape");

    const newPosition = selection.end;
    editor.selection = new vscode.Selection(newPosition, newPosition);
  } else {
    // Cancel if selections overlap
    if (selection.intersection(firstSelection.range)) {
      vscode.window.showInformationMessage("Selections overlap. Operation canceled.");
      firstSelection = null;
      editor.setDecorations(decorationType, []);
      return;
    }

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
}

export function deactivate() {}
