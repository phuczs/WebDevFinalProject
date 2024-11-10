import express from 'express';
import { engine } from 'express-handlebars';
import numeral from 'numeral';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(express.urlencoded({
    extended: true
  }));

  app.engine('hbs', engine({
    extname: 'hbs',
    helpers: {
        format_number(value) {
          return numeral(value).format('0,0') + ' vnd';
        }
      }
  })),
app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', function (req, res) {
    res.render('home', {
        // layout: false,
        // layout: 'anotherLayout',
      });
    });

const __dirname = dirname(fileURLToPath(import.meta.url));
app.get('/test', function (req, res) {
  res.sendFile(__dirname + '/test.html');
});


app.listen(3000, function () {
    console.log('Server started on http://localhost:3000');
  });
  
