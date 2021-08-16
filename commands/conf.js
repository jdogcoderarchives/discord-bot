const { codeBlock } = require("@discordjs/builders");

exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

  const defaults = client.settings.get("default");
  const replying = client.settings.ensure(message.guild.id, client.config.defaultSettings).commandReply;

  if (action === "add") {
    if (!key) return message.reply({ content: "Please specify a key to add", allowedMentions: { repliedUser: (replying === "true") } });
    if (defaults[key]) return message.reply({ content: "This key already exists in the default settings", allowedMentions: { repliedUser: (replying === "true") } });
    if (value.length < 1) return message.reply({ content: "Please specify a value", allowedMentions: { repliedUser: (replying === "true") } });

    defaults[key] = value.join(" ");

    // One the settings is modified, we write it back to the collection
    client.settings.set("default", defaults);
    message.reply({ content: `${key} successfully added with the value of ${value.join(" ")}`, allowedMentions: { repliedUser: (replying === "true") } });
  }
  else

  // Changing the default value of a key only modified it for guilds that did not change it to another value.
  if (action === "edit") {
    if (!key) return message.reply({ content: "Please specify a key to edit", allowedMentions: { repliedUser: (replying === "true") } });
    if (!defaults[key]) return message.reply({ content: "This key does not exist in the settings", allowedMentions: { repliedUser: (replying === "true") } });
    if (value.length < 1) return message.reply({ content: "Please specify a new value", allowedMentions: { repliedUser: (replying === "true") } });

    defaults[key] = value.join(" ");

    client.settings.set("default", defaults);
    message.reply({ content: `${key} successfully edited to ${value.join(" ")}`, allowedMentions: { repliedUser: (replying === "true") } });
  }
  else

  // WARNING: DELETING A KEY FROM THE DEFAULTS ALSO REMOVES IT FROM EVERY GUILD
  // MAKE SURE THAT KEY IS REALLY NO LONGER NEEDED!
  if (action === "del") {
    if (!key) return message.reply({ content: "Please specify a key to delete.", allowedMentions: { repliedUser: (replying === "true") } });
    if (!defaults[key]) return message.reply({ content: "This key does not exist in the settings", allowedMentions: { repliedUser: (replying === "true") } });

    // Throw the 'are you sure?' text at them.
    const response = await client.awaitReply(message, `Are you sure you want to permanently delete ${key} from all guilds? This **CANNOT** be undone.`);

    // If they respond with y or yes, continue.
    if (["y", "yes"].includes(response)) {

      // We delete the default `key` here.
      delete defaults[key];
      client.settings.set("default", defaults);

      // then we loop on all the guilds and remove this key if it exists.
      // "if it exists" is done with the filter (if the key is present and it's not the default config!)
      for (const [guildId, conf] of client.settings.filter((setting, id) => setting[key] && id !== "default")) {
        delete conf[key];
        client.settings.set(guildId, conf);
      }

      message.reply({ content: `${key} was successfully deleted.`, allowedMentions: { repliedUser: (replying === "true") } });
    }
    else
    // If they respond with n or no, we inform them that the action has been cancelled.
    if (["n", "no", "cancel"].includes(response)) {
      message.reply({ content: "Action cancelled.", allowedMentions: { repliedUser: (replying === "true") } });
    }
  }
  else

  // Display a key's default value
  if (action === "get") {
    if (!key) return message.reply({ content: "Please specify a key to view", allowedMentions: { repliedUser: (replying === "true") } });
    if (!defaults[key]) return message.reply({ content: "This key does not exist in the settings", allowedMentions: { repliedUser: (replying === "true") } });
    message.reply({ content: `The value of ${key} is currently ${defaults[key]}`, allowedMentions: { repliedUser: (replying === "true") } });

  // Display all default settings.
  }
  else {
    const array = [];
    Object.entries(client.settings.get("default")).forEach(([key, value]) => {
      array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`);
    });
    await message.channel.send(codeBlock("asciidoc", `= Bot Default Settings =
${array.join("\n")}`));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["defaults"],
  permLevel: "Bot Admin",
};

exports.help = {
  name: "conf",
  category: "System",
  description: "Modify the default configuration for all guilds.",
  usage: "conf <view/get/edit> <key> <value>",
};