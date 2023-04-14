import { Client, Partials } from "discord.js";
import mongoose from "mongoose";
import { EnvSecrets } from "./EnvSecrets";
import { StrapListeners } from "./Listeners/_Listeners";
import { AIPool } from "./Types/AIPool";
import { DbSeeder } from "./Database/Seeding/Seeder";
import { CommonComponents } from "./CommonComponents";


async function main() {
    console.log("Bot is starting...");

    const client = new Client({
        partials: [Partials.Message, Partials.Channel, Partials.Reaction],
        intents: ['DirectMessages', 'MessageContent', 'DirectMessageReactions', 'GuildMessages', 'GuildMessageReactions', 'Guilds', 'GuildMessageTyping', 'DirectMessageTyping']
    });

    await mongoose.connect(EnvSecrets.getSecretOrThrow<string>('DB_CONNECTION_STRING'), {
        dbName: EnvSecrets.getSecretOrThrow<string>('DB_NAME'),
    }).then(async () => {
        console.log(`Connected to Database Server`);
    }).catch((err) => {
        throw err;
    });

    console.log("Seeding");
    await DbSeeder.SeedDb();

    await client.login(EnvSecrets.getSecretOrThrow<string>('TOKEN'));
    console.log("Connected to Discord");

    const ais: AIPool = new Map();
    const cc: CommonComponents = { ais, client };

    // Strap client with listeners 
    console.log("Strapping listeners");
    StrapListeners(cc);
}

main() //.catch((reason) => {
//     console.log(reason);
// });