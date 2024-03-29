import { ChatInputCommandInteraction } from "discord.js";

import { Heptagram } from "../Heptagram";

/**
 * Handles the logic execution for a sub-command.
 *
 * @param {Heptagram} Heptagram's Discord instance.
 * @param {ChatInputCommandInteraction} interaction The interaction payload from Discord.
 */
export type CommandHandler = (
  Heptagram: Heptagram,
  interaction: ChatInputCommandInteraction
) => Promise<void>;
