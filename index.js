const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const busdrinkdata = require('./DrinksData.json');
const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.YOUR_API_KEY;

app.get('/', (req, res) => {
  res.send('Welcome to backend!');
});

app.get('/api/businesses', async (req, res) => {
  try {
    const endpoint = 'https://api.yelp.com/v3/businesses/search';
    const params = {
      term: 'bubble tea',
      location: 'Richmond,British Columbia'
    };
    const response = await axios.get(endpoint, {
      params,
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Yelp API:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
app.get('/api/businesses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const endpoint = `https://api.yelp.com/v3/businesses/${id}`;
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
// Route to get the rating of a specific drink
app.get('/api/businesses/:businessId/drinks/:drinkId/rating', (req, res) => {
  const { businessId, drinkId } = req.params;
  const business = busdrinkdata.restaurants.find(restaurant => restaurant.id === businessId);
  if (!business) {
    return res.status(404).json({ error: 'Business not found' });
  }
  const drink = business.drinks.find(drink => drink.id === drinkId);
  if (!drink) {
    return res.status(404).json({ error: 'Drink not found' });
  }
  res.json({ rating: drink.rating });
});

// Route to update the rating of a specific drink
app.post('/api/businesses/:businessId/drinks/:drinkId/rating', (req, res) => {
  const { businessId, drinkId } = req.params;
  const { rating } = req.body;

  const businessIndex = busdrinkdata.restaurants.findIndex(restaurant => restaurant.id === businessId);
  if (businessIndex === -1) {
    return res.status(404).json({ error: 'Business not found' });
  }

  const drinkIndex = busdrinkdata.restaurants[businessIndex].drinks.findIndex(drink => drink.id === drinkId);
  if (drinkIndex === -1) {
    return res.status(404).json({ error: 'Drink not found' });
  }

  //update the rating
  busdrinkdata.restaurants[businessIndex].drinks[drinkIndex].rating = rating;

  //calculate the average rating
  const totalRatings = busdrinkdata.restaurants[businessIndex].drinks.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = totalRatings / busdrinkdata.restaurants[businessIndex].drinks.length;

  //update to the new average rating 
  busdrinkdata.restaurants[businessIndex].rating = averageRating;

  res.json({ message: 'Rating updated successfully', newRating: rating, averageRating });
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

