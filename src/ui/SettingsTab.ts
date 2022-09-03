import { App, PluginSettingTab, Setting } from "obsidian";
import type ObsidianOmnifocus from "src/main";

export class SettingsTab extends PluginSettingTab {
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