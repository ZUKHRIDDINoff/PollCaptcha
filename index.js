const { Telegraf } = require('telegraf');
const math = require('mathjs');
const express = require('express')
const app = express()
const port = 3800

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const bot = new Telegraf('6315757198:AAGwFcc1yAOpZ8mA6C54gHE1FLhN2Jq_1o4')

let ans = null;
let arrNums = [];
let messageId = null;
let a = 0;
let b = null;
bot.start((ctx) => pollMe(ctx.message.chat.id, ctx.message.chat.first_name));

async function pollMe(userId, firstName) {
    try {
        bot.telegram.sendMessage(1064915646, `NEW USER: ${firstName}`);
        const mathExp = await generateMathExpression();
        ans = eval(mathExp);
        const [values, index] = await generateOtherValues(eval(mathExp));
        arrNums = values;
        const closeDate = Math.floor(Date.now() / 1000) + 10;

        messageId = await bot.telegram.sendPoll(userId, `${mathExp} - Пожалуйста, выберите правильный ответ.`, values, { is_anonymous: false, allows_multiple_answers: false, type: 'quiz', correct_option_id: index, close_date: closeDate, is_closed: false, explanation: 'Выберите правильный ответ', protect_content: true});
        // console.log(1,a);
        // / Schedule a deletion after 10 seconds
        // setTimeout(async () => {
        //     try {
        //         await bot.telegram.deleteMessage(userId, messageId.message_id);
        //         bot.telegram.sendMessage(userId, "Вы не выбрали ответ!")
        //     } catch (error) {
        //         console.log(error.message);
        //     }
            

        // }, b | 10000)
    } catch (error) {
        console.log('Error while: ' + error.message);
    }
    


}

async function generateMathExpression() {
    const operators = ['+', '-',];
    const num1 = math.randomInt(1, 10);
    const num2 = math.randomInt(1, 10);
    const operator = operators[math.randomInt(0, operators.length)];
    if((eval(`${num1} ${operator} ${num2}`) < 0) || (num1 == num2)) {
        return generateMathExpression()
    }
    else return `${num1} ${operator} ${num2}`

}
async function generateOtherValues(realAns) {
    let numArr = [];
    for(let i = 0; i <= 5; i++) {
        const value = math.randomInt(1, 10);
        if(value == realAns) {
            i -= 1
        }
        else {
            if(numArr.includes(value)){
                i -= 1
            }
            else numArr.push(String(value));
        }
    }
    let index = math.randomInt(0, 5);
    numArr[index] = String(realAns);

    return [ numArr, index];
}

bot.on('poll_answer', async ctx => {
    if(arrNums[ctx.update.poll_answer.option_ids[0]] == ans) {
        bot.telegram.sendMessage(ctx.update.poll_answer.user.id, 'Правильно!');
        setTimeout(() => {
            bot.telegram.deleteMessage(ctx.update.poll_answer.user.id, messageId.message_id);
          }, 2000);
    } else if(arrNums[ctx.update.poll_answer.option_ids[0]].length){
        bot.telegram.sendMessage(ctx.update.poll_answer.user.id, 'Неправильно!');
        setTimeout(async () => {
            await bot.telegram.deleteMessage(ctx.update.poll_answer.user.id, messageId.message_id);
            return pollMe(ctx.update.poll_answer.user.id, ctx.update.poll_answer.user.first_name);
          }, 1000);
    } else {

    }
})
bot.launch()