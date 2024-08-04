const telegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const TOKEN = "private_telegram_bot_token";

const bot = new telegramBot(TOKEN, {polling: true} );

bot.on('message' , (message) => {

    let chat_id = message.from.id;
    
    console.log(chat_id);
    
    let gelen_mesaj = message.text;
    console.log(gelen_mesaj);

    let gönderen_kişi = message.from.first_name;
    console.log(gönderen_kişi);


    //mesajı makinaya gönder
    const makine = require("./app.js");
    const makine_cevabı = makine(chat_id , gelen_mesaj , gönderen_kişi); 
        
    bot.sendMessage(chat_id , makine_cevabı);
    
});