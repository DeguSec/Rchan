import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "./_Commands";
import { CommonComponents } from "../CommonComponents";
import { GetAI } from "../Functions/GetAI";
import { CheckAllowedSource } from "../Functions/CheckAllowedSource";

export class RemoveMemory implements Command {
    data: SlashCommandBuilder;

    name = "remove-memory";
    private description = "Flushes the memory of the bot. It makes it forget everything that's been said";

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }
    
    public async commandRun(interaction: CommandInteraction, cc: CommonComponents) {
        const ai = GetAI(cc, interaction.channel);
        const allowed = CheckAllowedSource(cc, interaction.channel?.id, interaction.guild?.id);
        
        let content: string;

        if(ai && allowed) {
            ai.reset();
            content = ":computer: Reset successful.";
        } else {
            content = ":computer::warning: An AI isn't assigned to you."
        }

        await interaction.deferReply();

        await interaction.followUp({
            content
        });
    }
}