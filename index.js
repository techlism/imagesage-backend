const express = require('express');
const cors = require('cors');
const pkg = require('express-jwt');
const jwt = pkg.expressjwt;
const jwks = require('jwks-rsa');
const axios = require('axios');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./usermodel.js');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const verifyJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache:true,
    rateLimit:true,
    jwksRequestsPerMinute: 15,
    jwksUri:process.env.JWKS_URI
  }),
  audience:process.env.AUDIENCE,
  algorithms:['RS256']
});

mongoose.connect(process.env.DB_CONNECTION,{
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(()=>{
  console.log('Connected to DB');
}).catch(err=>{
  console.log(`Error in Connecting to DB : ${err.message}`);
});

// POST endpoint to handle adding a favorite image for a user
app.post('/favorites',verifyJwt, async (req, res) => {
  try {
    const { email, imageId } = req.body;

    // Check if the user exists by their email
    let user = await User.findOne({ email });

    if (!user) {
      // If the user does not exist, create a new user with the provided email
      user = new User({ email });
    }

    // Check if the imageId is already in the favorites array
    if (!user.favorites.includes(imageId)) {
      // If not, push the imageId to the favorites array
      user.favorites.push(imageId);

      // Save the user to the database
      await user.save();
    }

    res.status(200).json({ message: 'Favorite image added successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/downloads',verifyJwt, async (req, res) => {
  try {
    const { email, imageId } = req.body;

    // Check if the user exists by their email
    let user = await User.findOne({ email });

    if (!user) {
      // If the user does not exist, create a new user with the provided email
      user = new User({ email });
    }

    // Check if the imageId is already in the downloads array
    if (!user.downloads.includes(imageId)) {
      // If not, push the imageId to the downloads array
      user.downloads.push(imageId);

      // Save the user to the database
      await user.save();
    }

    res.status(200).json({ message: 'Downloaded image added successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/checkfav',verifyJwt,async(req,res)=>{
  try {
    const { email, imageId } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    const isInFavorites = user.favorites.includes(imageId);
    if(isInFavorites) res.status(200).send(isInFavorites);
  } 
  catch (error) {
    console.error('Error checking favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', async (req,res)=>{
  try {
    const { query, page } = req.query;
    const apiKey = process.env.PIXABAY_KEY;

    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&page=${page}`;
    const response = await axios.get(apiUrl);

    res.json(response.data).status(200);
  } catch (error) {
    console.error('Error fetching data from Pixabay:', error);
    res.status(500).json({ error: 'Server error' });
  }
})

app.get('/favorites', verifyJwt, async (req,res)=>{
  const userEmail = req.headers.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return the user's favorites
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/downloads', verifyJwt, async (req,res)=>{
  const userEmail = req.headers.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return the user's favorites
    res.json({ downloads: user.downloads }).status(200);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/images/:id', async (req, res) => {
  const { id } = req.params;
  const apiKey = process.env.PIXABAY_KEY;
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=${apiKey}&id=${id}`);
    const { hits } = response.data;
    if (hits.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    const imageDetails = hits[0];
    res.json(imageDetails).status(200);
  } catch (error) {
    console.error('Error fetching image details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})
