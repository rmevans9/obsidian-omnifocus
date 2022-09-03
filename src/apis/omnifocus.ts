import { createTask } from "@jacobx1/of-sdk";
import type ObsidianOmnifocus from "src/main";
import { Task } from "src/Task";

export default class OOOmnifocusApi {
  private _plugin: ObsidianOmnifocus;

  constructor(plugin: ObsidianOmnifocus) {
    this._plugin = plugin;
  }

  createTask(task: Task) {
    createTask(task.toOmniString(this._plugin.settings.tagForSynced), {
      note: task.getObsidianLink(this._plugin.app.vault.getName()),
    });
  }
}
