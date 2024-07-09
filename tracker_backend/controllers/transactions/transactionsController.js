const Transaction = require("../../models/Transaction");
const User = require("../../models/User");
const appErr = require("../../utils/appErr");

//*===========================================================
//* ------> Create Transaction Controller
const createTransactionCtrl = async (req, res, next) => {
  // destructure the body field
  const { type, category, amount, date, description } = req.body;
  // Check if all required parameters exists
  if (!type || !amount || !date) {
    return next(appErr("All required fields could not be empty"));
  }

  try {
    //! 1. Find the Logged in user
    //* After checking "isAuth" middleware --> req.user will contain Id of logged in user
    const userFound = await User.findById(req.user);

    if (!userFound) {
      return next(appErr("User not Found!", 404));
    }

    //! 3. Create Transaction
    const transaction = await Transaction.create({
      type,
      category,
      amount,
      description,
      user: req.user,
    });

    res.status(201).json({
      status: "successful",
      data: transaction,
    });
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//*===========================================================
//* ------> Filter Transactions Controller
const getFilteredTransactionsCtrl = async (req, res, next) => {
  // destructure the query fields
  const { startDate, endDate, type, category } = req.query;

  try {
    //* Mandatory filter:  user ID
    let filters = { user: req.user };

    //* Optional Filters. filters is an object where you can add properties
    if (startDate) {
      //! date is greater or equal to start date
      filters.date = { ...filters.date, $gte: new Date(startDate) };
    }

    if (endDate) {
      //! date is less or equal to end date
      filters.date = { ...filters.date, $lte: new Date(endDate) };
    }

    if (type) {
      filters.type = type;
    }

    if (category) {
      if (category === "All") {
        //! No category filter needed when filtering for "All"
      } else if (category === "Uncategorized") {
        filters.category = "Uncategorized";
      } else {
        filters.category = category;
      }
    }

    //Find all transactions based on filters and sort them by Date (newest first)
    const transactions = await Transaction.find(filters).sort({ date: -1 });

    res.json({
      status: "successful",
      data: transactions,
    });
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//*===========================================================
//* ------> Delete Transaction Controller
const deleteTransactionCtrl = async (req, res, next) => {
  //* After checking "isAuth" middleware --> req.user will contain Id of logged in user
  try {
    //! 1. Find the transaction by id
    const transaction = await Transaction.findById(req.params.id);
    //! 2. Check if transaction found
    if (!transaction) {
      return next(appErr("Transaction not found", 404));
    }
    //! 3. Check if user id assigned to transaction is equal to User's id who want to DELETE
    if (transaction && transaction.user.toString() === req.user.toString()) {
      //! 4. Delete
      await Transaction.findByIdAndDelete(req.params.id);

      //! 5. Send the response
      res.json({
        status: "successful",
        data: "Transactions removed",
      });
    }
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//*===========================================================
//* ------> Update Transaction Controller
const updateTransactionCtrl = async (req, res, next) => {
  //* After checking "isAuth" middleware --> req.user will contain Id of logged in user
  try {
    //! 1. Find the transaction by id
    const transaction = await Transaction.findById(req.params.id);
    //! 2. Check if transaction found
    if (!transaction) {
      return next(appErr("Transaction not found", 404));
    }
    //! 3. Check if user id assigned to transaction is equal to User's id who want to UPDATE
    if (transaction.user.toString() === req.user.toString()) {
      // assign the new value to transaction or leave the same
      (transaction.type = req.body.type || transaction.type),
        (transaction.category = req.body.category || transaction.category),
        (transaction.amount = req.body.amount || transaction.amount),
        (transaction.date = req.body.date || transaction.date),
        (transaction.description =
          req.body.description || transaction.description);

      //! 4. re-save the transaction
      const updatedTransaction = await transaction.save();

      //! 5. Send the response
      res.json({
        status: "successful",
        data: updatedTransaction,
      });
    }
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//* Export modules
module.exports = {
  createTransactionCtrl,
  getFilteredTransactionsCtrl,
  deleteTransactionCtrl,
  updateTransactionCtrl,
};
