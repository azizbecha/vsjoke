import { readSettings } from "./readSettings";

const axios = require("axios");

export const getJoke = async () => {
    const { language } = readSettings();
    const res = await axios.get(`https://v2.jokeapi.dev/joke/Programming?type=twopart&lang=${language}`);
    return res.data;
};