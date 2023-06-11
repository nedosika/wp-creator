// Construct a schema, using GraphQL schema language
import {gql} from "apollo-server-express";
import {Task} from "../models/Tasks.js";

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
    url: String
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
    url: String
    urls: [String]
    progress: Int
  }
  type Query {
    hello: String
    tasks: [Task]
    task(id: ID): Task 
  }
  type Mutation {
    createTask(task: TaskInput): Task
    updateTask(id: ID, task: TaskInput): Task
    deleteTask(id: ID): Task
  }
`;


// Provide resolver functions for your schema fields
export const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        tasks: async () => {
            return await Task.find({});
        },
        task: async (parent, args) => await Task.findById(args.id),
    },
    Mutation: {
        createTask: async (parent, args) => {
            console.log({parent, args})
            const { task } = args;
            const newTask = new Task(task);
            await newTask.save();
            return newTask;
        },
        updateTask: async (parent, args) => {
            const { id } = args;
            const updatedTask = await Task.findByIdAndUpdate(id, args);
            if (!updatedTask) {
                throw new Error(`Task with ID ${id} not found`);
            }
            return updatedTask;
        },
        deleteTask: async (parent, args) => {
            const { id } = args;
            const deletedTask = await Task.findByIdAndDelete(id);
            if (!deletedTask) {
                throw new Error(`Task with ID ${id} not found`);
            }
            return deletedTask;
        },
    },
};