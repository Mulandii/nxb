exports.run = {
   usage: ['owner'],
   category: 'miscs',
   async: async (m, {
      client,
      env,
      Func
   }) => {
      client.sendContact(m.chat, [{
         name: env.owner_name,
         number: env.owner,
         about: 'Owner & Creator'
      }], m, {
         org: 'SpikeImc',
         website: 'https://github.com/mohalicious',
         email: 'ovibeldonbel@gmail.com'
      })
   },
   error: false,
   cache: true,
   location: __filename
}