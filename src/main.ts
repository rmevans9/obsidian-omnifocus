import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

import { setApp } from "./obsidianApi";
import { DEFAULT_SETTINGS, ObsidianOmnifocusSettings } from "./settings";
import { syncTasks } from "./syncManager";

export default class ObsidianOmnifocus extends Plugin {
  settings: ObsidianOmnifocusSettings;

  async onload() {
    await this.loadSettings();

    setApp(this.app);

    this.addCommand({
      id: "obsidian-omnifocus-sync",
      name: "Sync tagged tasks to OmniFocus",
      callback: () => syncTasks(this.app.vault.getName(), this.settings),
    });

    this.addSettingTab(new ObsidianOmnifocusSettingTab(this.app, this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

export class ObsidianOmnifocusSettingTab extends PluginSettingTab {
  plugin: ObsidianOmnifocus;

  constructor(app: App, plugin: ObsidianOmnifocus) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings" });

    new Setting(containerEl)
      .setName("Mark task completed on sync?")
      .setDesc(
        "This will mark the task in Obsidian as completed when it is sync'd to OmniFocus"
      )
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.markCompletedOnSync)
          .onChange(async (value) => {
            this.plugin.settings.markCompletedOnSync = value;
            await this.plugin.saveSettings();
          });
      });
  }
}
