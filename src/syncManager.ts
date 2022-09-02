import { createTask } from "@jacobx1/of-sdk";
import { fetchOmnifocusTaggedTasks, ObsidianTask } from "./dataviewApi";
import { updateNote } from "./obsidianApi";
import { ObsidianOmnifocusSettings } from "./settings";

async function createTaskAndUpdate(
  vaultName: string,
  task: ObsidianTask,
  pluginSettings: ObsidianOmnifocusSettings
) {
  await createTask(task.text, {
    note: `obsidian://open?vault=${encodeURI(vaultName)}&file=${encodeURI(
      task.path
    )}`,
  });

  await updateNote(
    task.path,
    task.position.start.offset,
    task.position.end.offset,
    "#omnifocus ", // TODO: Pull in via setting?
    "#omnifocus-synced ",
    pluginSettings.markCompletedOnSync
  );
}

export async function syncTasks(
  vaultName: string,
  pluginSettings: ObsidianOmnifocusSettings
) {
  // TODO: Consider if we should allow per page syncing of just do the entire vault?
  console.log("[obsidian-omnifocus] Fetching Tagged Tasks...");
  const tasks = fetchOmnifocusTaggedTasks();
  console.log("[obsidian-omnifocus] Fetched Tagged Tasks.", tasks);

  console.log("[obsidian-omnifocus] Iterating over tasks to send to Omni...");
  const creationTasks: Promise<void>[] = [];
  tasks.forEach((task) => {
    creationTasks.push(createTaskAndUpdate(vaultName, task, pluginSettings));
  });
  console.log("[obsidian-omnifocus] Finished iterating over tasks.");

  await Promise.all(creationTasks);
}
