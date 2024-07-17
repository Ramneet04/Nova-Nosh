import express from 'express';
import connectDB from './db/index.js';
import app from './app.js';
import path from 'path';

import dotenv from "dotenv";
dotenv.config({
    path:"./.env"
});

const __dirname = path.resolve();

// Connect to MongoDB
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.log("Server failed to start ->", error);
});





//The listen method in Express.js is used to start a server and make it listen for incoming HTTP requests on a specific port.