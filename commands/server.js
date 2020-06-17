module.exports = {
  name: 'server',
  description: 'Return Server Information.',
  execute (message, args) {
    message.channel.send(`Servername: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`)
  }
}
