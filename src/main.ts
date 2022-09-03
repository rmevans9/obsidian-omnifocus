import { Plugin } from "obsidian";
import OODataviewApi from "./apis/dataview";
import OOObsidianApi from "./apis/obsidian";
import OOOmnifocusApi from "./apis/omnifocus";

import { DEFAULT_SETTINGS, ObsidianOmnifocusSettings } from "./settings";
import SyncManager from "./SyncManager";
import { SettingsTab } from "./ui/SettingsTab";

export default class ObsidianOmnifocus extends Plugin {
  settings: ObsidianOmnifocusSettings;

  dataviewApi: OODataviewApi;
  obsidianApi: OOObsidianApi;
  omnifocusApi: OOOmnifocusApi;
  syncManager: SyncManager;

  async onload() {
    // Create our APIs
    this.dataviewApi = new OODataviewApi(this);
    this.obsidianApi = new OOObsidianApi(this);
    this.omnifocusApi = new OOOmnifocusApi(this);
    this.syncManager = new SyncManager(
      this,
      this.dataviewApi,
      this.obsidianApi,
      this.omnifocusApi
    );

    // Load up the settings
    await this.loadSettings();
    this.addSettingTab(new SettingsTab(this.app, this));

    // Add the commands
    this.addCommand({
      id: "obsidian-omnifocus-sync",
      name: "Sync tagged tasks to OmniFocus",
      callback: this.syncManager.syncTasks,
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
