import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/CheckUp/v1/';

export const playerSearch = async (name) => {
    return await axios.get(`${BASE_API_URL}players/search`, {
        params: { name }  // adds ?name=xxx to the URL
    });
}

export const seasonPlayerStats = async (playerId) => {
    return await axios.get(`${BASE_API_URL}players/stats/${playerId}`);
}

export const recentPlayerStats = async (playerId) => {
    return await axios.get(`${BASE_API_URL}players/stats/recent/${playerId}`);
}

export const allSeasonPlayerStats = async () => {
    return await axios.get(`${BASE_API_URL}players/stats`, {
        params: { page: 0, size: 10000 } // fetch all in one request
    });
}