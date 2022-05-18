const ProductModel = require("../models/product");

const getAllProducts = async (req, res) => {
	try {
		const data = await ProductModel.find({
		})

		return  res.status(200).json({
			status: true,
			data: data,
			count: data.length
		});
	} catch (err) {
		console.log(err);
		res.status(504).json({err:err});
	}
}

const searchProducts = async (req, res) => {
	try {
		//refactoring the below code
		//const data = await ProductModel.find(req.query) 
		const {featured, company, name, sort, field, numericFields} = req.query;

		const queryObject = {};
		if (featured) queryObject.featured = featured ? true:false;
		if (company) queryObject.company = company;
		if (name) queryObject.name = {$regex: name, $options: 'i'}

		if (numericFields) {
			const operatorMap = {
				'='	:	'$eq',
				'>'	:	'$gt',
				'>=':	'$gte',
				'<'	:	'$lt',
				'<=':	'$lte',
				'!=':	'$ne'
			}
			const regEx = /\b(<|>|>=|=|<|<=)\b/g;
			const availableNumField = ["rating", "price"];
			let filter = numericFields.replace(regEx, (match) => `-${operatorMap[match]}-`);
			filter = filter.split(",").forEach( (f) => {
				const [field, op, value] = f.split("-");

				if (availableNumField.includes(field)) {
					queryObject[field] = {[op]: value}
				}
			});
		}

		// Refactoring the code below for sorting purposes
		//const data = await ProductModel.find(queryObject);
		let productQuery = ProductModel.find(queryObject);

		/* 
 		* 	For sort on params #case_1
 			if (sort) {
				const sortParams = sort.spl...
				productQuery = productQuery.sort(sortParams);
			}
			const data = await ...;
		*/

		const sortParams = sort ? sort.split(",").join(" "):"createdAt"; // default created at #case_2
		productQuery = productQuery.sort(sortParams);

		//selection operation || can be made optional like #case_1
		const fieldList = field ? field.split(",").join(" "):"";
		productQuery = productQuery.select(fieldList);

		//pagination
		const page = Number(req.query.page) || 1; //by default the values in req.query are of string type
		const limit = Number(req.query.limit) || 10;
		const skip = (page - 1) * limit;
		productQuery = productQuery.skip(skip).limit(limit) // the order is important

		const data = await productQuery; // to chain with a promise optionally
		
		return  res.status(200).json({
			status: true,
			params: queryObject,
			sortParams,
			page: {page, limit, skip},
			count: data.length,
			data: data
		});
	} catch (err) {
		console.log(err);
		res.status(504).json({err:err});
	}

}

module.exports = {
	getAllProducts,
	searchProducts
};
