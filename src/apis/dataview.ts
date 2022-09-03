import { Notice } from "obsidian";
import { getAPI } from "obsidian-dataview";
import type ObsidianOmnifocus from "src/main";

export interface DataviewPage {
  file: {
    tasks: { values: DataviewTask[] };
  };
}

export interface DataviewTask {
  symbol: string;
  completed: boolean;
  line: number;
  path: string;
  tags: string[];
  text: string;
  position: {
    start: {
      offset: number;
    };
    end: {
      offset: number;
    };
  };
}

export default class OODataviewApi {
  private _plugin: ObsidianOmnifocus;

  constructor(plugin: ObsidianOmnifocus) {
    this._plugin = plugin;
  }

  fetchTaggedTasks() {
    const tagToSync = this._plugin.settings.tagToSync;
    const api = getAPI();

    if (!api) {
      new Notice(
        "Obsidian Omnifocus\nDataview plugin not found but is required to run!"
      );

      console.error(
        "[Obsidian-Omnifocus] Dataview is not available. Check that you have installed the Dataview plugin: https://github.com/blacksmithgu/obsidian-dataview"
      );
      return [];
    }

    const pages = api.pages(tagToSync).values as DataviewPage[];

    const tasks = pages.reduce<DataviewTask[]>((currTasks, page) => {
      const pageTasks = page.file.tasks.values.reduce<DataviewTask[]>(
        (currPageTasks, task) => {
          if (!task.completed && task.tags.includes(tagToSync)) {
            currPageTasks.push(task);
          }

          return currPageTasks;
        },
        []
      );

      return [...currTasks, ...pageTasks];
    }, []);

    return tasks;
  }
}
