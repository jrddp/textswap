# TextSwap

Quickly make and swap selections of text!

## Features

TextSwap adds simple commands with the following functionality:

- **First press**: Store the current selection of text to be swapped
- **Second press**: Swap the stored text with the current selection

There are 2 commands provided that differ only by how they assume a selection if there is not one already present. TextSwap (Word) will automatically select the word under the cursor, and TextSwap (Line) will automatically select the line under the cursor.

## Default Keybindings

- `Ctrl+K` to swap the word under the cursor with the selected text
- `Ctrl+Shift+K` to swap the line under the cursor with the selected text

## Isn't this just a less functional [ Transpose ](https://marketplace.visualstudio.com/items?itemName=v4run.transpose) command?

The reason I created this extension is to avoid needing to use multiple cursors, which Transpose relies on. I love multiple cursors, but I have yet to find a great solution for creating multiple precise selections using keyboard only. With this extension, you can use keyboard methods to precisely select the first group and then separately select the second group.
