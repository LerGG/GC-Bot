const { Collection } = require("discord.js")

/**
 * 
 * @param {String} s String
 * @example string -> String
 */
function _upperCaseFirst(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

/** 
 * @param {Number} userID User ID to convert
 */
function _toMention(userID) {
  mentionString = "<@"+userID+">"
  return mentionString
}

/**
 * 
 * @param {Number} userID User ID to convert
 */
function _toChannel(channelID) {
  channelString = "<#"+channelID+">"
  return channelString
}

/**
 * 
 * @param {Boolean} bool - Settings, True = Date Time; False = Time
 * @Example True = 7-7-2020, 19:23:34; False = 19:23:34 || RETURNS SERVER TIME, +2 OFFSET SINCE GMT
 * @returns Time or DateTime String
 */
function _dateTime(bool) {
  const today = new Date();
  const date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
  const time = (today.getHours()+ 2) + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date+', '+time;
  if (bool === true) {
    return dateTime
  }
  else {
    return time
  }
}

/**
 * @param {Number} idGuild Guild ID Number
 * @param {String} channelName Channel Name
 * @param {Object} client client object
 * @returns channel object or undefined 
 */
function _findChannel (idGuild, channelName, client) {
  const guild = client.guilds.cache.get(idGuild)
  const guildChannel = guild.channels.cache.find(byName => byName.name.toLowerCase() === channelName.toLowerCase())
  return guildChannel
}

/**
 * 
 * @param {*} idGuild Guild ID Number
 * @param {*} categoryName Category Name
 * @param {*} channelName Channel Name
 * @param {*} client client obeject
 * @returns channel object or undefined 
 */
function _findSubChannel (idGuild, categoryName, channelName, client) {
  const guild = client.guilds.cache.get(idGuild)
  const categoryChannel = guild.channels.cache.find(byName => byName.name.toLowerCase() === categoryName.toLowerCase())
  const guildChannel = guild.channels.cache.find(byName => byName.name === channelName.toLowerCase() && byName.parent.id === categoryChannel.id)
  return guildChannel
}

/**
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
 * @param {object} member Member Object
 * @param {string} roleName Case sensitive
 */
function _hasRoleMember (member, roleName) {
  if (member.roles.cache.find(role => role.name === roleName)) {
    return true
  } else {
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
  _findSubChannel,
  _dateTime,
  _upperCaseFirst,
  _toMention,
  _toChannel,
  _hasRoleMember
}
