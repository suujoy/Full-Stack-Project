import express from "express";
import downloadRouter from "./routes/download.route.js";

const app = express();

app.use(express.json());



app.use('/api/download',downloadRouter)




export default app;
