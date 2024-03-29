// Construct a schema, using GraphQL schema language
import {gql} from "apollo-server-express";

import taskQueue, {TASK_PROGRESS_UPDATED, pubSub} from "../queues/task.js";

export const typeDefs = gql`
  input TaskInput {
    contentSelector: String
    contentReplacers: [String]
    dateSelector: String
    dateParser: String
    dateLocale: String
    username: String
    password: String
    description: String
    isAddCategories: Boolean
    isStrongSearch: Boolean
    name: String
    onlyHtml: Boolean
    order: String
    sitemap: String
    sortBy: String
    status: String
    headerSelector: String
    timeout: Int
    endpoint: String
    urls: [String]
  }
  type Task {
    id: ID,
    contentSelector: String
    contentReplacers: [String]
    dateSelector: String
    dateParser: String
    dateLocale: String
    username: String
    password: String
    description: String
    isAddCategories: Boolean
    isStrongSearch: Boolean
    name: String
    onlyHtml: Boolean
    order: String
    sitemap: String
    sortBy: String
    status: String
    headerSelector: String
    timeout: Int
    endpoint: String
    urls: [String]
    progress: Int
  }
  type Query {
    hello: String
    tasks: [Task]
    task(id: ID): Task 
  }
  type Mutation {
    createTask(data: TaskInput): String
    deleteTask(id: String): String
    updateTask(id: ID, task: TaskInput): Task
  }
  type Subscription {
    taskProgressUpdated: Task
  }
`;
export const resolvers = {
    Query: {
        // tasks: async () => {
        //     return await Task.find({});
        // },
        // task: async (parent, args) => {
        //     return await Task.findById(args.id);
        // },
        tasks: async () => {
            const tasks = await taskQueue.getJobs(['active', 'waiting', 'completed', 'failed']);
           // console.log({tasks})
            return tasks.map(({id, data, _progress, status}) => ({id, ...data, progress: _progress, status}))

            // return await Promise.all(
            //     tasks.map(({id}) => taskQueue.getJob(id).then((({id, data, _progress, _status}) => ({id, ...data, progress: _progress, status: _status}))))
            // );

            // const tasks = await taskQueue.getJobs();
            // return tasks.map(({id, data, _progress, status}) => ({id, ...data, progress: _progress, status}))
        },
        task: async (_, args) => {
            const result = await taskQueue.getJob(args.id)
            return {id: result.id, ...result.data}
        }
    },
    Mutation: {
        // createTask: async (_, args) => {
        //     const { task } = args;
        //     const newTask = new Task(task);
        //     await newTask.save();
        //     return newTask;
        // },
        // updateTask: async (_, args) => {
        //     const { id } = args;
        //     const updatedTask = await Task.findByIdAndUpdate(id, args);
        //     if (!updatedTask) {
        //         throw new Error(`Task with ID ${id} not found`);
        //     }
        //     return updatedTask;
        // },
        // deleteTask: async (_, args) => {
        //     const { id } = args;
        //     const deletedTask = await Task.findByIdAndDelete(id);
        //     if (!deletedTask) {
        //         throw new Error(`Task with ID ${id} not found`);
        //     }
        //     return deletedTask;
        // },
        createTask: async (_, {data}) => {
            console.log({data})
            const {id} = await taskQueue.add(data);
            return id;
        },
        deleteTask: async (_, args) => {
            const { id } = args;
            const job = await taskQueue.getJob(id);

            if (!job) {
                throw new Error(`Task with ID ${id} not found`);
            }

            await job.remove()

            return id;
        }
    },
    Subscription: {
        taskProgressUpdated: {
            subscribe: () => pubSub.asyncIterator([TASK_PROGRESS_UPDATED]),
        },
    },
};