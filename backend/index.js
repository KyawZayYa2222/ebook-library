const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express()
const routes = require('./routes')
const port = process.env.PORT || 3000

app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('<img src="https://lh3.googleusercontent.com/d/1uI_l23LFKz5PmKsuMeo31gIaXhphNWP3" alt="image" />')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})