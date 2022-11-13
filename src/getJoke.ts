const axios = require("axios");

export const getJoke = async () => {
    const res = await axios.get('https://v2.jokeapi.dev/joke/Programming');
    return res.data;
};