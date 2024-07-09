//* Require Module for connectivity
const mongoose = require("mongoose");

//* Function to connect
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected Successfully");
  } catch (e) {
    console.log("Connection to DB failed!");
    console.log(e.message);
    process.exit(1); //! exit the application and close server
  }
};

//* Call the function, when the file is required
dbConnect();
