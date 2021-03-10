const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const DB = process.env.DATABASE_LOCAL;
// console.log(process.env);
mongoose
  .connect(DB, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((con) => {
    console.log(con.connections);
    console.log('connected to the db successfully');
  })
  .catch((err) => {
    console.log(err);
  });
// console.log(process.env);

const port = 3000;
app.listen(port, () => {
  console.log(`listening... PORT : ${port}`);
});
