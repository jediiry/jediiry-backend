const { ObjectId } = require("mongodb");
const db = require("../database/index");
const {
  hashCredential,
  compareCredential,
  encodeToken,
} = require("../helpers/index");

const userController = {
  async signUp(req, res) {
    try {
      let { email, password, phoneNumber, firstName, middleName, lastName } =
        req.body;
      const checkEmail = await db.userModel.findOne({
        $or: [{ email: email }, { phoneNumber: phoneNumber }],
      });
      if (checkEmail)
        throw new Error("User with the Above credentials already exist");
      password = await hashCredential(password);
      const newUser = await db.userModel.insertOne({
        email,
        phoneNumber,
        password,
        firstName,
        lastName,
        middleName,
      });
      if (!newUser) throw new Error("Unable to Create User");
      res.status(201).json({ message: "Account Created Successfully" });
    } catch ({ message }) {
      res.status(401).json({ message });
    }
  },
  async signIn(req, res) {
    try {
      const { email, password } = req?.body;
      const checkEmail = await db.userModel.findOne({ email: email });
      if (!checkEmail) throw new Error("Kindly verify your login credentails");
      const isValid = await compareCredential({
        newPassword: password,
        oldPassword: checkEmail?.password,
      });
      if (!isValid) throw new Error("Kindly verify your login credentails");

      const token = encodeToken({
        _id: checkEmail._id,
        firstName: checkEmail.firstName,
        lastName: checkEmail.lastName,
        middleName: checkEmail.middleName,
        phoneNumber: checkEmail.phoneNumber,
      });

      delete checkEmail.password;

      res.status(200).json({
        message: "Sign in Successfully",
        token: token,
        user: checkEmail,
      });
    } catch ({ message }) {
      res.status(401).json({ message });
    }
  },
  async transfer(req, res) {
    try {
      const { amount, accountNumber } = req.body;
      const currentUser = req.currentUser;

      if (amount <= 0 || typeof amount != "number")
        throw new Error("Invalid Amount");
      const getUser = await db.userModel.findOne({
        phoneNumber: accountNumber,
      });
      if (!getUser) throw new Error("Invalid Account");
      if (getUser._id == currentUser._id)
        throw new Error("You can't transfer to yourself");
      await this.debit(currentUser._id, { ...getUser, amount: amount });
      await this.credit(getUser._id, { ...currentUser, amount: amount });

      res.status(201).json({ message: "Transfer Successfully" });
    } catch ({ message }) {
      res.status(401).json({ message });
    }
  },
  async debit(_id, payload) {
    const checkAccount = await db.walletModel.findOne({
      user_id: new ObjectId(_id),
    });
    if (!checkAccount || checkAccount.account < payload.amount)
      throw new Error("Insufficient Balance");
    const wallet = await db.walletModel.findOneAndUpdate(
      { user_id: new ObjectId(_id) },
      { $inc: { account: -payload.amount } }
    );
    if (!wallet)
      throw new Error("Unavaliable at the Moment Please try again later");
    await db.transactionModel.insertOne({
      amount: payload.amount,
      type: "debit",
      user_id: new ObjectId(_id),
      time: Date.now(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      middleName: payload.middleName,
    });
  },
  async credit(_id, payload) {
    const wallet = await db.walletModel.findOneAndUpdate(
      { user_id: new ObjectId(_id) },
      { $inc: { account: payload.amount } },
      { upsert: true }
    );
    if (!wallet)
      throw new Error("Unavaliable at the Moment Please try again later");
    await db.transactionModel.insertOne({
      amount: payload.amount,
      type: "credit",
      user_id: new ObjectId(_id),
      time: Date.now(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      middleName: payload.middleName,
    });
  },
  async getTransfers(req, res) {
    try {
      const {
        page = 1,
        size = 10,
        search = null,
        user_id = null,
        type = null,
      } = req.query;

      const numToSkip = (page - 1) * size;
      const limit = size;

      let query = {};
      search
        ? (query = {
            ...query,
            ...{ search: { $regex: search, $options: "i" } },
          })
        : null;
      user_id ? (query = { ...query, user_id: new ObjectId(user_id) }) : null;
      type ? (query = { ...query, type: type }) : null;
      const transactions = await db.transactionModel
        .find(query)
        .skip(numToSkip)
        .limit(limit)
        .toArray();

      res
        .status(200)
        .json({ message: "Successful", transactions: transactions });
    } catch ({ message }) {
      res.status(401).json({ message });
    }
  },
  async getUserTransactions(req, res) {
    try {
      const { page = 1, size = 10, search = null, type = null } = req.query;
      const currentUser = req.currentUser;

      const numToSkip = (page - 1) * size;
      const limit = size;

      let query = { user_id: new ObjectId(currentUser._id) };
      search
        ? (query = {
            ...query,
            ...{ search: { $regex: search, $options: "i" } },
          })
        : null;
      type ? (query = { ...query, type: type }) : null;
      const transactions = await db.transactionModel
        .find(query)
        .skip(numToSkip)
        .limit(limit)
        .toArray();

      res
        .status(200)
        .json({ message: "Successful", transactions: transactions });
    } catch ({ message }) {
      res.status(401).json({ message });
    }
  },
};

module.exports = userController;
