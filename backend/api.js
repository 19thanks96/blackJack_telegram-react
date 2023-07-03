
const url = 'http://localhost:5000'

async function fetchBalance (user)  {
    const response = await fetch(url + '/' + user + '/' + 'balance')
    if(!response.ok) {
        throw new Error('failed to fetch balance')
    }
    const balance = await response.json()
    return balance
}

async function updateBalance(user)  {
    const response = await fetch(url + '/' + user + '/' + 'balance', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }})
    if(!response.ok) {
        throw new Error('failed to update balance')
    }

    const wallet = await response.json()
    console.log('updateBalance, balance from server', wallet)
    
    return wallet
}

async function updateRate(user)  {
    const response = await fetch(url + '/' + user + '/rate', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }})
    if(!response.ok) {
        throw new Error('failed to update balance')
    }
    const rate = await response.json()
    console.log('updateRate, rate from server', rate)
    return rate
}

async function createUser(user) {
    const response = await fetch(url + '/' + user, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }})
    if(!response.ok) {
        throw new Error('failed to create user')
    }    
}   

async function resetRate(user) {
    console.log('BOT requesting reset rate for', user)
    const response = await fetch(url + '/' + user + '/rate/reset', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }})
    if(!response.ok) {
        throw new Error('failed to update rate')
    }

    const rate = await response.json()
    console.log('BOT resetRate, rate from server', rate)
    return rate
}

async function winRate(user, winRate) {
    const response = await fetch(url + '/' + user + '/' + winRate, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }})
    if(!response.ok) {
        throw new Error('failed to update balance winrate')
    }

    console.log('rate from server', await response.body)
    const balance = await response.json()
    return balance
}

module.exports = {fetchBalance, createUser, updateRate, updateBalance, resetRate, winRate}