// import { faker } from "@faker-js/faker";
// import { createTask } from "@jacobx1/of-sdk";

// import { syncTasks } from "./syncManager";
// import { fetchOmnifocusTaggedTasks, ObsidianTask } from "./dataviewApi";

// jest.mock("./dataviewApi", () => ({
//   fetchOmnifocusTaggedTasks: jest.fn(),
// }));
// const mockedFetchOmnifocusTaggedTasks =
//   fetchOmnifocusTaggedTasks as jest.MockedFunction<
//     typeof fetchOmnifocusTaggedTasks
//   >;

// jest.mock("@jacobx1/of-sdk", () => ({
//   createTask: jest.fn(),
// }));
// const mockedCreateTask = createTask as jest.MockedFunction<typeof createTask>;

// function getFakeObsidianTask(): ObsidianTask {
//   return {
//     completed: false,
//     line: 0,
//     path: `${faker.name}.md`,
//     tags: [],
//     text: faker.lorem.lines(1),
//   };
// }

// describe("syncManager", () => {
//   beforeEach(() => {
//     jest.resetAllMocks();
//   });

//   describe("syncTasks", () => {
//     it("should sync a single task", async () => {
//       const fakeTask = getFakeObsidianTask();
//       mockedFetchOmnifocusTaggedTasks.mockImplementation(() => [fakeTask]);

//       await syncTasks("Test");

//       expect(mockedCreateTask).toHaveBeenCalledTimes(1);
//       expect(mockedCreateTask).toHaveBeenCalledWith(fakeTask.text, {
//         note: `obsidian://open?vault=Test&file=${encodeURI(fakeTask.path)}`,
//       });
//     });

//     it("should sync two tasks", async () => {
//       const fakeTask = getFakeObsidianTask();
//       const fakeTask2 = getFakeObsidianTask();
//       mockedFetchOmnifocusTaggedTasks.mockImplementation(() => [
//         fakeTask,
//         fakeTask2,
//       ]);

//       await syncTasks("Test");

//       expect(mockedCreateTask).toHaveBeenCalledTimes(2);
//       expect(mockedCreateTask).toHaveBeenCalledWith(fakeTask.text, {
//         note: `obsidian://open?vault=Test&file=${encodeURI(fakeTask.path)}`,
//       });
//       expect(mockedCreateTask).toHaveBeenCalledWith(fakeTask.text, {
//         note: `obsidian://open?vault=Test&file=${encodeURI(fakeTask.path)}`,
//       });
//     });
//   });
// });
