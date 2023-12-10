const { Baileys, MongoDB, PostgreSQL, Scandir, Function: Func } = new(require('@neoxr/wb'))
const spinnies = new(require('spinnies'))(),
   fs = require('fs'),
   path = require('path'),
   colors = require('@colors/colors'),
   stable = require('json-stable-stringify'),
   env = require('./config.json')
const cache = new(require('node-cache'))({
   stdTTL: env.cooldown
})
if (process.env.DATABASE_URL && /mongo/.test(process.env.DATABASE_URL)) MongoDB.db = env.database
const machine = (process.env.DATABASE_URL && /mongo/.test(process.env.DATABASE_URL)) ? MongoDB : (process.env.DATABASE_URL && /postgres/.test(process.env.DATABASE_URL)) ? PostgreSQL : new(require('./lib/system/localdb'))(env.database)
const client = new Baileys({
   type: '--neoxr-v1',
   plugsdir: 'plugins',
   sf: 'session',
   online: true,
   version: [2, 2318, 11]
})

/* starting to connect */
client.on('connect', async res => {
   /* load database */
   global.db = {users:[], chats:[], groups:[], statistic:{}, sticker:{}, setting:{}, ...(await machine.fetch() ||{})}
   
   /* save database */
   await machine.save(global.db)

   /* write connection log */
   if (res && typeof res === 'object' && res.message) Func.logFile(res.message)
})

/* print error */
client.on('error', async error => {
   console.log(colors.red(error.message))
   if (error && typeof error === 'object' && error.message) Func.logFile(error.message)
})

/* bot is connected */
client.on('ready', async () => {
   /* auto restart if ram usage is over */
   const ramCheck = setInterval(() => {
      var ramUsage = process.memoryUsage().rss
      if (ramUsage >= require('bytes')(env.ram_limit)) {
         clearInterval(ramCheck)
         process.send('reset')
      }
   }, 60 * 1000)

   /* create temp directory if doesn't exists */
   if (!fs.existsSync('./temp')) fs.mkdirSync('./temp')

   /* require all additional functions */
   require('./lib/system/config'), require('./lib/system/baileys')(client.sock), require('./lib/system/functions'), require('./lib/system/scraper')

   /* clear temp folder every 10 minutes */
   setInterval(() => {
      try {
         const tmpFiles = fs.readdirSync('./temp')
         if (tmpFiles.length > 0) {
            tmpFiles.filter(v => !v.endsWith('.file')).map(v => fs.unlinkSync('./temp/' + v))
         }
      } catch {}
   }, 60 * 1000 * 10)

   /* save database send http-request every 30 seconds */
   setInterval(async () => {
      if (global.db) await machine.save(global.db)
      if (process.env.CLOVYR_APPNAME && process.env.CLOVYR_URL && process.env.CLOVYR_COOKIE) {
         const response = await axios.get(process.env.CLOVYR_URL, {
            headers: {
               referer: 'https://clovyr.app/view/' + process.env.CLOVYR_APPNAME,
               cookie: process.env.CLOVYR_COOKIE
            }
         })
         Func.logFile(`${await response.status} - Application wake-up!`)
      }
   }, 30_000)
})

/* print all message object */
client.on('message', ctx => require('./handler')(client.sock, ctx))

/* print deleted message object */
client.on('message.delete', ctx => {
   const sock = client.sock  
   if (!ctx || ctx.origin.fromMe || ctx.origin.isBot || !ctx.origin.sender) return
   if (cache.has(ctx.origin.sender) && cache.get(ctx.origin.sender) === 1) return
   cache.set(ctx.origin.sender, 1)
   if (ctx.origin.isGroup && global.db.groups.some(v => v.jid == ctx.origin.chat) && global.db.groups.find(v => v.jid == ctx.origin.chat).antidelete) return sock.copyNForward(ctx.origin.chat, ctx.delete)
})

/* AFK detector */
client.on('presence.update', update => {
   if (!update) return
   const sock = client.sock
   const { id, presences } = update
   if (id.endsWith('g.us')) {
      for (let jid in presences) {
         if (!presences[jid] || jid == sock.decodeJid(sock.user.id)) continue
         if ((presences[jid].lastKnownPresence === 'recording' || presences[jid].lastKnownPresence === 'recording') && global.db.users.find(v => v.jid == jid) && global.db.users.find(v => v.jid == jid).afk > -1) {
            sock.reply(id, `System detects activity from @${jid.replace(/@.+/, '')} after being offline for : ${Func.texted('bold', Func.toTime(new Date - global.db.users.find(v => v.jid == jid).afk))}\n\n➠ ${Func.texted('bold', 'Reason')} : ${global.db.users.find(v => v.jid == jid).afkReason ? global.db.users.find(v => v.jid == jid).afkReason : '-'}`, global.db.users.find(v => v.jid == jid).afkObj)
            global.db.users.find(v => v.jid == jid).afk = -1
            global.db.users.find(v => v.jid == jid).afkReason = ''
            global.db.users.find(v => v.jid == jid).afkObj = {}
         }
      }
   } else {}
})

client.on('group.add', async ctx => {
   const sock = client.sock
   const groupSet = global.db.groups.find(v => v.jid == ctx.jid);
   const welcomeMessages = [
      `Thanks +tag for joining into +grup group.`,
      `Welcome +tag! We're thrilled to have you in +grup.`,
      `Hey +tag, buckle up! You've just entered +grup territory.`,
      `Greetings +tag! Prepare to embark on an epic journey in +grup.`,
      `Hi +tag, your presence just made +grup 10 times cooler!`,
      `Hello +tag! Get ready for an adventure in +grup.`,
      `A warm welcome to +tag! The +grup community is now complete.`,
      `Thanks for joining +grup, +tag! Expect the unexpected.`,
      `Hello +tag! Your journey in +grup begins now.`,
      `Welcome +tag! +grup just got a whole lot more awesome.`,
      `Hi there, +tag! Get ready for some serious fun in +grup.`,
      `Thanks for choosing +grup, +tag! Let the good times roll.`,
      `Hello +tag! Your VIP pass to +grup is now activated.`,
      `Welcome +tag! +grup is buzzing with excitement.`,
      `Hey +tag! +grup just became the coolest place on the internet.`,
      `Thanks +tag! +grup is now officially epic with you here.`,
      `Hello +tag! Brace yourself for awesomeness in +grup.`,
      `Welcome +tag! The party in +grup just leveled up.`,
      `Hi +tag! +grup welcomes you with open arms and high-fives.`,
      `Prepare for greatness, +tag! Your presence elevates +grup.`,
   ];
   const text = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
   try {
      var pic = await Func.fetchBuffer(await sock.profilePictureUrl(ctx.member, 'image'))
   } catch {
      var pic = await Func.fetchBuffer(await sock.profilePictureUrl(ctx.jid, 'image'))
   }

   /* localonly to remove new member when the number not from Kenya */
   if (groupSet && groupSet.localonly) {
      if (global.db.users.some(v => v.jid == ctx.member) && !global.db.users.find(v => v.jid == ctx.member).whitelist && !ctx.member.startsWith('254') || !ctx.member.startsWith('254')) {
         sock.reply(ctx.jid, Func.texted('bold', `Sorry @${ctx.member.split`@`[0]}, this group is only for Indonesian people and you will be removed automatically.`))
         sock.updateBlockStatus(member, 'block')
         return await Func.delay(2000).then(() => sock.groupParticipantsUpdate(ctx.jid, [ctx.member], 'remove'))
      }
   }

   const txt = (groupSet && groupSet.text_welcome ? groupSet.text_welcome : text).replace('+tag', `@${ctx.member.split`@`[0]}`).replace('+grup', `${ctx.subject}`)
   if (groupSet && groupSet.welcome) sock.sendMessageModify(ctx.jid, txt, null, {
      largeThumb: true,
      thumbnail: pic,
      url: global.db.setting.link
   })
})

client.on('group.remove', async ctx => {
   const sock = client.sock
   const text = `Goodbye +tag :)`
   const groupSet = global.db.groups.find(v => v.jid == ctx.jid);
   try {
      var pic = await Func.fetchBuffer(await sock.profilePictureUrl(ctx.member, 'image'))
   } catch {
      var pic = await Func.fetchBuffer(await sock.profilePictureUrl(ctx.jid, 'image'))
   }
   const txt = (groupSet && groupSet.text_left ? groupSet.text_left : text).replace('+tag', `@${ctx.member.split`@`[0]}`).replace('+grup', `${ctx.subject}`)
   if (groupSet && groupSet.left) sock.sendMessageModify(ctx.jid, txt, null, {
      largeThumb: true,
      thumbnail: pic,
      url: global.db.setting.link
   })
})

client.on('caller', ctx => {
	if (typeof ctx === 'boolean') return
	client.sock.updateBlockStatus(ctx.jid, 'block')
})

// client.on('group.promote', ctx => console.log(ctx))
// client.on('group.demote', ctx => console.log(ctx))
