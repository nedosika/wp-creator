// Construct a schema, using GraphQL schema language
import {gql} from "apollo-server-express";
import {Task} from "../models/Tasks.js";
import Queue from 'bull'

const taskQueue = new Queue('myJobQueue');

// taskQueue.process(function (job, done) {
//     // transcode image asynchronously and report progress
//     // job.progress(42);
//     //
//     // // call done when finished
//     // done();
//     //
//     // // or give an error if error
//     // done(new Error('error transcoding'));
//
//     // or pass it a result
//     console.log("job", job.data)
//     done(null, { width: 1280, height: 720 /* etc... */ });
//     //
//     // // If the job throws an unhandled exception it is also handled correctly
//     // throw new Error('some unexpected error');
// });

export const typeDefs = gql`
  input TaskInput {
    arraysIndex: Int
    auth: String
    description: String
    isAddCategories: Boolean
    isStrongSearch: Boolean
    name: String
    onlyHtml: Boolean
    order: String
    sitemap: String
    sortBy: String
    status: String
    tagTitle: String
    timeout: Int
    wordpressApiUrl: String
    urls: [String]
  }
  type Task {
    id: ID,
    arraysIndex: Int
    auth: String
    description: String
    isAddCategories: Boolean
    isStrongSearch: Boolean
    name: String
    onlyHtml: Boolean
    order: String
    sitemap: String
    sortBy: String
    status: String
    tagTitle: String
    timeout: Int
    wordpressApiUrl: String
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
    removeTask(id: String): String
    updateTask(id: ID, task: TaskInput): Task
    deleteTask(id: ID): Task
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
            const result = await taskQueue.getJobs([]);
            console.log(result)
            return result.map((task) => ({id: task.id, ...task.data}))
        },
        task: async (_, args) => {
            console.log(args)
            const result = await taskQueue.getJob(args.id)
            console.log({id: result.id, ...result.data})
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
            const {id} = await taskQueue.add(data);
            return id;
        },
        removeTask: async (_, args) => {
            const { id } = args;
            const job = await taskQueue.getJob(id);

            if (!job) {
                throw new Error(`Task with ID ${id} not found`);
            }

            await job.remove()

            return id;
        }
    },
};