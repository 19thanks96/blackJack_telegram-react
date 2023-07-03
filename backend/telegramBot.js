const express = require('express')
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const gameController = require('./gameController');
const gameState = require('./gameState')
const gameLogic = require('./gameLogic')
const{resetRate} = require('./api')

let balance;
const app = express()
const port = 4000
const bot = new Telegraf("6298128552:AAH4Ju-bg6SRl6JyGPMcg41mqas-DG3RBdI");
let user;

bot.start(async (ctx) => {
    console.log(`BOT receieved start command`)
    user = ctx.message.chat.username
    await gameController.setUser(user)
    await ctx.reply(`Привіт, ${ctx.message.chat.first_name}`)
    try{
        balance = await gameController.getBalance()
        gameState.cash = Number(balance) 
        console.log('BOT my start balance',balance)

        await ctx.reply(`Баланс: ${balance.toString()}`)
        await raiseRateOrStartGameMenu(ctx)
    } catch(error) {
        await ctx.reply('error start bot', error)
        console.log('сервер чіллить, бо',error)
    }
    
});

bot.action('raise-rates', async (ctx) => {
    let wallet = await gameController.raiseRate(user)
    console.log('bot: bot reply wallet', wallet)
    gameState.cash = Number(wallet.balance) - 10
    gameState.currentRate = Number(wallet.rate) + 10
    balance = await gameController.getBalance()
    await ctx.reply(`Баланс: ${balance.toString()}`)
    await raiseRateOrStartGameMenu(ctx)
})

bot.action('start-game', async (ctx) => {
    gameController.startGame()
    await ctx.reply(`Ваші карти: ${gameState.playerCards.join(', ')}, 
    а це ${gameLogic.calculateHand(gameState.playerCards)} очок
    Карта діллера: ${gameState.dealerCards[0]}`);
    await showHitOrStandMenu(ctx)
})

async function showHitOrStandMenu(ctx) {
    await ctx.reply('Що ви хочете зробити', {
        reply_markup: {
            inline_keyboard: [
            [{ text: 'Взяти карту', callback_data: 'hit' }],
            [{ text: 'Зупинитись', callback_data: 'stand' }]
            ]
        }
    });
}


bot.action('hit', async (ctx) => {
    gameController.hit()
    if(gameLogic.isBlackJack()) {
        await ctx.reply('Вітаю! У вас Blackjack!');
        await ctx.reply('Ви перемогли!');
        gameController.handleWin()
        await endGame(ctx)
        return;
    } else if(gameLogic.isTooMuch()) {
        await ctx.reply(`У вас перебор! ${gameLogic.calculateHand(gameState.playerCards)} очок`);
        await ctx.reply('Ви програли!');
        await endGame(ctx)
        return;
    } else{
        await ctx.reply(`Ваші карти: ${gameState.playerCards.join(', ')}, 
        а це ${gameLogic.calculateHand(gameState.playerCards)} очок
        Карта діллера: ${gameState.dealerCards[0]}`);
        await showHitOrStandMenu(ctx)
    }
    

});

bot.action('stand', async (ctx) => {
    gameController.stand()
    //playerScore = calculateHand(gameState.playerCards);
    //dealerScore = calculateHand(gameState.dealerCards);
    //await ctx.reply(`Ваши карты: ${gameState.playerCards.join(', ')}, а це ${calculateHand(gameState.playerCards)} очок`);
    //await ctx.reply(`Карта дилера: ${gameState.dealerCards.join(', ')}, a це ${calculateHand(gameState.dealerCards)} очок`);
    await ctx.reply(`Ваші карти: ${gameState.playerCards.join(', ')}, а це ${gameLogic.calculateHand(gameState.playerCards)} очок`);
    await ctx.reply(`Карта діллера: ${gameState.dealerCards.join(', ')}, a це ${gameLogic.calculateHand(gameState.dealerCards)} очок`);
    
    if(gameLogic.isDraw()) {
        gameController.handleDraw()
        await ctx.reply('Нічья!');
    }
    if(gameLogic.isWin()) {
        gameController.handleWin()
        await ctx.reply('Ви перемогли!');
    } else {
        await ctx.reply('Ви програли!');
    }
    await endGame(ctx)
});

bot.action('restart', async(ctx) => {
    balance = await gameController.getBalance()
    await ctx.reply(`Баланс: ${balance.toString()}`)
    bot.start()
} )

async function raiseRateOrStartGameMenu(ctx){
    await ctx.reply(`Час обрати ставку, ставка ${gameState.currentRate}$`, {
        reply_markup: {
            inline_keyboard: [
            [{ text: 'Підняти стаку', callback_data: 'raise-rates' }],
            [{ text: 'Почати гру', callback_data: 'start-game' }]
            ]
        }
    });
}

async function endGame(ctx) {
    let answer = await resetRate(user)
    console.log('BOT  resetRate in bot', answer)
    gameState.currentRate = 10;
    await raiseRateOrStartGameMenu(ctx)
}

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})