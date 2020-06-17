const { Collection } = require("discord.js")

/**
 * @returns Y-M-D H:MIN:SEC
 * @example 2018-8-3 11:12:40
 */
function _dateTime() {
  const today = new Date();
  const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date+' '+time;
  return dateTime
}

/**
 * @param {Number} idGuild Guild ID Number
 * @param {String} channelName Channel Name
 * @returns channel object or undefined 
 */
function _findChannel (idGuild,channelName, client) {
  const guild = client.guilds.cache.get(idGuild)
  const guildChannel = guild.channels.cache.find(byName => byName.name === channelName.toLowerCase())
  return guildChannel
}

/**
 * 
 * @param {Set} it Set to String
 */
function itToMdList (it) {
  let result = ''

  for (const str of it) {
    result += `${str} `
  }

  return result
}

/**
 * @param {object} message Listen message object
 * @param {string} roleName Case sensitive
 */
function _hasRole (message, roleName) {
  if (message.member.roles.cache.find(role => role.name === roleName)) {
    return true
  } else {
    message.reply('_hasRole: You have no permission!')
    return false
  }
}

/**
* @param {*} mention Mention Object
* @param {*} client Bot Client Object
*/
function _getUserFromMention (mention, client) {
  // The id is the first and only match found by the RegEx.
  const matches = mention.match(/^<@!?(\d+)>$/)
  // If supplied variable was not a mention, matches will be null instead of an array.
  if (!matches) return
  // However the first element in the matches array will be the entire mention, not just the ID,
  // so use index 1.
  const id = matches[1]
  return client.users.cache.get(id)
}

/**
 * @param {array} arrObj Array
 */
function _isEmpty (arrObj) {
  if (Array.isArray(arrObj) && arrObj.length > 0) {
    return false
  } else {
    return true
  }
}

/**
 * Exports
 */
module.exports = {
  _isEmpty,
  _hasRole,
  _getUserFromMention,
  itToMdList,
  _findChannel,
  _dateTime
}
