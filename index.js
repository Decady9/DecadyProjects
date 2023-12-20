import { VK, Keyboard } from "vk-io";
import { MongoClient } from "mongodb";
import fs from 'fs';
import { Console } from "console";
// Переменные
let userNumber;
let timeFish = 300;
let weightMin = 0.123
let now = new Date();
const cfg = JSON.parse(fs.readFileSync('./config.json'));
const vk = new VK({
  token: cfg.token
});
const client = new MongoClient('mongodb://127.0.0.1:27017');
const db = client.db('fish').collection('users');
//МАССИВЫ_____________________________________________________________________________________________
const fish = ['Карп-кои', 'Щука', 'Окунь', 'Карась', 'Порванный сапог', 'Абоба', 'Кувшинка', 'Спрут', 'Рыба Фугу', 'Малёк'];
const weightMax = [0.500, 1.000, 2.000, 3.000, 7.200, 10.000]
const phrases = ["Рыбак рыбака видит издалека", "Без терпения не поймаешь и красной рыбки", "Лови рыбу, не ловись на слова", "Рыбалка – это как жизнь: нужно терпение и умение ждать", "Лучше один раз поймать большую рыбу, чем сто раз мелкую", "Рыбаку везет, когда он сам себе удочку кидает", "Рыбалка – это искусство находить общий язык с природой", "Удочка в руках – душа в радости", "На рыбалке лучше всех отдыхают те, кто умеет ждать", "Рыбаку все рыбки к обеду", "Рыбалка – это способ подзарядиться позитивной энергией", "Рыбаку важно не только поймать рыбу, но и насладиться процессом ловли", "Там, где вода, там и рыба", "Удочка – лучший друг рыбака", "Лови рыбу, как будто завтра конца света", "Рыбалка – это возможность уйти от повседневных забот и насладиться природой", "Кто ищет, тот всегда найдет рыбку", "На рыбалке время течет медленнее, чем в городе", "Поймай рыбу – и твой день будет удачным", "Рыбалка – это способ научиться быть терпеливым и настойчивым", "Лучше на рыбалку, чем в бар за пятьдесят километров", "Рыбаку важно быть в гармонии с природой, чтобы поймать большую рыбу", "На рыбалке нет плохой погоды, есть только плохая экипировка", "Лови рыбу с улыбкой на лице – и она точно попадется", "Рыбалка – это возможность побывать в мире без стресса и суеты", "Лучше один раз поймать большую рыбу, чем много мелких", "Рыбаку важно быть внимательным и чутким к окружающей природе", "На рыбалке каждый может стать хорошим рыбаком, если у него есть терпение и настойчивость", "Лови рыбу с умом и она обязательно попадется на крючок", "Рыбалка – это возможность провести время с семьей или друзьями и насладиться общением"]
//______________________________________________________НАЧАЛО___________________________________________
//стартовая отладка
vk.updates.start().then(() => {
  console.log("Бот Запущен " + now);

  //-----------------------------------

//Проверка на сообщения

vk.updates.on('message', async (context, next) => {
  if (context.isGroup) return;
  try {
    let phrases2 =[]
    phrases.push(context.text)
    await client.connect();
    const phrasesPlayers = await db.findOne();
    let user_info = await vk.api.users.get({ user_ids: context.senderId });
    await db.updateOne({phrasesPlayers: phrasesPlayers.phrasesPlayers}, { $push: { phrasesPlayers: '[id'+ context.senderId + '|' + user_info[0].first_name +" " + user_info[0].last_name + '] - ' + context.text} });
    const result = await db.findOne({id: context.senderId});

    console.log(user_info[0].last_name, "пишет", context.text)
    

  
    if (result === null ) {
     
      await db.insertOne({ "id": context.senderId, "balance_real": 0,  "balance_fake": 0, "PlayerFishes": 0, "attempsCheck": 0, "attemps":10, "kd": 0, "weight": 0 , "lastName": user_info[0].last_name, "firstName": user_info[0].first_name, "stats": { "new": 1, "fish": 0 } });
      let id = context.senderId
      context.send(`[id${id}|${user_info[0].first_name}] Добро пожаловать в бот рыбалка! Версия бота 0.1.1 beta. Вы были успешно зарегистрированны\n-\n Напишите ".рыбалка" что бы начать играть`)//ПРОВЕРКА НА НОВОГО ПОЛЬЗОВАТЕЛЯ

    }
        

  } catch (err) {
    await context.reply("Ошибка в базе данных, напишиье админу а");
    console.log(err);
  } finally {
    await client.close();
  }
  await next();
})
vk.updates.hear('.рыб топ', async(context)=> {
  try{
    const top = []
    const client = new MongoClient(`mongodb://127.0.0.1:27017`);

    await client.connect()//подключение
    const db = client.db('fish');
    const collection = db.collection('users');
    
    collection.find().sort({ balance_real: -1 }).limit(10).toArray()
    .then(users => {
      users.forEach((user, index) => {
       top.push(`\n${index + 1}. [id${user.id}|${user.lastName} ${user.firstName}] - ${user.balance_real} монет`);

        let userNumber = index+1
       
       
      }

      );
      context.send(`${top}`);
 

    })
    .catch(err => {
      console.error('Ошибка при поиске пользователей:', err);
    });
  }
  finally {
    await client.close();
   }
})


}); 
//ОБЩАЯ СТАТИСТИКА
vk.updates.hear('.другое', async (context) => {
  try {
    await client.connect()//подключение
    const result = await db.findOne({id: context.senderId});
    const all = await db.findOne();
    const countPhrases = all.phrasesPlayers.length
    console.log(countPhrases)
     await context.send(`Всего игроками было выловлено ${all.count} рыбов!\n-\nВаша статистика:\nРыб поймано: ${result.PlayerFishes}\nПорваных сапог поймано: ${result.torn_boots}\nНаживки осталось:${result.attemps}\n-\n
    Как говорил ${all.phrasesPlayers[ Math.floor(Math.random() * countPhrases) + 1]}`)    
     
   } 
   finally {
    await client.close();
   }
});
//-------
vk.updates.hear('.рыб помощь', async (context) => {
  const message = await context.send(`Помощь по командам:\n
  ".рыбалка" - начать рыбалку. - длительность 5 минут\n
  ".баланс" - просмотр баланса, остатка наживки\n
  ".продать улов" - продажа рыбы за монеты\n
  ".рыб топ" - глобальный топ 10 по количеству монет\n
  ".кнопки" - добавить кнопки (Используйте только в личных сообщениях с сообществом)\n
  ".убрать кнопки" - убрать кнопки\n
  ".другое" - просмотр разных статистических данных\n
  `);

  console.log('ID сообщения бота:', message); // Выводим ID сообщения бота в консоль

/*   setTimeout(() => {
    context.deleteMessage(message); // удаление сообщения
}, 5000); */
});
//---------
vk.updates.hear('.продать улов', async (context) => {
  try {
    await client.connect()//подключение
    const result = await db.findOne({id: context.senderId});
    
    await db.updateOne({ id: context.senderId }, { $inc: { "balance_real": result.balance_fake} });
    if(result.balance_fake>0){

      await context.send(`Вы продали свою рыбу за ${result.balance_fake} монет!`)
      await db.updateOne({ id: context.senderId }, { $set: { "balance_fake": 0 } }); 
    }
    else{
      await context.send(`К сожалению,   вам нечего продавать!`)
    }
    
   } 
   finally {
    await client.close();
   }
});

//.баланс
vk.updates.hear('.баланс', async (context) => {
  try {
    await client.connect()
    const result =  await db.findOne({id: context.senderId});
    await context.send(`Ваш баланс ${result.balance_real} монет\n-\nКоличество оставшейся наживки: ${result.attemps}  `)
   } 
   finally {
    await client.close();
   }
});
//кнопки
vk.updates.hear('.кнопки', (context) => {
  context.send({
    message:"Кнопки были добавлены",
    keyboard: Keyboard.builder()
        .textButton({
             label: '.рыбалка',
            color: Keyboard.POSITIVE_COLOR,
        })
        .row()
        .textButton({
            label: '.продать улов',
           color: Keyboard.NEGATIVE_COLOR,
       })
        
        .textButton({
             label: '.баланс',
             color: Keyboard.NEGATIVE_COLOR,
        })
        .textButton({
          label: '.другое',
          color: Keyboard.NEGATIVE_COLOR,
      })
    

     .row()
     .textButton({
      label:".убрать кнопки",
      color: Keyboard.NEGATIVE_COLOR,
     })
        
  });
  

});
//Удаление кнопок
vk.updates.hear('.убрать кнопки', (context) => {
  context.send({
    message:"Кнопки были убраны",
   keyboard:Keyboard.builder()
  
  });
});
//БАЗА РЫБАЛКИ

//------------------------------------------------------------------------
vk.updates.hear('.рыбалка', async (context) => {
  let user_info = await vk.api.users.get({ user_ids: context.senderId });


  let result;
  let UserFish;
  try {
    let user_info = await vk.api.users.get({ user_ids: context.senderId });


    await client.connect();
    result = await db.findOne({ id: context.senderId });
    await db.updateOne({ id:context.senderId}, {$set:{"firstName": user_info[0].first_name}})
    await db.updateOne({ id:context.senderId}, {$set:{"lastName": user_info[0].last_name}})

    if(result.attempsCheck > 1){
      await db.updateOne({ id:context.senderId}, {$set:{"attempsCheck": 1}})
    }
    if(result.attempsCheck==1){
      await db.updateOne({ id: context.senderId }, { $set: { "attemps": 10} });
      await db.updateOne({ id:context.senderId}, {$set:{"attempsCheck": 0}})
      await context.send("Новый день - новая рыбка! \nТы получил 10 червячков для шикарной рыбалки!")
    }
    let date = Math.floor(Date.now() / 1000);
    console.log(date, "Баланс игрока", result.balance_fake);
  
    if(result.attemps>0){
      if (date - result.kd >= timeFish/* КД на рыбалку */) {
        console.log(user_info[0].last_name, user_info[0].first_name, "Начал рыбалку")
        try {
          await client.connect();
          await db.updateOne({ id: context.senderId }, { $set: { "kd": date } });
          await db.updateOne({ id: context.senderId }, { $set: { "weight": 0 } });
          await db.updateOne({ id: context.senderId }, { $set: { "weight": 0 } });
          await db.updateOne({ id: context.senderId }, { $inc: { "attemps": -1} });
          if(result.attemps<0){
            await db.updateOne({ id: context.senderId }, { $set: { "attemps": 0} });
          }
          await context.send(`Вы начали рыбалку\nПомните: ${phrases[ Math.floor(Math.random() * 30) + 1]}`);
          setTimeout(async () => {
                      try {
                        await client.connect()
                        const b = await db.findOne();
                        await db.updateOne({count: b.count}, { $inc: { count: 1 } });
                      } 
                       finally {
                       await client.close();
                       }
            const fish = getFish();
            const weightMax = getMass();
            result.weight = Math.random() * (weightMax - weightMin) + weightMin;
            result.weight = Math.round(result.weight * 1000) / 1000;
  
            if (fish == 'Порванный сапог') {
                result.weight = 0.100;
                await client.connect();
                await db.updateOne({ id: context.senderId }, { $inc: { "torn_boots": 1} });
            }
            else{
              await client.connect();
              await db.updateOne({ id: context.senderId }, { $inc: { "PlayerFishes": 1} });
            }
            const resultFirstSumm = sellets(result.weight, fish);
  
            console.log(result.balance_fake)
  
            await client.connect();
            const main = result.id
            await db.updateOne({ id: context.senderId }, { $inc: { "balance_fake": resultFirstSumm} });
  
  
  
  
            //resultFirstSumm = "ПЕРВАЯ ПЕРЕМЕННАЯ В МОНГОДБ"
            console.log(result.weight, result.balance_fake)

            await context.send(`[id${main}|Ваш] улов:\n${fish} весом ${result.weight} кг.\nЕго цена ${resultFirstSumm} монет`, {});;
  
          }, timeFish*1000 - 250)
  
  
  
        } finally {
          await client.close();
        }
      } else {
        await context.send(`Рано стартуешь, жди ещё ${timeFish- (date - result.kd)} секунд`);
      } 
    }
    else{  
      await context.send(`У вас нет наживки`)
    }
    
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});
//------------------------------------------------------------------------
//________________Функции_____________________________________________________________________________
//ШАНСЫ ВЫПАДЕНИЯ РЫБЫ
function getFish() {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  if (randomNumber <= 5) {
      return fish[0]; // Выполняем с шансом 5%
  } else if (randomNumber <= 15) {
      return fish[1]; // Выполняем с шансом 10%
  } else if (randomNumber <= 50) {
      return fish[2]; // Выполняем с шансом 35%
  } else if (randomNumber <= 65) {
      return fish[3]; // Выполняем с шансом 15%
  } else {
      return fish[4]; // Не выполняем никакого действия с шансом 35%
  }
}



//ШАНСЫ ВЫПАДЕНИЯ МАССЫ РЫБЫ
function getMass() {
  const randomNumberTwo = Math.floor(Math.random() * 100) + 1;
  if (randomNumberTwo <= 1) {
      return weightMax[5]; // Выполняем с шансом 1% максимальная масса 10кг
  } else if (randomNumberTwo <= 11) {
      return weightMax[3]; // Выполняем с шансом 10% максимальная масса 3 кг
  } else if (randomNumberTwo <= 26) {
      return weightMax[2]; // Выполняем с шансом 15% максимальная масса 2кг 
  } else if (randomNumberTwo <= 31) {
      return weightMax[4]; // Выполняем с шансом 5% максимальная масска 7.2кг
  } else {
      return weightMax[0]; //Выполняем с шансом 69% максимальная масса 0.5кг
  }
}
//СЧИТАЕТ ЦЕНУ ВЫЛОВЛЕННОЙ РЫБЫ
function sellets(weight1, fish) {
  let coefficient
  if (fish == 'Порванный сапог') {
      coefficient = 0.0
// вот бы сюда переменную для каждого человека что бы покахзывало количетво пойманых порванныйх сапоговы
  } else if (fish == 'Карп-кои') {
      coefficient = 3.0
  } else if (fish == 'Окунь') {
      coefficient = 0.4
  } else if (fish == 'Щука') {
      coefficient = 1.0
  } else if (fish == 'Карась') {
      coefficient = 0.55
  }

  let firstSumm = Math.round(weight1 * coefficient * 1000);
  return firstSumm
}
const sendGreetingMessage = async () => {
  const now = new Date();
  if (now.getUTCHours() === 21 && now.getUTCMinutes() >= 0 && now.getUTCMinutes() <= 0) { // Проверка времени (00:00)
      
       try {
       /*  await client.connect()
        const b = await db.findOne();
        await db.updateMany(,$inc: attemps: 10); */
        await client.connect();
        const db = client.db('fish');
        const collection = db.collection('users');
        await collection.updateMany({}, {$set: {attempsCheck: 1}});
        
      } 
       finally {
       await client.close();
       }
      
      console.log("Попытки были начислены")
  }
};
//



//ВЫЗОВ ФУНКЦИЙ
setInterval(sendGreetingMessage, 60 * 1000); 

       /* "vk1.a._PriFVkp0TNx5JxZIAwT9ko_txEuEKxL0KOCTt2Ou1_9KeRWq1QbhIelM3ZsyujrHgC45AM06bmQzzHb328DPAJXPjcUxM5qf3imSveYlAA_nsLndGRIIhHa2WFMqWRK0da6HKy2Uynf51S8kk31-W-VS4ddiEJ9HEAQDBYF8wi5k8gIh05tC4eSmqsLeRcxdogPJevHla_mhI-qIYL5TQ" - рыбалка
       
       
       vk1.a.XNs1qmUkvhg4nrJdJUxljk-NxPWbMIANo1D713ImaQiJOIoNwfbwZzr-NzR79UyRFgVwkgsjQa0aPgBRtrtkX_i9OH1tqs6mq2sx97lT5pRRAWzvNc5u17NyzVEh92HQJXH1YBOmaFN-61VNuQNez5TGBVqYBvLKO3HgmUIIFKMrBF8iYHsiEVZdQG8oHH_nrVfzhlbTWruBqBJY5A3p1A - нтм
       */