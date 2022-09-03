import { DataviewTask } from "./apis/dataview";

const INDENTATION_REGEX = /^([\s\t>]*)/;

export class Task {
  symbol: string;
  completed: boolean;
  description: string;
  path: string;
  line: number;

  constructor(
    symbol: string,
    completed: boolean,
    description: string,
    path: string,
    line: number
  ) {
    this.symbol = symbol;
    this.completed = completed;
    this.description = description;
    this.path = path;
    this.line = line;
  }

  public replaceTag(oldTag: string, newTag: string) {
    const indexOfOldTag = this.description.indexOf(`${oldTag} `);

    if (indexOfOldTag === -1) {
      // TODO: Tag not found? How?
      return;
    }

    const oldDescription = this.description;

    this.description = oldDescription.substring(0, indexOfOldTag);
    this.description += newTag;
    this.description += oldDescription.substring(indexOfOldTag + oldTag.length);
  }

  public getObsidianLink(vaultName: string) {
    return `obsidian://open?vault=${encodeURI(vaultName)}&file=${encodeURI(
      this.path
    )}`;
  }

  public toOmniString(syncedTag: string) {
    return this.description.replace(syncedTag, "").trim();
  }

  public toString(existingLine: string) {
    const indentation = existingLine.match(INDENTATION_REGEX)?.[0];

    return `${indentation}${this.symbol} [${this.completed ? "x" : " "}] ${
      this.description
    }`;
  }

  public static fromDataviewTask(task: DataviewTask) {
    return new Task(
      task.symbol,
      task.completed,
      task.text,
      task.path,
      task.line
    );
  }
}
