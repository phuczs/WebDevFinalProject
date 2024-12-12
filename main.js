import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import bodyParser from 'body-parser';
import numeral from 'numeral';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import categoryRouter from './routes/category.route.js';
import accountRouter from './routes/account.route.js';
import articleRouter from './routes/article.route.js';
import articleUserRouter from './routes/article-user.route.js';
import searchRouter from './routes/search.route.js';
import categoryService from './services/category.service.js';
import commentService from './services/comment.service.js';

const app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'SECRET_KEY',
  resave: false,
  saveUninitialized: true,
  cookie: {  }
}));

app.use(express.urlencoded({
    extended: true
}));

import hbs_section from 'express-handlebars-sections';
app.engine('hbs', engine({
  extname: 'hbs',
  helpers: {
      format_number(value) {
        return numeral(value).format('0,0') + ' vnd';
      },
      section: hbs_section(),
    }
})),
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/static', express.static('static'));

app.use(async function (req, res, next) {
  const categories = await categoryService.findAll();
  res.locals.lcCategories = categories;
  next();
});

app.use(async function (req, res, next) {
  const comments = await commentService.findAllComments();
  res.locals.lcComments = comments;
  next();
})

app.use(function (req, res, next) {
  if (req.session.auth===undefined) {
    req.session.auth = false;
  }
  res.locals.auth = req.session.auth;
  res.locals.authUser = req.session.authUser;
  next();
});

app.get('/', function (req, res) {

  console.log(req.session.auth);
    res.render('home');
    });

const __dirname = dirname(fileURLToPath(import.meta.url));
app.get('/test', function (req, res) {
  res.sendFile(__dirname + '/test.html');
});



app.use('/account', accountRouter);
app.use('/articles',articleUserRouter);
app.use('/',searchRouter);

import {isAuth,isAdmin} from './middlewares/auth_mdw.js';
app.use('/admin/categories',isAuth,isAdmin,categoryRouter);
app.use('/admin/articles',isAuth,isAdmin,articleRouter);





app.listen(3000, function () {
    console.log('Server started on http://localhost:3000');
  });
  
