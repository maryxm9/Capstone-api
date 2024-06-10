const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const busdrinkdata = require('./DrinksData.json');

const app = express();

app.use(cors());
app.use(express.json());

const apiKey = process.env.YOUR_API_KEY;

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
  res.json({ id: drink.id, rating: drink.rating });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
