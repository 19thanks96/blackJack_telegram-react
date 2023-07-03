const gameState = require('./gameState')

function calculateHand(cards) {
    console.log(cards, 'card')
    let score = 0;
    for (let card = 0; card < cards.length; card++) {
    switch (cards[card]) {
        case 'A':
            score += 1;
        break;
        case 'J':
            score += 2;
        break;
        case 'Q':
            score += 3;
        break;
        case 'K':
            score += 4;
        break;
        default:
            score += Number(cards[card]);
        break;
        }
    }
return score;
}

function isBlackJack() {
    const playerScore = calculateHand(gameState.playerCards);
    if (playerScore === 21) {
        return true;
    }
    return false
}

function isTooMuch() {
    return calculateHand(gameState.playerCards) > 21 
}

function isDraw() {
    const playerScore = calculateHand(gameState.playerCards);
    const dealerScore = calculateHand(gameState.dealerCards);
    return playerScore === dealerScore
}

function isWin() {
    const playerScore = calculateHand(gameState.playerCards);
    const dealerScore = calculateHand(gameState.dealerCards);
    return dealerScore > 21 || playerScore > dealerScore
}



module.exports = {isBlackJack, isTooMuch, isDraw, isWin, calculateHand}