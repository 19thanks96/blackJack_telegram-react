const {fetchBalance, createUser, updateRate, updateBalance, winRate} = require('./api')
const gameState = require('./gameState')
const {getCard} = require('./dealCards')
const {calculateHand} = require('./calculateHand')
const {resetRate} = require('./api')
let user;

async function setUser(thisUser) {
    user = thisUser;
    await createUser(user)
    await resetRate(user)
    return user
}

async function getBalance() {
    return await fetchBalance(user)
}


async function raiseRate() {
    let rate = await updateBalance(user)
    console.log('raiseRate, rate', rate)
    return rate
}

function startGame() {
    gameState.playerCards = [getCard(), getCard()];
    gameState.dealerCards = [getCard(), getCard()];
    return gameState
}
function hit() {
    gameState.playerCards.push(getCard());
}
function stand() {
    let dealerScore = calculateHand(gameState.dealerCards);

    while (dealerScore < 17) {
        let newCard = getCard()
        console.log(gameState.dealerCards)
        gameState.dealerCards.push(newCard);
        dealerScore = calculateHand(gameState.dealerCards)
    }
}
function handleWin() {
    winRate(user, 1)
}

function handleDraw() {
    winRate(user, 0.5)
}


module.exports = {  
    setUser,
    getBalance,
    raiseRate,
    startGame,
    hit, 
    stand, 
    handleWin, 
    handleDraw, 
}