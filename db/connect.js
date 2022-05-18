const mongoose = require("mongoose");

const connectDB = async (connectionString) => {
	return mongoose.connect(connectionString);
}

module.exports = connectDB;
