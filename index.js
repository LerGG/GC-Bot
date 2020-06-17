'use strict'

const fs = require('fs')
const Discord = require('discord.js')
const { PREFIX, TOKEN,
        ACTIVITYMESSAGE, ADMINNAME,
        MEMBERNAME, COACHNAME, 
        GUILDID,  SIGNUPCHANNEL, 
        MEMBERSHIPLOG, DAYLIEVIDEOS,
        REPLAYVIDEOS, LIVESESSIONS, } = require('./config.json')

// const { HELPER }
const { _isEmpty, _hasRole, _getUserFromMention, itToMdList, _findChannel, _dateTime } = require('./functions/helpfunctions.js')

// const { strict } = require('assert')

const REGEXDISCORDTAG_REGULAR = new RegExp(/#\d\d\d\d/)
const REGEXDISCORDTAG_FALSE = new RegExp(/#\d\d\d\d\d/)
const REGEXFRINDID = new RegExp(/\d\d\d\d\d/)

const membershipIDs = new Set()
const membershipTAGs = new Set()

// Initialize Discord Client object (BOT)
const client = new Discord.Client({
  // Disable @Everyone on Bot
  disableEveryone: true
})

// Initalize command collection
client.commands = new Discord.Collection()

// Command Array with .js extension only
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

// Build command collection
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command)
}

// Inital Bot States
client.on('ready', () => {
  console.log('Bot started')
  client.user.setActivity(ACTIVITYMESSAGE)

})

// Scans for arriving members
client.on('guildMemberAdd', (member) => {

  // Log Channel object
  const logChannel = _findChannel(GUILDID,MEMBERSHIPLOG,client)

  // Scan for user arriving, delete set entry,
  // Grant discord Role
  if (membershipIDs.delete(member.user.id)) {
    const role = member.guild.roles.cache.find(role => role.name === MEMBERNAME)
    member.roles.add(role)
    return logChannel.send(`[AUTOMATED; ${_dateTime()}]:Granted ${member.user.id} with ${member.user.tag} dota membership status!`)
  }

  // Scans for user TAGS and adds spezific tags to role
  if (membershipTAGs.delete(member.user.tag.toLowerCase())) {
    const role = member.guild.roles.cache.find(role => role.name === MEMBERNAME)
    member.roles.add(role)
    return logChannel.send(`[AUTOMATED; ${_dateTime()}]:Granted ${member.user.tag} dota membership status!`)
  }
})

// Listen for messages
client.on('message', message => {

  // Ignore itself and other bots
  // Infinite command loop protection
  if (message.author.bot) return

  // Ignore messages without bot prefix
  if (!message.content.startsWith(PREFIX)) return

  // Returns command arguments after PREFIX
  const args = message.content.slice(PREFIX.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

/*
BOT COMMANDS START HERE
*/

  /* 
    Bot Status
  */
  if (command === 'status') {
    if (_hasRole(message, ADMINNAME)) {
      client.commands.get('status').execute(message, args)
    }
  }

  /* 
    Server
    Return Server status
  */
  if (command === 'server') {
    if (_hasRole(message, ADMINNAME)) {
      client.commands.get('server').execute(message, args)
    }
  }

  /* 
    Activityclear
    Clears Bot activity and sets default
  */
  if (command === 'activityclear') {
    if (_hasRole(message, ADMINNAME)) {
      client.commands.get('activityclear').execute(message, ACTIVITYMESSAGE)
    }
  }

  /* 
    Activityset
    Sets bot activity to given string
  */
  if (command === 'activityset') {
    if (_hasRole(message, ADMINNAME)) {
      client.commands.get('activityset').execute(message, args, client)
    }
  }
  /* 
    Videos
    Links to all videoe channels
  */
  if (command === 'videos') {
    if (_hasRole(message, ADMINNAME) || _hasRole(message, ADMINNAME) || _hasRole(message, COACHNAME)) {

      // Get channel obejcts
      const replayChannel      = _findChannel(GUILDID,REPLAYVIDEOS,client)
      const daylieVideoChannel = _findChannel(GUILDID,DAYLIEVIDEOS,client)
      const liveSessionChannel = _findChannel(GUILDID,LIVESESSIONS,client)

      if (replayChannel === undefined || replayChannel === undefined || replayChannel === undefined) {
        return message.channel.send("Channels not found. Please check the Bot .config!")
      }
      // Builds Discord channel Tags
      const replayChannelID      = "<#"+replayChannel.id+">"
      const daylieVideoChannelID = "<#"+daylieVideoChannel.id+">"
      const liveSessionChannelID = "<#"+liveSessionChannel.id+">"
      return message.channel.send(`Our Video Channels: ${replayChannelID} ${daylieVideoChannelID} ${liveSessionChannelID}`)
    }
  }

  /*
    Idlist
    Shows Id List of pending memperships
  */
  if (command === 'idlist') {
    if (_hasRole(message, ADMINNAME)) {
      if (args.length > 0) {
        return message.channel.send('!IDlist: Too many Arguments!')
      } else if (membershipIDs.size === 0) {
        return message.channel.send('!IDlist: No pending Memberships')
      } else {
        return message.channel.send(`Pending Membership IDs: ${itToMdList(membershipIDs)}`)
      }
    }
  }

  /*
    Idadd
    Adds id to pending memgership list
  */
  if (command === 'idadd') {
    if (_hasRole(message, ADMINNAME)) {
      // Command exception and ID Integrity (17-19 digits length)
      if (!args.length || args.length > 1) {
        return message.channel.send('!idadd: ID missing or too many arguments!')
      } else if (args[0].length < 17 || args[0].length > 19) {
        return message.channel.send('!idadd: ID Wrong length.17-19 digits')
      }
      // Check if membershipID is empty
      if (membershipIDs.has(args[0])) {
        return message.channel.send('!idadd: ID duplicate.')
      } else {
        // Put ID into variable
        membershipIDs.add(args[0])
        return message.reply(`Added ID: ${args[0]} to Awaiting Membership List!`)
      }
    }
  }

  /*
    Idremove
    Removes ID from pending memgership list
  */
  if (command === 'idremove') {
    if (_hasRole(message, ADMINNAME)) {
      // Command exception and ID Integrity (17-19 digits length)
      if (!args.length || args.length > 1) {
        return message.channel.send('!idremove: ID missing or too many arguments!')
      } else if (args[0].length < 17 || args[0].length > 19) {
        return message.channel.send('!idremove: ID Wrong length.17-19 digits')
      }
      // isEmpty check
      if (membershipIDs === 0) {
        return message.channel.send('!idRemove: ID list is empty.')
      }
      // Look up ID and delete if found
      if (membershipIDs.delete(args[0])) {
        return message.channel.send(`ID found. Removed ${args[0]} from pending membership.`)
      } else {
        return message.channel.send(`ID ${args[0]} not found as pending IDs.`)
      }
    }
  }

  /*
    Taglist
    Lists Tags of pending memerships
  */
  if (command === 'taglist') {
    if (_hasRole(message, ADMINNAME)) {
      if (args.length > 0) {
        return message.channel.send('!taglist: Too many Arguments!')
      } else if (membershipTAGs === 0) {
        return message.channel.send('!taglist: No pending Memberships')
      } else {
        return message.channel.send(`Pending Membership Tags: ${itToMdList(membershipTAGs)}`)
      }
    }
  }

  /*
    Tagadd
    Adds tag to pending membership
  */
  if (command === 'tagadd') {
    if (_hasRole(message, ADMINNAME)) {
      // Exception: Command arguments empty
      if (_isEmpty(args) || args.length > 1) {
        return message.channel.send('!tagadd: TAG missing or too many arguments!')
      }
      // Exception: Wrong Discord Tag formant
      if (!REGEXDISCORDTAG_REGULAR.test(args[args.length - 1]) || REGEXDISCORDTAG_FALSE.test(args[args.length - 1])) {
        return message.reply('!tagadd: Invalid Discord Tag #(0000)')
      }
      // Build string TAG out of args array
      const concatedArray = args.join(' ').toLowerCase()
      // Check if membershipTAG is empty
      if (membershipTAGs.has(concatedArray)) {
        return message.channel.send('!tagadd: ID duplicate.')
      } else {
        // Put ID into variable
        membershipTAGs.add(concatedArray)
        return message.reply(`Tag added: ${concatedArray} to Awaiting Membership List!`)
      }
    }
  }
  
  /*
    Tagremove
    Removes tag from pending membership list
  */
  if (command === 'tagremove') {
    if (_hasRole(message, ADMINNAME)) {
      // Exception: Command arguments empty
      if (_isEmpty(args) || args.length > 1) {
        return message.channel.send('!tagremove: TAG missing or too many arguments!')
      }
      // Exception: Wrong Discord Tag formant
      if (!REGEXDISCORDTAG_REGULAR.test(args[args.length - 1]) || REGEXDISCORDTAG_FALSE.test(args[args.length - 1])) {
        return message.reply('!tagadd: Invalid Discord Tag #(0000)')
      }
      // Look up ID and remove if not found
      if (membershipTAGs.delete(args[0])) {
        return message.channel.send(`TAG found. Removed ${args[0]} from pending membership.`)
      } else {
        return message.channel.send(`TAG ${args[0]} not found as pending TAG.`)
      }
    }
  }

  /*
    Memberadd
    Adds member to the membership
  */
  if (command === 'memberadd') {
    if (_hasRole(message, COACHNAME) || _hasRole(message, ADMINNAME)) {
      // Argument Exceptions
      if (!args.length || args.length > 1) {
        return message.channel.send('!memberadd: User missing or too many arguments!')
      } else {
        const taggedUser = _getUserFromMention(args[0], client)
        // Invalid user Exception
        if (!taggedUser) {
          return message.channel.send('!memberadd: Argument is no User!')
        }
        // Removes User from Guild Role
        const role = message.guild.roles.cache.find(role => role.name === MEMBERNAME)
        message.guild.member(taggedUser).roles.add(role)
        const logChannel = _findChannel(GUILDID,MEMBERSHIPLOG,client)
        logChannel.send(`[!memberadd; ${_dateTime()}]: Granted ${taggedUser} "${MEMBERNAME}" Role!`)
        return message.channel.send(`Added User ${taggedUser} to "${MEMBERNAME}"!`)
      }
    }
  }

  /*
    Memberremove
    Removes member of the membership
  */
  if (command === 'memberremove') {
    if (_hasRole(message, COACHNAME) || _hasRole(message, ADMINNAME)) {
      // Argument Exceptions
      if (!args.length || args.length > 1) {
        return message.channel.send('!memberremove: User missing or too many arguments!')
      } else {
        const taggedUser = _getUserFromMention(args[0], client)
        // Invalid user Exception
        if (!taggedUser) {
          return message.channel.send('!memberremove: Argument is no User!')
        }
        // Removes User from Guild Role
        const role = message.guild.roles.cache.find(role => role.name === MEMBERNAME)
        message.guild.member(taggedUser).roles.remove(role)
        const logChannel = _findChannel(GUILDID,MEMBERSHIPLOG,client)
        logChannel.send(`[!memberremove; ${_dateTime()}]: Removed ${taggedUser} from "${MEMBERNAME}"!`)
        return message.channel.send(`Removed User ${taggedUser} from "${MEMBERNAME}"!`)
      }
    }
  }

  /*
    Tier
    Shows Battlecup Tiers
  */
  if (command === 'tier' || command === 'tiers') {
    if (_hasRole(message, MEMBERNAME)) {
      return client.commands.get('tier').execute(message, args)
    } else {
      return message.reply('Insufficient Discord Role')
    }
  }

  /* 
    Region
    Shows available regions
  */
  if (command === 'region' || command === 'regions') {
    if (_hasRole(message, MEMBERNAME) || _hasRole(message, ADMINNAME) ) {
      return client.commands.get('region').execute(message, args)
    } else {
      return message.reply('Insufficient Discord Role')
    }
  }

  /*
    Remove
    Removes sign up channel entry
  */
  if (command === 'remove') {
    if (_hasRole(message, MEMBERNAME) || _hasRole(message, ADMINNAME)) {

      if (!args.length) {
        return message.reply('!remove: Missing Argument')
      } else if (args.length > 1) {
        return message.reply('!remove: Too many Arguments')
      } else if (!REGEXFRINDID.test(args[0])) {
        return message.reply('Wrong FRIND_ID.')
      }

      // Checks guildID for channel ID and searches for user frind id in the active-players channel
      const signUpChannel = _findChannel(GUILDID,SIGNUPCHANNEL,client)
      const messageContent = signUpChannel.messages.cache.find(m => m.content.includes(args[0])) 

      // Checks if frind-id was found
      if (messageContent === undefined) {
        return message.reply("Could not find your frind-ID in the active player list!")
      } else {
        // Checks if message author made the entry and removes it
        const messageContentID = signUpChannel.messages.cache.find(m => m.content.includes(message.author.id))
        if (messageContentID === undefined) {
          return message.reply("You have made no Entry in the active player list!")
        } else {
            messageContent.delete({ timeout: 5000 })
            return message.reply("You have been removed from the active player pool!");
        }
      }
    }
  }

  /*
    Add
    Adds player to the active-players channel
  */
  if (command === 'add') {
    if (_hasRole(message, MEMBERNAME) || _hasRole(message, ADMINNAME)) {
      // Wrong Argument-Count Exceptions
      if (!args.length) {
        return message.reply('No arguments found: !add [FRIND_ID] [REGION] [BC_TIER]')
      } else if (args.length < 3) {
        return message.reply('Arguments missing: !add [FRIND_ID] [REGION] [BC_TIER]')
      } else if (args.length > 3) {
        return message.reply('Too many arguments: !add [FRIND_ID] [REGION] [BC_TIER]')
      }
      // Wrong Arguments Exceptions
      if (args.length === 3) {
        // Check frind id integrity
        if (!REGEXFRINDID.test(args[0])) {
          return message.reply('Wrong FRIND-ID format. You can find it in your in-game profile!')
        }
        // Check Region
        if (!(args[1] === 'eu' || args[1] === 'na' || args[1] === 'sea')) {
          return message.reply('Wrong REGION. Use: EU,NA,SEA')
        }
        // Check Bcup Tier Number
        if (isNaN(args[2])) {
          return message.reply('Wrong BC_Tier: Use Numbers 3-8')
        }
        // Check Bcup Tier
        if (args[2] < 3 || args[2] > 8) {
          return message.reply('Wrong BC_Tier: Only 3-8 allowed')
        }
      }
      // Sign up player if channels setup properly
      const signUpChannel = _findChannel(GUILDID,SIGNUPCHANNEL,client)
      if (signUpChannel === undefined) {
        message.reply("SignUp channel not found on this discord guild. Check bot config!")
      } else {
        return signUpChannel.send(`${message.author} signed Up. Frind-ID: ${args[0]} | Region: ${args[1]} | BC-Tier: ${args[2]}`)
      }
    }
  }
})

// LOGIN TOKEN
client.login(TOKEN)
