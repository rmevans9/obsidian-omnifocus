import { App } from "obsidian";

let _app: App | null = null;
export function setApp(app: App) {
  _app = app;
}

export async function updateNote(
  filePath: string,
  startPos: number,
  endPos: number,
  needle: string,
  replace: string,
  markCompleted: boolean
) {
  if (!_app) {
    throw new Error("No app defined!");
  }

  const file = _app.vault.getAbstractFileByPath(filePath);

  if (!file) {
    throw new Error("File not found!");
  }

  const currentText = await _app.vault.adapter.read(filePath);
  let newText = "";

  const startOfNeedle = currentText.indexOf(needle, startPos);

  if (startOfNeedle === -1) {
    // What?!?
    throw new Error("Couldn't find the tag");
  }

  if (startOfNeedle > endPos) {
    // What?!?
    throw new Error("Couln't find the tag in the right place");
  }

  newText = currentText.substring(0, startOfNeedle);
  newText += replace;
  newText += currentText.substring(startOfNeedle + needle.length);

  if (markCompleted) {
    // TODO: This could use a TON of optimization because we are rebuilding the text AGAIN!
    const startOfCheckbox = newText.indexOf("[", startPos);
    const prevStepText = newText;

    newText = prevStepText.substring(0, startOfCheckbox + 1);
    newText += "x";
    newText += prevStepText.substring(startOfCheckbox + 2);
  }

  // For debugging for now
  console.log("Original Text", currentText);
  console.log("Updated Text", newText);

  _app.vault.adapter.write(filePath, newText);
}
