const express = require('express');
const fs = require('fs');
const app = express();
// app.get('/',(req, res) => {
//     res.status(200).json({message: 'hello from the serverside!'})

// })

// app.post('/', (req,res) => {
//     res.send('you can post to this endpoint')
// })
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('listening...');
});
