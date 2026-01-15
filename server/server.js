import express from "express";
import cors from "cors";

import http from 'http';
import { createHandler } from 'graphql-http/lib/use/http';
import expressPlayground from 'graphql-playground-middleware-express';

import schema from "./schema.js";
//import { spawn } from "child_process";
import { getRehabDataForVisuals, createMockDataForVisuals } from './data/mockData.js';
import  { examples } from "./data/examples.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

// Create the GraphQL over HTTP Node request handler
const handler = createHandler({ schema });

app.use("/graphql", handler)

app.get('/playground', expressPlayground.default({ endpoint: '/graphql' }));

//const values = [121, 9];
//const valuesStr = JSON.stringify(values)
//console.log("userStr", typeof userStr)
/*
const python = spawn('python3', ['./scripts/script.py', 5, valuesStr]);

python.stdout.on("data", data => {
    console.log(`stdout1: ${data}`)
})

python.stdout.on("error", err => {
    console.log(`err1: ${err.message}`)
})

python.stdout.on("close", code => {
    console.log(`close1: ${code}`)
})
*/


app.listen(PORT, () => {
    console.log("server started");
});