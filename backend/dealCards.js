const deck = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function getCard() {
    return deck[Math.floor(Math.random() * deck.length)];
}



module.exports = {getCard, deck}