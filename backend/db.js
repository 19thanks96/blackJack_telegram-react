

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);
let collection;

async function connectToDb() {
    try {
        await mongoClient.connect();
        const db = mongoClient.db("blackjack");
        collection = db.collection("users");
    }catch(err) {
        console.log('can`t connect to db', err );
    }
}

async function getBalanceDb(username) {
    const userFromDb = await collection.findOne({username: username})
    console.log('get balance for user, getBalanceDb:', userFromDb.balance)
    return userFromDb.balance
}

async function resetUserRate(username) {
    const userFromDb = await collection.findOne({username: username})
    const result = await collection.findOneAndUpdate({username: username}, { $set: {rate: userFromDb.initialRate}});
    console.log(`DB user reset rate result`, result.value.rate)
    return result.value.rate
}

async function updateWalletDb(username) {
    const userFromDb = await collection.findOne({username: username})
    console.log('updateWalletDb, userFromDb result', userFromDb)

    const money = userFromDb.balance - userFromDb.initialRate
    const rate = userFromDb.rate + 10
    const result = await collection.findOneAndUpdate({username: username}, { $set: {rate: rate, balance: money}});
    console.log('DB updateWalletDb rate', result.value.rate)
    console.log('DB updateWalletDb balance', result.value.balance)

    return result.value
}

async function createUserDb(user) {
    const existingUser = await collection.findOne({username: user})
    console.log('user from db', existingUser)
    if(existingUser === null) {
    console.log('create new user')
        const newUser = {username: user, balance: 1000, rate: 10, initialRate: 10};
        let insertUserResult =  await collection.insertOne(newUser);
        return insertUserResult
    } else {
        return existingUser
    }
    //getBalanceDb(user)
}

async function getRateDb(username) {
    const userFromDb = await collection.findOne({username: username})
    console.log('getRateDb, userFromDb result', userFromDb)
    let newRate = userFromDb.rate + 10
    const result = await collection.findOneAndUpdate({username: username}, { $set: {rate: newRate}});
    console.log('update result', result.value.rate)
    return result.value.rate
}

async function updateWinRate(username, winRate) {
    const userFromDb = await collection.findOne({username: username})
    const newBalance = userFromDb.balance + (userFromDb.rate * (2 * winRate))
    console.log('newBalance', newBalance)
    const result = await collection.findOneAndUpdate({username: username}, { $set: {balance: newBalance}});
    return result.value.balance
}

module.exports = {connectToDb, getBalanceDb, createUserDb, getRateDb, updateWalletDb, resetUserRate, updateWinRate}