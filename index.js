import { VK, Keyboard } from "vk-io";
import { MongoClient } from "mongodb";
import fs from 'fs';


// Переменные
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
//______________________________________________________НАЧАЛО___________________________________________
//стартовая отладка
vk.updates.start().then(() => {
  console.log("Бот Запущен " + now);
});

//БАЗОВЫЕ ОТВЕТЫ НА СООБЩЕНИЯ
vk.updates.on('message', async (context, next) => {
  if (context.isGroup) return;
  try {
    await client.connect();
    await db.insertOne({ "id": context.senderId, "balance_real": 0, "balance_fake": 0, kd: 0 });
  } catch (err) {
    await context.reply("Ошибка в базе данных, напишиье админу а");
    console.log(err);
  } finally {
    await client.close();
  }
})

vk.updates.hear('.продать всю рыбу', (context) => {
  context.send("В разработке....")

});
vk.updates.hear('.другое', (context) => {
  context.send("В разработке....")
});



vk.updates.hear('.рыбалка', (context) => {
  if (a == 1) {
      console.log("Пользователь начал рыбалку " + now)
      context.send(`Вы начали рыбалку`);
      a = 0
      setTimeout(() => {

          const fish = getFish();
          const weightMax = getMass();
          let weight1 = Math.random() * (weightMax - weightMin) + weightMin;
          weight1 = Math.round(weight1 * 1000) / 1000;
          if (fish == 'Порванный сапог') {
              weight1 = 0.100;
          }
          const resultFirstSumm = sellets(weight1, fish);
          //resultFirstSumm = "ПЕРВАЯ ПЕРЕМЕННАЯ В МОНГОДБ"
          context.send(`Ваш улов:\n${fish} весом ${weight1} кг.\n\n\n\n\n\n\nЕго цена ${resultFirstSumm} монет`, {});;
          a = 1
      }, 9000)
  } else {
      context.send(`Вы должны дождаться предыдущей поклевки`);
  }
});


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
      // вот бы сюда переменную для каждого челове
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


// Авторизация и запуск бота
vk.updates.start().catch(console.error)