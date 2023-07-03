import React from 'react';
import card from './card.png'

class TwentyOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
      playerCards: [],
      dealerCards: [],
      wallet: 1000,
      initialRate: 10,
      name: '',
      showDealerCards: false,
      rememberMe: false,
      gameStarted: false,
      gameOver: false,
      result: '',
    };
  }

  setName = (event) => {
    this.setState({ name: event.target.value });
  };

  startGame = () => {
    this.setState({ gameStarted: true, gameOver: false });
    this.resetGame();
    this.dealCards();
  };

    resetGame = () => {
      if(this.state.wallet - this.state.initialRate < 0) {
        this.setState({
          initialRate: 100
          })
      }
        this.setState({
        gameStarted: true, 
        gameOver: false,
        playerCards : [this.getCard(), this.getCard()],
        dealerCards : [this.getCard(), this.getCard()],
        result: '',
        });
    };

  dealCards = () => {
    const playerCards = [this.getCard(), this.getCard()];
    const dealerCards = [this.getCard(), this.getCard()];

    let wallet = this.state.wallet
    let initialRate = this.state.initialRate

    this.setState({ playerCards, dealerCards });

    if (this.calculateHand(playerCards) === 21) {
      this.setState({
        gameOver: true,
        result: 'You win! Blackjack!',
        wallet: wallet + initialRate,
      });
    }
  };

  getCard = () => {
    const { deck } = this.state;
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck[randomIndex];
    return card;
  };

  calculateHand = (cards) => {
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
  };

  hit = () => {
    const { playerCards } = this.state;
    const newCard = this.getCard();
    playerCards.push(newCard);
    this.setState({ playerCards });

    const playerScore = this.calculateHand(playerCards);
    if (playerScore > 21) {
      this.setState({
        gameOver: true,
        result: 'You lose! Bust!',
        wallet: this.state.wallet - this.state.initialRate,
      });
    }
    console.log(playerCards)
  };

  stand = () => {
    const { dealerCards } = this.state;
    while (this.calculateHand(dealerCards) < 17) {
      dealerCards.push(this.getCard());
    }

    const playerScore = this.calculateHand(this.state.playerCards);
    const dealerScore = this.calculateHand(dealerCards);

    if (dealerScore > 21 || playerScore > dealerScore) {
      this.setState({
        gameOver: true,
        result: `You win!, Dealer score: ${dealerScore}`,
        wallet: this.state.wallet + this.state.initialRate,
      });
    } else if (playerScore < dealerScore) {
      this.setState({
        gameOver: true,
        result: `You lose!, Dealer score: ${dealerScore}`,
        wallet: this.state.wallet - this.state.initialRate,
      });
    }
  };

  upRate = () => {
    if(this.state.wallet > 0) {
      this.setState({
    initialRate: this.state.initialRate + 10
    })
    } else {
      this.setState({
        initialRate: 100
        })
    }
    
  }

  downRate = () => {
    if(this.state.wallet > 0) {
      this.setState({
      initialRate: this.state.initialRate - 10
      })
    }
  }

  handleChangeName = (event) => {
    this.setState({ name: event.target.value });
  };

  handleRememberMe = () => {
    this.setState((prevState) => ({ rememberMe: !prevState.rememberMe }));
  };

  render() {
    const { name, wallet, playerCards, dealerCards, gameStarted, gameOver, result, rememberMe, showDealerCards  } = this.state;

    return (
    <div>
        <h1>Blackjack Game</h1>
        {!rememberMe && (<>
        <input type="text" value={name} onChange={this.handleChangeName} />
        <button type="button" onClick={this.handleRememberMe}>
        Remember me
        </button></>)}
        {name && rememberMe && (<p>Welcome, {name}!</p>)}
        
        <p>Wallet: ${wallet}</p>
        
        {gameStarted && (
        <>
            
            <h2>Your Cards:</h2>
            <ul>
            {playerCards.map((card, index) => (
                <li key={index}>{card}</li>
            ))}
            {this.calculateHand(playerCards)}
            <button onClick={() => this.hit()}>hit</button>
            <button onClick={() => this.stand()}>stand</button>
            </ul>
            <h2>Dealer's Cards:</h2>
            <ul>
            {showDealerCards ? ( dealerCards.map((card, index) => (
                <li key={index}>{card}</li>
            ))) : (<>{dealerCards[0]}
            
            </>)}
            {this.calculateHand([dealerCards[0]])}
            </ul>
            {gameOver && (
                <>
                    <p>Game Over. Result: {result}</p>
                    <button onClick={() => this.resetGame()}>Restart Game</button>
                    <p>Rate: ${this.state.initialRate}</p>
          <button onClick={() => this.upRate()}>Up rate</button>
          <button onClick={() => this.downRate()}>Down rate</button>
                </>
            )
            }
        </>
        )} 
        {!gameStarted && !gameOver && (
        <p>
          
          <button onClick={this.startGame}>Start Game</button>
          <p>Rate: ${this.state.initialRate}</p>
          <button onClick={() => this.upRate()}>Up rate</button>
          <button onClick={() => this.downRate()}>Down rate</button>
        </p>
        )}
    </div>
    );
}
}

export default TwentyOne