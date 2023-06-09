import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "./_Commands";
import { CommonComponents } from "../CommonComponents";
import { GetAI } from "../Functions/GetAI";

export class ChannelEnable implements Command {
    name = "enable";
    private description = "Allow the AI to interact to process and interact with this channel.";
    public data: SlashCommandBuilder;

    constructor() {
        this.data = new SlashCommandBuilder();
        this.data.setName(this.name);
        this.data.setDescription(this.description);
    }

    async commandRun(interaction: CommandInteraction, cc: CommonComponents) {
        if(!interaction.channel)
            return;

        
        const ai = GetAI(cc, interaction.channel);

        if(ai) {
            interaction.reply(":computer::warning: AI is already enabled in this channel");
            return;
        }

        await cc.ais.enable(interaction.channel?.id);
        interaction.reply(":computer: AI has been enabled");
    }
}