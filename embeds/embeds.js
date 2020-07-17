const Discord = require('discord.js');

/**
 * @param {*} description Welcome Message
 * @returns Embed with the welcome message string
 */
function _embedSupremeMember(description) {
const embedSupremeMemberWelcome = new Discord.MessageEmbed()
    .setColor('#000000')
	.setTitle('Welcome to the Dota 2 Supreme Membership')
	.setURL('https://offers.gamerzclass.com/dota-2-membership/')
	.setDescription(description)
	.setThumbnail('https://i.ibb.co/X8s1QXq/gamerzclass.png')
	.addFields(
		{ name: 'Contact Support', value: 'support@gamerzclass.com', inline: true },
        { name: 'Cancel Subscription', value: 'rasmus@gamerzclass.com', inline: true }
	)
    .setTimestamp()
    .setFooter('This is an automated Message.');
    return embedSupremeMemberWelcome
}

function _embedNewGuildMember(description) {
    const embedNewGuildMemberWelcome = new Discord.MessageEmbed()
        .setColor('#000000')
        .setTitle('Offical GamerzClass Discord')
        .setURL('https://gamerzclass.com/')
        .setDescription(description)
        .setThumbnail('https://i.ibb.co/X8s1QXq/gamerzclass.png')
        .addFields(
            { name: 'Contact Support', value: 'support@gamerzclass.com', inline: true },
            { name: 'Business Inquiry', value: 'info@gamerzclass.com', inline: true },
        )
        .setTimestamp()
        .setFooter('This is an automated Message.');
        return embedNewGuildMemberWelcome 
}

module.exports = {
     _embedSupremeMember,
    _embedNewGuildMember
}