import { PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { updateHistory } from "../../../modules/commands/moderation/updateHistory";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Issues a warning to the `target` user, and adds it to the server's warning count.
 * Logs the `reason`.
 *
 * @param {Heptagram} Heptagram Heptagram's discord instance.
 * @param {Interaction} interaction The interaction object.
 */
export const handleWarn: CommandHandler = async (Heptagram, interaction) => {
  try {
    const { guild, member } = interaction;
    if (!guild) {
      await interaction.editReply({
        content: "Missing Guild!!",
      });
      return;
    }

    const target = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason", true);

    const targetMember = await guild.members.fetch(target.id).catch(() => null);

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
      !targetMember ||
      targetMember.permissions.has(PermissionFlagsBits.ModerateMembers)
    ) {
      await interaction.editReply({
        content: "You don't have permission to kick that user!",
      });
      return;
    }

    if (!targetMember) {
      await interaction.editReply({
        content: "That user appears to have left the guild.",
      });
      return;
    }

    if (target.id === member.user.id) {
      await interaction.editReply({
        content: "You can't warn yourself!",
      });
      return;
    }

    if (target.id === Heptagram.user?.id) {
      await interaction.editReply({
        content: "You can't warn me!",
      });
      return;
    }

    await updateHistory(Heptagram, "warn", target.id, guild.id);

    await interaction.editReply({
      content: "Warned " + target.tag + " for " + reason,
    });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "warn command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Heptagram, "warn", errorId)],
    });
  }
};
