module.exports = (m, env) => {
   const isNumber = x => typeof x === 'number' && !isNaN(x)
   let user = global.db.users.find(v => v.jid == m.sender)
   if (user) {
      if (!isNumber(user.afk)) user.afk = -1
      if (!('afkReason' in user)) user.afkReason = ''
      if (!('afkObj' in user)) user.afkObj = {}
      if (!('name' in user)) user.name= m.pushName
      if (!('banned' in user)) user.banned = false
      if (!isNumber(user.banTemp)) user.banTemp = 0
      if (!isNumber(user.banTimes)) user.banTimes = 0
      if (!isNumber(user.limit)) user.limit = env.limit
      if (!('premium' in user)) user.premium = false
      if (!isNumber(user.expired)) user.expired = 0
      if (!isNumber(user.lastseen)) user.lastseen = 0
      if (!isNumber(user.hit)) user.hit = 0
      if (!isNumber(user.spam)) user.spam = 0
      if (!isNumber(user.warning)) user.warning = 0
   } else {
      global.db.users.push({
         jid: m.sender,
     	afk: -1,
         afkReason: '',
         afkObj: {},
         name: m.pushName,
         banned: false,
         banTemp: 0,
         banTimes: 0,
         limit: env.limit,
         premium: false,
         expired: 0,
         lastseen: 0,
         hit: 0,
         spam: 0,
         warning: 0
      })
   }

   if (m.isGroup) {
      let group = global.db.groups.find(v => v.jid == m.chat)
      if (group) {
         if (!isNumber(group.activity)) group.activity = 0
         if (!('antidelete' in group)) group.antidelete = true
         if (!('antilink' in group)) group.antilink = true
         if (!('antivirtex' in group)) group.antivirtex = true
         if (!('filter' in group)) group.filter = false
         if (!('left' in group)) group.left = false
         if (!('localonly' in group)) group.localonly = false
         if (!('mute' in group)) group.mute = false
         if (!('viewonce' in group)) group.viewonce = true
         if (!('autosticker' in group)) group.autosticker = true
         if (!('member' in group)) group.member = {}
         if (!('text_left' in group)) group.text_left = ''
         if (!('text_welcome' in group)) group.text_welcome = ''
         if (!('welcome' in group)) group.welcome = false
         if (!isNumber(group.expired)) group.expired = 0
         if (!('stay' in group)) group.stay = false
      } else {
         global.db.groups.push({
            jid: m.chat,
            activity: 0,
            antidelete: true,
            antilink: false,
            antivirtex: false,
            filter: false,
            left: false,
            localonly: false,
            mute: false,
            viewonce: true,
            autosticker: true,
            member: {},
            text_left: '',
            text_welcome: '',
            welcome: false,
            expired: 0,
            stay: false
         })
      }
   }

   let chat = global.db.chats.find(v => v.jid == m.chat)
   if (chat) {
      if (!isNumber(chat.chat)) chat.chat = 0
      if (!isNumber(chat.lastchat)) chat.lastchat = 0
      if (!isNumber(chat.lastseen)) chat.lastseen = 0
   } else {
      global.db.chats.push({
         jid: m.chat,
         chat: 0,
         lastchat: 0,
         lastseen: 0
      })
   }

   let setting = global.db.setting
   if (setting) {
      if (!('autodownload' in setting)) setting.autodownload = true
  	if (!('debug' in setting)) setting.debug = false
      if (!('error' in setting)) setting.error = []
      if (!('hidden' in setting)) setting.hidden = []
      if (!('pluginDisable' in setting)) setting.pluginDisable = []
      if (!('groupmode' in setting)) setting.groupmode = false
      if (!('sk_pack' in setting)) setting.sk_pack = 'Evil'
      if (!('sk_author' in setting)) setting.sk_author = 'Bot'
      if (!('self' in setting)) setting.self = false
      if (!('noprefix' in setting)) setting.noprefix = true
      if (!('multiprefix' in setting)) setting.multiprefix = true
      if (!('prefix' in setting)) setting.prefix = ['.', '/', '!', '#']
      if (!('toxic' in setting)) setting.toxic = ["ajg", "ajig", "anjas", "anjg", "anjim", "anjing", "anjrot", "anying", "asw", "autis", "babi", "bacod", "bacot", "bagong", "bajingan", "bangsad", "bangsat", "bastard", "bego", "bgsd", "biadab", "biadap", "bitch", "bngst", "bodoh", "bokep", "cocote", "coli", "colmek", "comli", "dajjal", "dancok", "dongo", "fuck", "gelay", "goblog", "goblok", "guoblog", "guoblok", "hairul", "henceut", "idiot", "itil", "jamet", "jancok", "jembut", "jingan", "kafir", "kanjut", "kanyut", "keparat", "kntl", "kontol", "lana", "loli", "lont", "lonte", "mancing", "meki", "memek", "ngentod", "ngentot", "ngewe", "ngocok", "ngtd", "njeng", "njing", "njinx", "oppai", "pantek", "pantek", "peler", "pepek", "pilat", "pler", "pornhub", "pucek", "puki", "pukimak", "redhub", "sange", "setan", "silit", "telaso", "tempek", "tete", "titit", "toket", "tolol", "tomlol", "tytyd", "wildan", "xnxx"]
      if (!('online' in setting)) setting.online = false
      if (!('onlyprefix' in setting)) setting.onlyprefix = '+'
      if (!('owners' in setting)) setting.owners = ['254796032440']
      if (!isNumber(setting.lastReset)) setting.lastReset = new Date * 1
      if (!('msg' in setting)) setting.msg = 'Hi +tag This is a simple whatsapp bot.'
      if (!isNumber(setting.style)) setting.style = 4
      if (!('cover' in setting)) setting.cover = 'https://graph.org/file/990d56dbd149852802440.jpg'
      if (!('link' in setting)) setting.link = 'https://Github.com/mohalicious'
   } else {
      global.db.setting = {
         autodownload: true,
         debug: false,
         error: [],
         hidden: [],
         pluginDisable: [],
         groupmode: false,
         sk_pack: 'Evil',
         sk_author: 'Bot',
         self: false,
         noprefix: true,
         multiprefix: true,
         prefix: ['.', '#', '!', '/'],
         toxic: ["ajg", "ajig", "anjas", "anjg", "anjim", "anjing", "anjrot", "anying", "asw", "autis", "babi", "bacod", "bacot", "bagong", "bajingan", "bangsad", "bangsat", "bastard", "bego", "bgsd", "biadab", "biadap", "bitch", "bngst", "bodoh", "bokep", "cocote", "coli", "colmek", "comli", "dajjal", "dancok", "dongo", "fuck", "gelay", "goblog", "goblok", "guoblog", "guoblok", "hairul", "henceut", "idiot", "itil", "jamet", "jancok", "jembut", "jingan", "kafir", "kanjut", "kanyut", "keparat", "kntl", "kontol", "lana", "loli", "lont", "lonte", "mancing", "meki", "memek", "ngentod", "ngentot", "ngewe", "ngocok", "ngtd", "njeng", "njing", "njinx", "oppai", "pantek", "pantek", "peler", "pepek", "pilat", "pler", "pornhub", "pucek", "puki", "pukimak", "redhub", "sange", "setan", "silit", "telaso", "tempek", "tete", "titit", "toket", "tolol", "tomlol", "tytyd", "wildan", "xnxx"],
         online: false,
         onlyprefix: '+',
         owners: ['254796032440'],
         lastReset: new Date * 1,
         msg: 'Hi +tag 🪸This is a simple whatsapp bot.',
         style: 4,
         cover: 'https://graph.org/file/990d56dbd149852802440.jpg',
         link: 'https://Github.com/mohalicious'
      }
   }
}