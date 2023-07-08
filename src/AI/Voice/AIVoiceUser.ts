import { GuildMember } from "discord.js";
import { GapTime, curlFffmpegPipe, opusEncoder } from "./VoiceProcessing";
import { Readable } from "node:stream";
import { convertUserForBot } from "../../Functions/UserFunctions";

type AIVoiceUserListener = (time: number, id: string, text: string) => void;

/**
 * Per user operations
 */
export class AIVoiceUser {
    // converted opus data (PMC)
    awaitingData: Array<Buffer> = [];

    // user
    guildMember: GuildMember;

    // timer which 
    dispatchTimer?: NodeJS.Timer;

    // the time when the user started to talk
    firstMessageTime?: number;

    convertedMessagesListener: AIVoiceUserListener;

    constructor(guildMember: GuildMember, listener: AIVoiceUserListener) {
        this.guildMember = guildMember;
        this.convertedMessagesListener = listener;

        // console.log(guildMember);
    }  

    /**
     * Adds data to the internal voice buffer
     * @param data 
     */
    addData(data: Buffer) {
        const decodedOpus = opusEncoder.decode(data);
        //const decodedOpus = data;
        this.awaitingData.push(decodedOpus);

        //console.log("added data for:", this.user.id);
        if(this.dispatchTimer)
            clearTimeout(this.dispatchTimer);

        if(!this.firstMessageTime)
            this.firstMessageTime = Date.now();

        this.dispatchTimer = setTimeout(() => this.convert(), GapTime);
    }

    async convert() {
        if(!this.firstMessageTime) {
            console.log("Cannot convert on empty first message time");
            return;
        }

        // if(this.awaitingData.length < 100) {
        //     console.log("Data is too short for now.");
        //     return;
        // }

        // retrieve and clear data
        const data = this.awaitingData;
        this.awaitingData = [];

        console.log("Dispatching convert.", data.length);

        // set the proper timers
        this.dispatchTimer = undefined;

        // reset the first message time
        const messageTime = this.firstMessageTime;
        this.firstMessageTime = undefined;

        // get the text
        const text = await curlFffmpegPipe(Readable.from(data));

        console.log(`${this.guildMember.user.username} : ${text}`);

        this.convertedMessagesListener(messageTime, convertUserForBot(this.guildMember.user), text);
    }
}