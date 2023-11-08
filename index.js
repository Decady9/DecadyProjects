import { VK, Keyboard } from "vk-io";
import { MongoClient } from "mongodb";
import fs from 'fs';
import { count } from "console";
import { send } from "process";
var a = 1;
let now = new Date();
const cfg = JSON.parse(fs.readFileSync('./config.json'));
const vk = new VK({
    token: cfg.token
});
const client = new MongoClient('mongodb://127.0.0.1:27017');
const db = client.db('Test').collection('Decady');


vk.updates.start().then(() => {
    console.log("Бот Запущен " + now);
});

  vk.updates.hear('рыбалка', (context) => {
    

    if(a==1){
    context.send(`Вы начали рыбалку`);
    a = 0

    setTimeout(() => {
   
      const fish = getFish();
  
      context.send(`Вы поймали ${fish}!`);
      a = 1
    }, 9000)

    }
    else{
      context.send(`Вы должны дождаться предыдущей поклевки`);
    }
    
    
  

  });


// Функция для получения случайной рыбы
function getFish() {
  const fishes = ['окунь', 'карп', 'судак', 'щука', 'лосось', 'Порванный сапог'];
  const randomIndex = Math.floor(Math.random() * fishes.length);
  return fishes[randomIndex];
}

// Авторизация и запуск бота
vk.updates.start().catch(console.error); 


function sellers(){

}