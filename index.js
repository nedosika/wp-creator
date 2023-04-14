import express from 'express';
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';

import CONFIG from "./config.js";

const app = express();
const port = CONFIG.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    credentials: true,
    origin: CONFIG.CLIENT_URL
}));
app.use(cookieParser());

// app.get('/', (req, res) => {
//     res.send('Hello World!!!')
// })

if (CONFIG.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));
}

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

console.log(CONFIG)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})