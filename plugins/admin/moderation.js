async (m, { client, args, isPrefix, command, isBotAdmin, Func }) => {
   try {
      let setting = global.db.groups.find(v => v.jid == m.chat)
      let type = command.toLowerCase()

      // Ensure the type is 'antilink' and the user has the necessary permissions
      if (type === 'antilink' && !isBotAdmin) {
         return client.reply(m.chat, global.status.botAdmin, m);
      }

      // If no arguments are provided, display the current status
      if (!args || !args[0]) {
         return client.reply(m.chat, `🚩 *Current status* : [ ${setting[type] ? 'ON' : 'OFF'} ] (Enter *On* or *Off*)`, m);
      }

      let option = args[0].toLowerCase();
      let optionList = ['on', 'off'];

      // Ensure the provided option is valid
      if (!optionList.includes(option)) {
         return client.reply(m.chat, `🚩 *Current status* : [ ${setting[type] ? 'ON' : 'OFF'} ] (Enter *On* or *Off*)`, m);
      }

      let status = option !== 'on' ? false : true;

      // If the setting is already in the desired state, inform the user
      if (setting[type] === status) {
         return client.reply(m.chat, Func.texted('bold', `🚩 ${Func.ucword(command)} has been ${option === 'on' ? 'activated' : 'inactivated'} previously.`), m);
      }

      // Update the setting and inform the user
      setting[type] = status;
      client.reply(m.chat, Func.texted('bold', `🚩 ${Func.ucword(command)} has been ${option === 'on' ? 'activated' : 'inactivated'} successfully.`), m);
   } catch (e) {
      // Handle any errors and inform the user
      return client.reply(m.chat, Func.jsonFormat(e), m);
   }
}
