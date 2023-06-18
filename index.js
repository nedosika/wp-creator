import express from 'express';
import path from "path";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
//import mongoose from "mongoose";

import CONFIG from "./config.js";
import {resolvers, typeDefs} from "./shema/index.js";

const app = express();
const port = CONFIG.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
// mongoose
//     .connect(CONFIG.DATABASE_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => {
//         console.log(`Db Connected`);
//     })
//     .catch(err => {
//         console.log(err.message);
//     });
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.listen({port}, () => {
    console.log(`Example app listening on port ${port}`)
});

const server = new ApolloServer({ typeDefs, resolvers });

await server.start();

server.applyMiddleware({ app });