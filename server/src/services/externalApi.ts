import axios from 'axios';

const BASE_URL = process.env.SOURCE_API_BASE_URL;

interface FetchTournamentsParams {
  city: string;
  store?: string;
  format?: number;
  date: string;
}

async function fetchTournaments(params: FetchTournamentsParams) {
  // TODO: implement
}

async function fetchStoresBySeason(seasonId: string | number) {
  // TODO: implement
}

export { fetchTournaments, fetchStoresBySeason };
