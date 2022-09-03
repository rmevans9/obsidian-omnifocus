import ObsidianOmnifocus from "src/main";

export default class OOObsidianApi {
  private _plugin: ObsidianOmnifocus;

  constructor(plugin: ObsidianOmnifocus) {
    this._plugin = plugin;
  }

  public async readFile(filePath: string) {
    const file = this._plugin.app.vault.getAbstractFileByPath(filePath);

    if (!file) {
      throw new Error("File not found!");
    }

    const currentText = await this._plugin.app.vault.adapter.read(filePath);

    return currentText.split("\n");
  }

  public async writeFile(filePath: string, content: string[]) {
    this._plugin.app.vault.adapter.write(filePath, content.join("\n"));
  }
}
