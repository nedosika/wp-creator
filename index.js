import express from 'express';
import path from "path";
import { ApolloServer, gql } from "apollo-server-express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
//import { MongoClient, ServerApiVersion }from 'mongodb';
import mongoose from "mongoose";

import CONFIG from "./config.js";
import {resolvers, typeDefs} from "./shema/index.js";

const app = express();
const port = CONFIG.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(CONFIG.DATABASE_URL, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });
//
// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);

// Database connection
mongoose
    .connect(CONFIG.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(`Db Connected`);
    })
    .catch(err => {
        console.log(err.message);
    });

// app.use(cors({
//     credentials: true,
//     origin: CONFIG.CLIENT_URL
// }));
// app.use(cookieParser());

app.get('/api/v1/test', (req, res) => {
    res.send('Hello World!!!')
})

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