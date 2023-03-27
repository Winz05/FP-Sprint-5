const { Op } = require("sequelize");
const HTTPStatus = require("../helper/HTTPStatus");
const db = require("../sequelize/models");

module.exports = {
	discountListSort: async (req, res) => {
		const { uid } = req.uid;
		const { sort, name } = req.query;
		try {
			const admin = await db.user.findOne({
				where: { uid },
				include: { model: db.branch },
			});
			let data;
			if (name !== "") {
				data = await db.discount_history.findAll({
					where: { branch_id: admin.branch.id },
					include: { model: db.product },
					order: [[{ model: db.product }, "name", sort]],
				});
			} else {
				data = await db.discount_history.findAll({
					where: { branch_id: admin.branch.id },
					include: { model: db.product },
					order: [[sort.split("-")[0], sort.split("-")[1]]],
				});
			}
			new HTTPStatus(res, data).success(`Discount list sort by ${sort}`).send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	discountList: async (req, res) => {
		const { uid } = req.uid;
		try {
			const admin = await db.user.findOne({
				where: { uid },
				include: { model: db.branch },
			});
			const data = await db.discount_history.findAll({
				where: { branch_id: admin.branch.id },
				include: { model: db.product },
			});
			new HTTPStatus(res, data).success("Discount list").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	getDiscount: async (req, res) => {
		try {
			const data = await db.discount.findAll();
			new HTTPStatus(res, data).success("Get discount type").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	searchProduct: async (req, res) => {
		const { name } = req.query;
		const { page } = req.query;
		try {
			const totalPage = await db.product.count({
				where: { name: { [Op.substring]: name } },
			});
			const data = await db.product.findAll({
				where: { name: { [Op.substring]: name } },
				offset: page == 1 ? 0 : (page - 1) * 12,
				limit: 12,
			});
			new HTTPStatus(res, { product: data, page: Math.ceil(totalPage / 12) })
				.success("Search Product")
				.send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	createDiscount: async (req, res) => {
		const { uid } = req.uid;
		const { min_purchase, percent, expired, discount_id, product_id } =
			req.body;
		try {
			const admin = await db.user.findOne({
				where: { uid },
				include: { model: db.branch },
			});
			if (discount_id == 1) {
				product_id.map(async (value) => {
					await db.discount_history.create({
						expired,
						branch_id: admin.branch.id,
						discount_id,
						product_id: value,
					});
				});
				new HTTPStatus(res)
					.success("BUY 1 GET 1 created, Contact super admin for approval")
					.send();
			}
			if (discount_id == 2) {
				product_id.map(async (value) => {
					await db.discount_history.create({
						min_purchase,
						percent,
						expired,
						branch_id: admin.branch.id,
						discount_id,
						product_id: value,
					});
				});
				new HTTPStatus(res)
					.success(
						"MINIMUM PURCHASE DISCOUNT created, Contact super admin for approval"
					)
					.send();
			}
			if (discount_id == 3) {
				product_id.map(async (value) => {
					await db.discount_history.create({
						percent,
						expired,
						branch_id: admin.branch.id,
						discount_id,
						product_id: value,
					});
				});
				new HTTPStatus(res)
					.success(
						`${percent}% DISCOUNT created, Contact super admin for approval`
					)
					.send();
			}
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
};
