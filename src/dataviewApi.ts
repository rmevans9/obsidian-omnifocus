import { getAPI } from "obsidian-dataview";

export interface ObisidianPage {
  file: {
    tasks: { values: ObsidianTask[] };
  };
}

export interface ObsidianTask {
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

export function fetchOmnifocusTaggedTasks() {
  const dataViewApi = getAPI();

  if (!dataViewApi) {
    throw new Error("Dataview is not available. Check that you have installed the Dataview plugin: https://github.com/blacksmithgu/obsidian-dataview");
  }

  // TODO: Consider having the pages this a setting!
  const pages = dataViewApi.pages("#omnifocus").values as ObisidianPage[];

  const tasks = pages.reduce<ObsidianTask[]>((currTasks, page) => {
    const pageTasks = page.file.tasks.values.reduce<ObsidianTask[]>(
      (currPageTasks, task) => {
        if (!task.completed && task.tags.indexOf("#omnifocus") > -1) {
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
