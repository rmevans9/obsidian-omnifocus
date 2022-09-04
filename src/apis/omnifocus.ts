import { createTask, omniFunc } from "@jacobx1/of-sdk";
import { Project } from "@jacobx1/of-types";
import type ObsidianOmnifocus from "src/main";
import { Task } from "src/Task";

interface FlattenedProject {
  id: string;
  name: string;
  folder: string[];
}

export default class OOOmnifocusApi {
  private _plugin: ObsidianOmnifocus;

  constructor(plugin: ObsidianOmnifocus) {
    this._plugin = plugin;
  }

  async createTask(task: Task) {
    const linkGenerator = this._plugin.settings.useAdvancedUri
      ? task.getAdvancedObsidianLink
      : task.getObsidianLink;

    await createTask(task.toOmniString(this._plugin.settings.tagForSynced), {
      note: linkGenerator(this._plugin.app.vault.getName()),
    });
  }

  async getProjectList() {
    const projects = await omniFunc(
      function () {
        const projects: FlattenedProject[] = [];

        const anyThis = this as any;

        const rootProjects = anyThis.projects;

        projects.push(
          ...rootProjects
            .filter((project: Project) => !project.completed)
            .map((project: Project) => ({
              id: project.id.primaryKey,
              name: project.name,
              folder: "",
            }))
        );

        const rootFolders = anyThis.folders;

        function processFolder(folder: any, topLevelFolders: string[] = []) {
          const folderProjects = folder.projects
            .filter((project: Project) => !project.completed)
            .map((project: Project) => ({
              id: project.id.primaryKey,
              name: project.name,
              folder:
                (topLevelFolders.length > 0
                  ? topLevelFolders.join("/") + "/"
                  : "") + folder.name,
            }));

          const childrenFolderProjects = folder.folders
            .filter((folder: any) => folder.active)
            .map((childFolder: any) =>
              processFolder(childFolder, [...topLevelFolders, folder.name])
            )
            .reduce((a: any, b: any) => [...a, ...b], []);

          return [...folderProjects, ...childrenFolderProjects];
        }

        projects.push(
          ...rootFolders
            .filter((folder: any) => folder.active)
            .map((folder: any) => processFolder(folder, []))
            .reduce((a: any, b: any) => [...a, ...b], [])
        );

        return projects;
      },
      { defaultFilter: () => true }
    )();

    console.log(projects);
    return projects;
  }
}
