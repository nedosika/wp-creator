import express from 'express';
import path from "path";
import { ApolloServer, gql } from "apollo-server-express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';

import CONFIG from "./config.js";

const app = express();
const port = CONFIG.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(cors({
//     credentials: true,
//     origin: CONFIG.CLIENT_URL
// }));
// app.use(cookieParser());

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

await server.start();

server.applyMiddleware({ app });

app.get('/api/v1/test', (req, res) => {
    res.send('Hello World!!!')
})


app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.listen({port}, () => {
    console.log(`Example app listening on port ${port}`)
})