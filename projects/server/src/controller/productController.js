const db = require("../sequelize/models");
const { Op } = require("sequelize");
const HTTPStatus = require("../helper/HTTPStatus");
const { sequelize } = require("../sequelize/models");
const deleteFiles = require("../helper/deleteFiles");

module.exports = {
	deleteProduct: async (req, res) => {},
	createProduct: async (req, res) => {
		const { uid } = req.uid;
		const { name, price, category_id, stock, unit_id, description } =
			JSON.parse(req.body.data);
		const t = await sequelize.transaction();
		try {
			const admin = await db.user.findOne({
				where: { uid },
				include: { model: db.branch },
			});
			const product = await db.product.create(
				{
					name,
					price,
					category_id,
					unit_id,
					description,
					img: req.files.images[0].path,
				},
				{ transaction: t }
			);

			await db.branch_product.create(
				{
					stock,
					branch_id: admin.branch.id,
					product_id: product.id,
				},
				{ transaction: t }
			);
			await db.stock_history.create(
				{
					stock,
					branch_id: admin.branch.id,
					product_id: product.id,
				},
				{ transaction: t }
			);
			await t.commit();
			new HTTPStatus(res).success("Product created").send();
		} catch (error) {
			await t.rollback();
			deleteFiles(req.files.images[0].path);
			new HTTPStatus(res, error).error(error.message, 400).send();
		}
	},
	getSuggested: async (req, res) => {
		try {
			const data = await db.transaction.findAll({
				attributes: [
					[
						sequelize.fn("COUNT", sequelize.col("product_name")),
						"total_transaction",
					],
				],
				limit: 10,
				include: [
					{
						model: db.product,
						attributes: ["id", "name", "img", "price", "description"],
						include: [{ model: db.unit }],
					},
					{ model: db.branch, attributes: ["id", "location"] },
				],
				group: ["product_name"],
				order: [["total_transaction", "DESC"]],
			});
			new HTTPStatus(res, data).success("Get best seller product").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message, 400).send();
		}
	},
	getRandom: async (req, res) => {
		try {
			const data = await db.branch_product.findAll({
				where: { branch_id: 1 },
				include: [
					{
						model: db.product,
					},
					{ model: db.branch },
				],
				offset: Math.floor(Math.random() * 155),
				limit: 10,
			});
			res.status(200).send({
				isError: false,
				message: "Get All Product",
				data,
			});
		} catch (error) {
			res.status(400).send({
				isError: false,
				message: error.message,
				data: error,
			});
		}
	},
	totalPage: async (req, res) => {
		const { branch } = req.query;
		try {
			const data = await db.branch_product.count({
				where: { branch_id: branch },
			});
			res.status(200).send({
				isError: false,
				message: "Get Total Page",
				data,
			});
		} catch (error) {
			res.status(400).send({
				isError: false,
				message: error.message,
				data: error,
			});
		}
	},
	getCategory: async (req, res) => {
		try {
			const data = await db.category.findAll();
			res.status(200).send({
				isError: false,
				message: "Get All Category",
				data,
			});
		} catch (error) {
			res.status(400).send({
				isError: false,
				message: error.message,
				data: error,
			});
		}
	},
	product_detail: async (req, res) => {
		const { branch, product } = req.query;
		try {
			const data = await db.branch_product.findAll({
				where: {
					[Op.and]: [{ branch_id: branch }, { product_id: product }],
				},
				include: [{ model: db.branch }, { model: db.product }],
			});

			res.status(201).send({
				isError: false,
				message: "Get Product Detail",
				data,
			});
		} catch (error) {
			res.status(404).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	totalPageCategory: async (req, res) => {
		const { branch, category } = req.query;
		try {
			const data = await db.branch_product.count({
				where: {
					branch_id: branch,
				},
				include: {
					model: db.product,
					where: { category_id: category },
				},
			});
			res.status(201).send({
				isError: false,
				message: "Total Page Category",
				data,
			});
		} catch (error) {
			res.status(404).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	getAllUnit: async (req, res) => {
		const { category } = req.query;
		try {
			const data = await db.product.findAll({
				where: {
					category_id: category,
				},
				include: {
					model: db.unit,
				},
			});
			res.status(201).send({
				isError: false,
				message: "Get All Product by Category",
				data,
			});
		} catch (error) {
			res.status(404).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	sortby: async (req, res) => {
		const { branch, category, page, sortby } = req.query;
		const sort = sortby ? sortby.split("-") : "";
		try {
			if (sort[0] === "name") {
				const data = await db.product.findAll({
					where: {
						category_id: category,
					},
					include: [
						{
							model: db.branch_product,
							where: { branch_id: branch },
							include: {
								model: db.branch,
							},
						},
					],
					order: [["name", sort[1]]],
					offset: page == 1 ? 0 : page * 10 - 10,
					limit: 10,
				});
				res.status(201).send({
					isError: false,
					message: "Get Product by Sort Success",
					data,
				});
			} else if (sort[0] === "price") {
				const data = await db.product.findAll({
					where: {
						category_id: category,
					},
					include: [
						{
							model: db.branch_product,
							where: { branch_id: branch },
							include: {
								model: db.branch,
							},
						},
					],
					order: [["price", sort[1]]],
					offset: page == 1 ? 0 : page * 10 - 10,
					limit: 10,
				});
				res.status(201).send({
					isError: false,
					message: "Get Product by Sort Success",
					data,
				});
			} else if (sort === "") {
				const data = await db.product.findAll({
					where: {
						category_id: category,
					},
					include: [
						{
							model: db.branch_product,
							where: { branch_id: branch },
							include: {
								model: db.branch,
							},
						},
					],
					offset: page == 1 ? 0 : page * 10 - 10,
					limit: 10,
				});
				res.status(201).send({
					isError: false,
					message: "Get Product by Sort Success",
					data,
				});
			}
		} catch (error) {
			res.status(404).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
};
