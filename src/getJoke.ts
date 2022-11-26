import { readSettings } from "./readSettings";

const axios = require("axios");

export const getJoke = async () => {
    const { language, blacklistedFlags } = readSettings();
    const link = `https://v2.jokeapi.dev/joke/Programming?type=twopart&lang=${language}&blacklistFlags=${blacklistedFlags && blacklistedFlags}`;
    const res = await axios.get(link);
    return res.data;
};