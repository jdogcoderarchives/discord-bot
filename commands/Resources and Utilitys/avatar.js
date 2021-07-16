const { colors } = require('../../config.json');

module.exports = {
	name: 'avatar',
	description: 'gets user avatar.',
	guildOnly: true,
	category: 'Utilitys',

	async execute({ message, args, Discord }) {
		if (!args[0]) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(`${message.member.user.tag}`, `${message.author.displayAvatarURL()}`)
				.setColor(colors.heptagram)
				.setTitle('**Avatar**')
				.setImage(`${message.author.displayAvatarURL({ size: 4096, dynamic: true })}`)
				.setTimestamp()
				.setFooter("Message sent by the Heptagram Bot", 'https://cdn.heptagram.xyz/Logos/HeptagramLogo%28square%29.png');

			return message.channel.send(embed);
		}
		else {
			const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => { return undefined; });
			if (!member) {return message.reply('User not found.');}
			else {
				const embed = new Discord.MessageEmbed()
					.setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL()}`)
					.setColor(colors.heptagram)
					.setTitle('Requested Avatar:')
					.setImage(`${member.user.displayAvatarURL({ size: 4096, dynamic: true })}`)
					.setTimestamp()
					.setFooter("Message sent by the Heptagram Bot", 'https://cdn.heptagram.xyz/Logos/HeptagramLogo%28square%29.png');

				return message.channel.send(embed);
			}
		}
	},
};
