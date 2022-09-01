import { Plugin } from "obsidian";

import { setApp } from "./obsidianApi";
import { syncTasks } from "./syncManager";

export default class ObsidianOmnifocus extends Plugin {
  async onload() {
    setApp(this.app);

    this.addCommand({
      id: "obsidian-omnifocus-sync",
      name: "Sync tagged tasks to OmniFocus",
      callback: () => syncTasks(this.app.vault.getName()),
    });
  }
}
