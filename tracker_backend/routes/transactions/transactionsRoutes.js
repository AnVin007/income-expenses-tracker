const express = require("express");
const {
  createTransactionCtrl,
  getFilteredTransactionsCtrl,
  deleteTransactionCtrl,
  updateTransactionCtrl,
} = require("../../controllers/transactions/transactionsController");
const isAuth = require("../../middlewares/isAuth");

//* Create Router from express package
const transactionRoutes = express.Router();

//(POST) Create Transaction: /api/v1/transactions/create
transactionRoutes.post("/create", isAuth, createTransactionCtrl);

//(GET) Get all Transaction: /api/v1/transactions/filter
transactionRoutes.get("/filter", isAuth, getFilteredTransactionsCtrl);

//(DELETE) Delete single Transaction: /api/v1/transactions/delete/:id
transactionRoutes.delete("/delete/:id", isAuth, deleteTransactionCtrl);

//(PUT) Update single Transaction: /api/v1/transactions/update/:id
transactionRoutes.put("/update/:id", isAuth, updateTransactionCtrl);

module.exports = transactionRoutes;
