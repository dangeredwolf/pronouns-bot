import { DiscordAPI } from "../discordAPI";
import { CommandResponse } from "../response";
import { OptionedCommandInteraction } from "../types";


export const DeleteRoleCommand = async (interaction: OptionedCommandInteraction) => {
    const options = interaction.data.options;
    const roleOption = options[0];
    const guildId = interaction.guild_id as string;
    const roleId = roleOption.value as string;
    const role = await DiscordAPI.getRole(guildId, roleId);
    if (role) {
        await DiscordAPI.deleteRole(guildId, roleId);
        return new CommandResponse(`Deleted role ${role.name}`);
    }
    return new CommandResponse(`Role ${roleId} not found`);
}