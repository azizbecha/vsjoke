import { readSettings } from "./readSettings";

const axios = require("axios");

export const getJoke = async () => {
    const settings = readSettings();
    const language = settings.language;
    const res = await axios.get(`https://v2.jokeapi.dev/joke/Programming?lang=${language}`);
    return res.data;
};