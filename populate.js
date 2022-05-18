require("dotenv").config();
const connectDB = require('./db/connect');
const Product = require("./models/product");

const productJSON = require("./products.json")

const start = async () => {
	try {
		await connectDB(process.env.ATLAS_DB);
		await Product.deleteMany();
		const result = await Product.create(productJSON);
		console.log({msg: "Operation done", result});
	} catch (err) {
		console.log(err);
	}
}

start();
