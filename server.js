const app = require(`express`)();
const cors = require(`cors`);
const morgan = require('morgan');
const { json } = require(`body-parser`);
const { mongo } = require('./server/database/connect');

/** ************MIDDLEWARES*********/
app.use(json());
app.use(cors());
app.use(morgan('dev'));
mongo();

app.use('/api/auth', require('./server/routes/api/authRoutes'));
app.use('/api/todo', require('./server/routes/api/todoRoute'));

app.listen(3001, () =>
  console.log(
    '------------------------NODE server started on PORT 3001------------------------'
  )
);
