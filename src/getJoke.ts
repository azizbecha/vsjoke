import { readSettings } from "./readSettings";

const axios = require("axios");

export const getJoke = async () => {
    const { language, blacklistedFlags } = readSettings();
    const res = await axios.get(`https://v2.jokeapi.dev/joke/Programming?type=twopart&lang=${language}${blacklistedFlags.length > 0 && `&blacklistFlags=${blacklistedFlags}`}`);
    console.log(`https://v2.jokeapi.dev/joke/Programming?type=twopart&lang=${language}${blacklistedFlags.length > 0 && `&blacklistFlags=${blacklistedFlags}`}`);
    return res.data;
};