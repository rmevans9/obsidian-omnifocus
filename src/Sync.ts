import OODataviewApi from "./apis/dataview";
import OOObsidianApi from "./apis/obsidian";
import OOOmnifocusApi from "./apis/omnifocus";
import type ObsidianOmnifocus from "./main";
import { Task } from "./Task";

export default class SyncApi {
  private _plugin: ObsidianOmnifocus;
  private _dataviewApi: OODataviewApi;
  private _obsidianApi: OOObsidianApi;
  private _omnifocusApi: OOOmnifocusApi;

  constructor(
    plugin: ObsidianOmnifocus,
    dataviewApi: OODataviewApi,
    obsidianApi: OOObsidianApi,
    omnifocusApi: OOOmnifocusApi
  ) {
    this._plugin = plugin;
    this._dataviewApi = dataviewApi;
    this._obsidianApi = obsidianApi;
    this._omnifocusApi = omnifocusApi;
  }

  syncTasks = async () => {
    const dataviewTasks = this._dataviewApi.fetchTaggedTasks();
    const tasks = dataviewTasks.map(Task.fromDataviewTask);
    const groupedTasks = tasks.reduce<Record<string, Task[]>>(
      (groups, task) => {
        // Create a group if it doesn't exist already
        if (!groups[task.path]) {
          groups[task.path] = [];
        }

        // Mark the task completed if the settings say to
        if (this._plugin.settings.markCompletedOnSync) {
          task.completed = true;
        }

        // Replace the sync tag with the synced tag
        if (this._plugin.settings.useTagForSelection) {
          task.replaceTag(
            this._plugin.settings.tagToSync,
            this._plugin.settings.tagForSynced
          );
        } else {
          task.insertTag(this._plugin.settings.tagForSynced);
        }

        // Ship the task to OmniFocus
        this._omnifocusApi.createTask(task);

        // Add this task the group based on the file it is in
        groups[task.path].push(task);

        return groups;
      },
      {}
    );

    const updateTasks: Promise<null>[] = Object.entries(groupedTasks).map(
      ([filePath, tasks]) => {
        return new Promise(async (resolve) => {
          const fileContents = await this._obsidianApi.readFile(filePath);

          tasks.forEach((task) => {
            // Right now we have to pass in the existing line so we can find the amount of indentation that we need
            fileContents[task.line] = task.toString(fileContents[task.line]);
          });

          await this._obsidianApi.writeFile(filePath, fileContents);

          resolve(null);
        });
      }
    );

    await Promise.all(updateTasks);
  };
}
