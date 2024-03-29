import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

import { Heptagram } from "../Heptagram";

/**
 * Model used to pass around Heptagrams's Command structure.
 */
export interface Command {
  data:
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | SlashCommandSubcommandsOnlyBuilder;
  /**
   * Handles the logic for running a given command.
   *
   * @param {Heptagram} Heptagram's Discord instance.
   * @param { ChatInputCommandInteraction} interaction The interaction payload from Discord.
   */
  run: (
    Heptagram: Heptagram,
    interaction: ChatInputCommandInteraction
  ) => Promise<void>;
}
