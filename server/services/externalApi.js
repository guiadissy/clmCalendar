const axios = require('axios');

const BASE_URL = process.env.SOURCE_API_BASE_URL;

async function fetchTournaments({ city, store, format, date }) {
  // TODO: implement
}

async function fetchStoresBySeason(seasonId) {
  // TODO: implement
}

module.exports = { fetchTournaments, fetchStoresBySeason };
