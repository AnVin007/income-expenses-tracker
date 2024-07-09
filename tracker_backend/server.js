require("dotenv").config(); //! should be requiered before every other module + chain .config() function to get access to all .env constants
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users/usersRoutes");
const transactionRoutes = require("./routes/transactions/transactionsRoutes");
const categoryRoutes = require("./routes/category/categoryRoutes");
const globalErrHandler = require("./middlewares/globalErrHandler");

require("./config/dbConnect"); //! automatically will call the connect function in that file

//* Create an instanse of express
const app = express();

//* CORS configuration --> Make your Front End App trusted
const corsOptions = {
  origin: ["http://localhost:5173"],
};

//* ============-> MIDDLEWARES
app.use(cors(corsOptions)); //! allow to use calls from client side
app.use(express.json()); //! allow to use body parser from incoming data

//* ============-> ROUTES
// --- Users
app.use("/api/v1/users", userRoutes);

// --- Category
app.use("/api/v1/categories", categoryRoutes);

// --- Transaction
app.use("/api/v1/transactions", transactionRoutes);

//* ============-> ERROR HANDLER MIDDLEWARES
app.use(globalErrHandler);

//* ============-> LISTEN SERVER
const PORT = process.env.PORT || 9001;
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
