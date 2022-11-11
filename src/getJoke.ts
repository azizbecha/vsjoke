import fetch, { Response } from 'node-fetch';

export const getJoke = async () => {
    const response = await fetch('https://v2.jokeapi.dev/joke/Programming');
    const data = await response.json();
    return data;
};