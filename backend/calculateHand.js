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

module.exports = { calculateHand }