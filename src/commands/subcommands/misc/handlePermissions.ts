import { GuildMember, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { validateChannelPerms } from "../../../modules/commands/server/validateChannelPerms";
import { validateServerPerms } from "../../../modules/commands/server/validateServerPerms";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Validates that Heptagram has the correct permissions in the server and the
 * specific channel.
 */
export const handlePermissions: CommandHandler = async (
  Heptagram,
  interaction
) => {
  try {
    const { channel, guild, member } = interaction;

    if (!guild || !member || !channel) {
      await interaction.editReply({
        content:
          "I'm sorry, but I don't know what channel or server you're in. " +
          "Are you sure you're in a server?",
      });
      return;
    }

    if (
      !(member as GuildMember).permissions.has(
        PermissionFlagsBits.ManageGuild
      ) &&
      (member as GuildMember).id !== Heptagram.configs.ownerId
    ) {
      await interaction.editReply({
        content: "You don't have permissions here!",
      });
      return;
    }

    const HeptagramBot =
      guild.members.cache.get(Heptagram.user?.id || "whoops") ||
      (await guild.members.fetch(Heptagram.user?.id || "whoops"));

    if (!HeptagramBot) {
      await interaction.editReply({
        content:
          "I am missing permissions in this server. Please contact the server owner.",
      });
      return;
    }

    const hasChannelPerms = await validateChannelPerms(
      Heptagram,
      HeptagramBot,
      channel
    );
    const hasGuildPerms = await validateServerPerms(
      Heptagram,
      HeptagramBot,
      channel
    );

    const areValid = hasChannelPerms && hasGuildPerms;

    const descriptionString = areValid
      ? "I have the correct permissions in this server and channel."
      : "I do not have the correct permissions in this server and channel.";

    const validEmbed = new EmbedBuilder();
    validEmbed.setTitle(
      areValid ? "Permssions are valid." : "Permissions are invalid."
    );
    validEmbed.setDescription(descriptionString);
    validEmbed.setColor(
      areValid ? Heptagram.colors.success : Heptagram.colors.error
    );
    validEmbed.setFooter({
      text: `Message sent by Heptagram || ${Heptagram.version}`,
      iconURL: `${Heptagram.user?.avatarURL()}`,
    });

    await interaction.editReply({ embeds: [validEmbed] });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "permissions command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Heptagram, "permissions", errorId)],
    });
  }
};
