const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const port = 3000;
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

// TOUR SCHEMA
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a tour must have a name'],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, required: [true, 'a tour must have a price'] },
});

// MODEL
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'the park camper',
  price: 399,
});
//save the document to the db
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(err);
  });

//START THE SERVER AT PORT port
app.listen(port, () => {
  console.log(`listening... PORT : ${port}`);
});
