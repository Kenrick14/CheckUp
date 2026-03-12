import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/CheckUp/v1/';

export const playerSearch = async (name) => {
    return await axios.get(`${BASE_API_URL}players/search`, {
        params: { name }  // adds ?name=xxx to the URL
    });
}