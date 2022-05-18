require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connect");
const app = express();


const ProductRoutes = require("./routes/product");

app.use("/api/v1", ProductRoutes);

const connectServe = async () => {
	try {
		await app.listen(3000, () => console.log("Server listening at port 3000"));
		await connectDB(process.env.ATLAS_DB);
		console.log("Database connect");
	} catch (err) {
		console.log(err);
	}
}

connectServe();
