const express = require(`express`);
const app = express();
const path = require('path');
const cors = require(`cors`);
const morgan = require('morgan');
const { json } = require(`body-parser`);
const { mongo } = require('./server/database/connect');

/** ************MIDDLEWARES*********/
app.use(json());
app.use(cors());
app.use(morgan('dev'));
mongo();
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api/auth', require('./server/routes/api/authRoutes'));
app.use('/api/todo', require('./server/routes/api/todoRoute'));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
app.listen(3001, () =>
  console.log(
    '------------------------NODE server started on PORT 3001------------------------'
  )
);
