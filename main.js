import express from 'express';
import { engine } from 'express-handlebars';
import numeral from 'numeral';

const app = express();

app.use(express.urlencoded({
    extended: true
  }));