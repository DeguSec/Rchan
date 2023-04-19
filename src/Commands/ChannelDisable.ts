import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "./_Commands";
import { ChannelModel } from "../Database/Models/Channel.model";
import { CommonComponents } from "../CommonComponents";
import { GetAI } from "../Functions/GetAI";

export class ChannelDisable implements Command {
    name: string = "disable";
    private description = "Disallow the AI to interact to process and interact with this channel.";
    public data: SlashCommandBuilder;

    constructor() {
        this.data = new SlashCommandBuilder();
        this.data.setName(this.name);
        this.data.setDescription(this.description);
    }

    async commandRun(interaction: CommandInteraction, cc: CommonComponents) {
        if (!interaction.channel)
            return;

        const ai = GetAI(cc, interaction.channel);

        if (!ai) {
            interaction.reply("AI is already disabled in this channel");
            return;
        }

        await cc.ais.disable(interaction.channel.id);
        await interaction.reply("AI has been disabled");
    }
}