const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());

const apiKey = process.env.YOUR_API_KEY;
const clientId = process.env.YOUR_CLIENT_ID;

app.get('/api/businesses', async (req, res) => {
  try {
    const endpoint = 'https://api.yelp.com/v3/businesses/search';
    const params = {
      term: 'bubble tea',
      location: 'Vancouver, Richmond'
    };

    const response = await axios.get(endpoint, {
      params,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Client-ID': clientId
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Yelp API:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
