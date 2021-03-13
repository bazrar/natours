const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;
const DB = process.env.DATABASE;
// console.log(process.env);
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('connected to the db successfully');
  })
  .catch((err) => {
    console.log(err);
  });
// console.log(process.env);

// TOUR SCHEMA

// const testTour = new Tour({
//   name: 'the park camper',
//   price: 399,
// });
// //save the document to the db
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//START THE SERVER AT PORT port
app.listen(port, () => {
  console.log(`listening... PORT : ${port}`);
});
