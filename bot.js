console.log(`[support bot] - start | dev by Vlublyash`);
const TelegramBot = require('node-telegram-bot-api');
const token = `you-token-from-@botfather`;
const bot = new TelegramBot(token, {polling: true});

const userbd = require('./userbd.json');
async function savebd() {
  require('fs').writeFileSync('./userbd.json', JSON.stringify(userbd, null, '\t'));
  return true;
}
setInterval(async () => {
  await savebd();
}, 1000);

const forumid = -0; //you forum chat id
const channelOwner = 'Vlublyash';
const admin = 1; // you user id
let startapp = `welcome to support bot. How can i help you?`;

bot.on('message', (msg,err) => {
  let fname = msg.chat.first_name == undefined ? '' : msg.chat.first_name;
  let lname = msg.chat.last_name == undefined ? '' : ' '+msg.chat.last_name;
  if(!userbd.find(x=> x.id === msg.chat.id)) {
    if(msg.from.is_bot == false) {
      userbd.push({
        name: `${fname}${lname}`,
        nick: msg.chat.username,
        id: msg.chat.id,
        uid: userbd.length,
        fid: 0
      });
        bot.createForumTopic(forumid,`${fname}${lname}`);
        bot.sendMessage(msg.chat.id, `${startapp}`);
    }
  }
  let istopic = msg.forum_topic_created == undefined ? false : true;
  if(istopic == true) {
    let xwb = userbd.find(x=> x.name === msg.forum_topic_created.name);
    xwb.fid = msg.message_thread_id;
    bot.sendMessage(forumid, `id: ${xwb.id} \nuid: ${xwb.uid}`, {
      message_thread_id: msg.message_thread_id
    });
  }
  msg.user = userbd.find(x=> x.id === msg.chat.id);
  //forward to chat
  if(msg.chat.id == msg.from.id) {
      const chatId = msg.chat.id;
      bot.forwardMessage(forumid,chatId, msg.message_id, {
        message_thread_id: msg.user.fid
      });
  }
  //answer to chat. only text
  if(msg.chat.id == forumid) {
    if(msg.from.id == admin || msg.from.id == 1087968824) {
      usfor = userbd.find(x=> x.fid === msg.message_thread_id);
      bot.sendMessage(usfor.id, `${msg.text}`);
    }
  }
  let xtime = new Date().getTime();
  msglogs.push({
    user: {
      id: msg.chat.id,
      nick: msg.chat.username,
      name: `${fname} ${lname}`
    },
    text: `${msg.text}`,
    time: xtime,
    msgid: msglogs.length
  });
});