// Construct a schema, using GraphQL schema language
import {gql} from "apollo-server-express";
import {Task} from "../models/Tasks.js";

export const typeDefs = gql`
  type Query {
    hello: String
    tasks: [Task]
    task(id: ID): Task 
  }
  type Task {
    id: ID
    name: String,
    status: String,
    sitemap: String,
    description: String,
    result: String,
  }
  type Mutation {
    create(name: String): Task
    update(id: ID, name: String): Task
    delete(id: ID): Task
  }
`;


// Provide resolver functions for your schema fields
export const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        tasks: async () => await Task.find({}),
        task: async (parent, args) => await Task.findById(args.id),
    },
    Mutation: {
        create: async (parent, args) => {
            const { name } = args;
            const newTask = new Task({
                name,
            });
            await newTask.save();
            return newTask;
        },
        update: async (parent, args) => {
            const { id } = args;
            const updatedTask = await Task.findByIdAndUpdate(id, args);
            if (!updatedTask) {
                throw new Error(`Task with ID ${id} not found`);
            }
            return updatedTask;
        },
        delete: async (parent, args) => {
            const { id } = args;
            const deletedTask = await Task.findByIdAndDelete(id);
            if (!deletedTask) {
                throw new Error(`Task with ID ${id} not found`);
            }
            return deletedTask;
        },
    },
};