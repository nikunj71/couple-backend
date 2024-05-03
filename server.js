import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import appService from "./services/app.js"
import routes from "./routes/index.js"


dotenv.config();

import './config/connect-db.js';

const app = express();
const __dirname = path.resolve();

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json({ limit: '50mb' }));
app.use('/upload', express.static(path.join(__dirname, 'uploads')));

app.disable('x-powered-by');

app.use(appService);
app.use('/', routes);

const port = process.env.PORT || 3000;
let serverInstance = app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});