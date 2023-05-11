const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectDB = () => {
  try {
    client.connect();
    const database = client.db("testDB");
    const userModel = database.collection("user"),
      walletModel = database.collection("wallet"),
      transactionModel = database.collection("transaction");
    return {
      userModel,
      walletModel,
      transactionModel,
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = connectDB();
