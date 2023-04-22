import mongoose from "mongoose";

export const Task = mongoose.model("Tasks", {
    name: String,
    status: String,
    sitemap: String,
    description: String,
    result: String,
})