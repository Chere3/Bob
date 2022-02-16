import { Client } from 'discord.js';
export function timeEventCore(client: Client) {

    client.emit("_10seconds", Date.now());
    client.emit("_10minutes", Date.now());
    client.emit("_30seconds", Date.now());


    setInterval(() => {
        client.emit("_10seconds", Date.now());
    }, 10000);

    setInterval(() => {
        client.emit("_10minutes", Date.now());
    }, 600000);

    setInterval(() => {
        client.emit("_30seconds", Date.now());
    }, 30000);
    
}