/*
# Copyright (C) 2020 farhan-dqz
*/


const Asena = require('../events');
const { MessageType } = require('@adiwajshing/baileys');
const axios = require('axios');
const Config = require('../config');

const Language = require('../language');
const { errorMessage, infoMessage } = require('../helpers');
const Lang = Language.getString('instagram') ;



if (Config.WORKTYPE == 'private') {

Asena.addCommand({ pattern: 'profinsta ?(.*)', fromMe: true, usage: Lang.USAGE, desc: Lang.DESC }, async (message, match) => {

    const userName = match[1]

    if (!userName) return await message.sendMessage(errorMessage(Lang.NEED_WORD))

    await message.sendMessage(infoMessage(Lang.LOADING))

    await axios
      .get(`https://api-anoncybfakeplayer.herokuapp.com/igstalk?username=${userName}`)
      .then(async (response) => {
        const {
          pic,
          username,
          bio,
          follower,
          following,
        } = response.data

        const profileBuffer = await axios.get(pic, {responseType: 'arraybuffer'})

        const msg = `
        *${Lang.USERNAME}*: ${username}    
        *${Lang.BIO}*: ${bio}
        *${Lang.FOLLOWERS}*: ${follower}
        *${Lang.FOLLOWS}*: ${following}`

        await message.sendMessage(Buffer.from(profileBuffer.data), MessageType.image, {
          caption: msg
        })
      })
      .catch(
        async (err) => await message.sendMessage(errorMessage(Lang.NOT_FOUND + userName)),
      )
  },

 )
}
else if (Config.WORKTYPE == 'public') {

Asena.addCommand({ pattern: 'profinsta ?(.*)', fromMe: false, usage: Lang.USAGE, desc: Lang.DESC }, async (message, match) => {

    const userName = match[1]

    if (!userName) return await message.sendMessage(errorMessage(Lang.NEED_WORD))

    await message.sendMessage(infoMessage(Lang.LOADING))

    await axios
      .get(`https://api-anoncybfakeplayer.herokuapp.com/igstalk?username=${userName}`)
      .then(async (response) => {
        const {
          pic,
          username,
          bio,
          follower,
          following,
        } = response.data

        const profileBuffer = await axios.get(pic, {responseType: 'arraybuffer'})

        const msg = `
        *${Lang.USERNAME}*: ${username}    
        *${Lang.BIO}*: ${bio}
        *${Lang.FOLLOWERS}*: ${follower}
        *${Lang.FOLLOWS}*: ${following}`

        await message.sendMessage(Buffer.from(profileBuffer.data), MessageType.image, {
          caption: msg
        })
      })
      .catch(
        async (err) => await message.sendMessage(errorMessage(Lang.NOT_FOUND + userName)),
      )
  });

}));

Asena.addCommand({ pattern: 'story ?(.*)', fromMe: true, desc: "Download Instagram story." }, (async (message, match) => {

	match = !message.reply_message.txt ? match : message.reply_message.text;

	if (match === '' || (!match.includes('/stories/') && match.startsWith('http'))) return await message.sendMessage('```Give me a username.```');

	if (match.includes('/stories/')) {

		let s = match.indexOf('/stories/') + 9;

		let e = match.lastIndexOf('/');

		match = match.substring(s, e);

	}

	let json = await igStory(match);

	if (json.error) return await message.sendMessage(json.error);

	if (json.medias.length > 0) {

		await message.sendMessage('```Downloading``` *' + json.medias.length + '* ```stories...```');

		for (let media of json.medias) {

			let { buffer, type } = await getBuffer(media.url);

			if (type == 'video') await message.sendMessage(buffer, { mimetype: Mimetype.mp4 }, MessageType.video);

			else if (type == 'image') await message.sendMessage(buffer, { mimetype: Mimetype.jpeg }, MessageType.image);

		}

	}

}));

async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

 

