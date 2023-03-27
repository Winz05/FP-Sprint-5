const db = require("../sequelize/models");
const HTTPStatus = require("../helper/HTTPStatus");
const fs = require("fs").promises;
const transporter = require("../helper/transporter");
const handlebars = require("handlebars");
const { Op } = require("sequelize");
const deleteFiles = require("../helper/deleteFiles");
const { sequelize } = require("../sequelize/models");

module.exports = {
	getTransaction: async (req, res) => {
		const { uid } = req.uid;
		try {
			const { id } = await db.user.findOne({ where: { uid } });
			const data = await db.transaction.findAll({
				attributes: [
					"invoice",
					"createdAt",
					"status",
					"product_name",
					[sequelize.fn("SUM", sequelize.col("total_price")), "total_price"],
					[sequelize.fn("COUNT", sequelize.col("product_name")), "total_item"],
				],
				where: { user_id: id },
				include: [{ model: db.branch }, { model: db.product }],
				group: "invoice",
				order: [["createdAt", "ASC"]],
			});
			new HTTPStatus(res, data).success("Get all transaction").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message, 400).send();
		}
	},
	cancel: async (req, res) => {
		const { uid } = req.uid;
		const { invoice } = req.body;
		const t1 = await sequelize.transaction();
		try {
			const { id } = await db.user.findOne({ where: { uid } });
			const result = await db.transaction.findAll({
				where: { invoice },
			});
			result.map(async (value) => {
				const t = await sequelize.transaction();
				try {
					const { stock } = await db.branch_product.findOne({
						where: {
							[Op.and]: [{ branch_id: value.branch_id }, { product_id: value.product_id }],
						},
					});

					await db.branch_product.update(
						{ stock: stock + value.qty },
						{
							where: {
								[Op.and]: [{ branch_id: value.branch_id }, { product_id: value.product_id }],
							},
						},
						{ transaction: t }
					);
					await db.stock_history.create(
						{
							stock: stock + value.qty,
							branch_id: value.branch_id,
							product_id: value.product_id,
						},
						{ transaction: t }
					);
					t.commit();
				} catch (error) {
					t.rollback();
				}
			});
			await db.transaction_history.create({ status: "Canceled", invoice }, { transaction: t1 });
			await db.transaction.update(
				{ status: "Canceled" },
				{ where: { [Op.and]: [{ user_id: id }, { invoice }] } },
				{ transaction: t1 }
			);
			t1.commit();
			const httpStatus = new HTTPStatus(res).success("Status changed to canceled").send();
		} catch (error) {
			t1.rollback();
			const httpStatus = new HTTPStatus(res, error).error(error.message, 400).send();
		}
	},
	received: async (req, res) => {
		const { uid } = req.uid;
		const { invoice } = req.body;
		const t = await sequelize.transaction();
		try {
			const { id } = await db.user.findOne({ where: { uid } });

			await db.transaction_history.create({ status: "Received", invoice }, { transaction: t });
			await db.transaction.update(
				{ status: "Received" },
				{ where: { [Op.and]: [{ user_id: id }, { invoice }] } },
				{ transaction: t }
			);
			t.commit();
			const httpStatus = new HTTPStatus(res).success("Status changed to received").send();
		} catch (error) {
			t.rollback();
			const httpStatus = new HTTPStatus(res, error).error(error.message, 400).send();
		}
	},
};
