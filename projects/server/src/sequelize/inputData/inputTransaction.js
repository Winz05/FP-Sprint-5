const db = require("../models");

(async () => {
	await db.transaction.bulkCreate([
		{
			product_name: "Pakcoy",
			qty: 200,
			price: 8000,
			branch_id: 1,
			user_id: 21,
			invoice_no: `INV/097b46c2001b/${Date.now()}`,
		},
		{
			product_name: "Labu Siam Besar",
			qty: 300,
			price: 13500,
			branch_id: 1,
			user_id: 21,
			invoice_no: `INV/097b46c2001b/${Date.now()}`,
		},
		{
			product_name: "Terong Ungu",
			qty: 400,
			price: 36000,
			branch_id: 1,
			user_id: 21,
			invoice_no: `INV/097b46c2001b/${Date.now()}`,
		},
	]);
})();
(async () => {
	await db.transaction.bulkCreate([
		{
			product_name: "Daun Rosemary",
			qty: 100,
			total_price: 6000,
			branch_id: 1,
			user_id: 21,
			invoice: `INV/097b46c2001b/${Date.now()}`,
		},
		{
			product_name: "Lettuce Head",
			qty: 300,
			total_price: 33600,
			branch_id: 1,
			user_id: 21,
			invoice: `INV/097b46c2001b/${Date.now()}`,
		},
		{
			product_name: "Tomat Cherry",
			qty: 600,
			total_price: 6 * 10700,
			branch_id: 1,
			user_id: 21,
			invoice: `INV/097b46c2001b/${Date.now()}`,
		},
		{
			product_name: "Buncis Organik",
			qty: 500,
			total_price: 5 * 14700,
			branch_id: 1,
			user_id: 21,
			invoice: `INV/097b46c2001b/${Date.now()}`,
		},
		{
			product_name: "Wortel Organik",
			qty: 500,
			total_price: 5 * 20500,
			branch_id: 1,
			user_id: 21,
			invoice: `INV/097b46c2001b/${Date.now()}`,
		},
	]);
})();
(async () => {
	await db.transaction.bulkCreate([
		{
			product_name: "Cabai Rawit Merah",
			qty: 300,
			price: 3 * 11200,
			branch_id: 1,
			user_id: 21,
			invoice_no: `INV/097b46c2001b/${Date.now()}`,
		},
	]);
})();
