import {Client, Partials} from "discord.js";
import mongoose from "mongoose";
import {EnvSecrets} from "./EnvSecrets";
import {CommonComponents, StrapListeners} from "./Listeners/_Listeners";
import {AIPool} from "./Types/AIPool";
import {DbSeeder} from "./Database/Seeding/Seeder";

console.log("Bot is starting...");

const client = new Client({
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    intents: ['DirectMessages', 'MessageContent', 'DirectMessageReactions', 'GuildMessages', 'GuildMessageReactions', 'Guilds', 'GuildMessageTyping', 'DirectMessageTyping']
});

mongoose.connect(EnvSecrets.getSecretOrThrow<string>('DB_CONNECTION_STRING'), {
    dbName: EnvSecrets.getSecretOrThrow<string>('DB_NAME'),
}).then(async () => {
    console.log(`Connected to Database Server`);
    await DbSeeder.SeedDb();
}).catch((err) => console.error(err));

client.login(EnvSecrets.getSecretOrThrow<string>('TOKEN'));

const ais: AIPool = new Map();
const cc: CommonComponents = {ais, client, db: mongoose.connection};

// Trap client with listeners 
StrapListeners(cc);
