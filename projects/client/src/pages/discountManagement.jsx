import React, { useEffect, useState } from "react";
import {
	Modal,
	Label,
	Spinner,
	Button,
	TextInput,
	Checkbox,
	Dropdown,
} from "flowbite-react";
import { BiSearchAlt } from "react-icons/bi";
import { GrPrevious, GrNext } from "react-icons/gr";
import REST_API from "../support/services/RESTApiService";

export default function DiscountManagement() {
	const [page, setpage] = useState();
	const [selectedpage, setselectedpage] = useState(1);
	const [type, settype] = useState();
	const [all, setall] = useState();
	const [productname, setproductname] = useState();
	const [searchedproduct, setsearchedproduct] = useState();
	const [newDiscount, setnewDiscount] = useState({
		min_purchase: null,
		percent: null,
		expired: null,
		discount_id: null,
		product_id: [],
	});
	const [show, setshow] = useState({
		createDiscount: false,
		productSelection: false,
		loading: false,
	});
	const inputProduct = (value) => {
		if (newDiscount.product_id.includes(value)) {
			let val = newDiscount.product_id;
			val.splice(newDiscount.product_id.indexOf(value), 1);
			console.log(val);
			setnewDiscount({ ...newDiscount, product_id: val });
		} else {
			setnewDiscount({
				...newDiscount,
				product_id: [...newDiscount.product_id, value],
			});
		}
	};

	const getAllDiscount = async () => {
		try {
			const { data } = await REST_API({
				url: "/admin/discount-list",
				method: "GET",
			});
			setall(data.data);
		} catch (error) {}
	};
	const getDiscountType = async () => {
		try {
			const { data } = await REST_API({
				url: "/admin/discount",
				method: "GET",
			});
			settype(data.data);
		} catch (error) {}
	};
	const productSelection = async (name, page) => {
		try {
			const { data } = await REST_API({
				url: `/admin/search-product?name=${name}&page=${page}`,
				method: "GET",
			});
			setsearchedproduct(data.data.product);
			setpage(data.data.page);
		} catch (error) {}
	};
	const createDiscount = async () => {
		console.log(newDiscount);
		setshow({ ...show, loading: true });
		try {
			await REST_API({
				url: "/admin/create-discount",
				method: "POST",
				data: newDiscount,
			});
		} catch (error) {
		} finally {
			setshow({ ...show, loading: false, createDiscount: false });
			setnewDiscount({
				min_purchase: null,
				percent: null,
				expired: null,
				discount_id: null,
				product_id: [],
			});
			setsearchedproduct();
			getAllDiscount();
		}
	};
	const sortBy = async (sort, name) => {
		try {
			const { data } = await REST_API({
				url: `/admin/discount-list-sort?name=${name}&sort=${sort}`,
				method: "GET",
			});
			setall(data.data);
		} catch (error) {}
	};
	useEffect(() => {
		getAllDiscount();
		getDiscountType();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			<div className="rounded-lg max-w-screen-xl relative">
				<div className="fixed mt-4 ml-4 w-full max-w-screen-xl grid grid-cols-6 bg-gray-400 px-3 rounded-md text-lg py-2 mb-2 z-50">
					<Dropdown label="Type" inline={true}>
						<Dropdown.Item onClick={() => sortBy("type-asc")}>
							Ascending
						</Dropdown.Item>
						<Dropdown.Item onClick={() => sortBy("type-desc")}>
							Descending
						</Dropdown.Item>
					</Dropdown>
					<Dropdown label="Minimum Purchase" inline={true}>
						<Dropdown.Item onClick={() => sortBy("min_purchase-asc")}>
							Ascending
						</Dropdown.Item>
						<Dropdown.Item onClick={() => sortBy("min_purchase-desc")}>
							Descending
						</Dropdown.Item>
					</Dropdown>
					<Dropdown label="Percent(%)" inline={true}>
						<Dropdown.Item onClick={() => sortBy("percent-asc")}>
							Ascending
						</Dropdown.Item>
						<Dropdown.Item onClick={() => sortBy("percent-desc")}>
							Descending
						</Dropdown.Item>
					</Dropdown>
					<Dropdown label="Product" inline={true}>
						<Dropdown.Item onClick={() => sortBy("asc", 1)}>
							Ascending
						</Dropdown.Item>
						<Dropdown.Item onClick={() => sortBy("desc", 1)}>
							Descending
						</Dropdown.Item>
					</Dropdown>
					<Dropdown label="Expired" inline={true}>
						<Dropdown.Item onClick={() => sortBy("expired-asc")}>
							Ascending
						</Dropdown.Item>
						<Dropdown.Item onClick={() => sortBy("expired-desc")}>
							Descending
						</Dropdown.Item>
					</Dropdown>
					<Dropdown label="Status" inline={true}>
						<Dropdown.Item>Waiting Approval</Dropdown.Item>
						<Dropdown.Item>Active</Dropdown.Item>
						<Dropdown.Item>Expired</Dropdown.Item>
					</Dropdown>
				</div>
				<div className="fixed top-0 w-full bg-white h-14 z-10" />
				<div className="space-y-2 pt-16 ml-4 w-full">
					{all?.map((value, index) => {
						return (
							<div
								className="grid grid-cols-6 border-[2px] px-2 py-1 rounded-md"
								key={index}
							>
								<h3>
									{value.discount_id === 1
										? "BUY 1 GET 1"
										: value.discount_id === 2
										? "Minimum Purchased"
										: "Custom Discount"}
								</h3>
								<h3>{value.min_purchase}</h3>
								<h3>{value.percent}</h3>
								<h3>{value.product.name}</h3>
								<h3>{value.expired}</h3>
								<h3>{value.status}</h3>
							</div>
						);
					})}
				</div>
				<button
					onClick={() => setshow({ ...show, createDiscount: true })}
					className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
				>
					Create Discount
				</button>
			</div>
			<Modal
				show={show.createDiscount}
				size="md"
				popup={true}
				onClose={() => setshow({ ...show, createDiscount: false })}
				id="name modal"
			>
				<Modal.Header />
				<Modal.Body>
					<div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
						<h3 className="text-xl font-medium text-gray-900 dark:text-white">
							Create new discount
						</h3>
						<div className="space-y-2">
							<div className="mb-2 block">
								<Label htmlFor="name" value="Select discount type" />
							</div>
							<select
								id="discount type"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								defaultValue="Select discount type"
								onChange={(e) =>
									setnewDiscount({
										...newDiscount,
										discount_id: e.target.value,
									})
								}
							>
								<option selected={true} disabled>
									Select discount type
								</option>
								{type?.map((value, index) => {
									return (
										<option key={index} value={String(value.id)}>
											{value.name}
										</option>
									);
								})}
							</select>
							{parseInt(newDiscount.discount_id) === 2 ? (
								<div className="flex flex-col space-y-2 w-full">
									<Label htmlFor="name" value="Minimum purchase" />
									<TextInput
										type="number"
										onChange={(e) =>
											setnewDiscount({
												...newDiscount,
												min_purchase: e.target.value,
											})
										}
									/>
									<Label htmlFor="name" value="Input discount percentage" />
									<TextInput
										type="number"
										onChange={(e) =>
											setnewDiscount({
												...newDiscount,
												percent: e.target.value,
											})
										}
									/>
								</div>
							) : parseInt(newDiscount.discount_id) === 3 ? (
								<div className="flex flex-col space-y-2 w-full">
									<Label htmlFor="name" value="Input discount percentage" />
									<TextInput
										type="number"
										onChange={(e) =>
											setnewDiscount({
												...newDiscount,
												percent: e.target.value,
											})
										}
									/>
								</div>
							) : null}
							<div>
								<Button
									onClick={() => setshow({ ...show, productSelection: true })}
								>
									Select item
								</Button>
							</div>
						</div>
						<div className="w-full flex justify-end">
							{show.loading ? (
								<button>
									<Spinner aria-label="Default status example" />
								</button>
							) : (
								<Button onClick={() => createDiscount()}>Submit</Button>
							)}
						</div>
					</div>
				</Modal.Body>
			</Modal>
			<Modal
				show={show.productSelection}
				size="3xl"
				popup={true}
				onClose={() => setshow({ ...show, productSelection: false })}
				id="name modal"
			>
				<Modal.Header />
				<Modal.Body>
					<div className=" flex flex-col justify-between space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
						<div>
							<h3 className="text-xl font-medium text-gray-900 dark:text-white">
								Select Product
							</h3>
							<div className="relative">
								<TextInput
									onChange={(e) => {
										productSelection(e.target.value, selectedpage);
										setproductname(e.target.value);
									}}
									placeholder="Search product here"
								/>
								<BiSearchAlt className="text-2xl text-gray-500 absolute top-2 right-1" />
							</div>
						</div>
						<div className="grid grid-cols-4 space-x-2 space-y-2 h-[500px]">
							{searchedproduct?.map((value, index) => {
								return (
									<div
										key={index}
										className="relative flex flex-col h-[168px] shadow-md bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
									>
										<img
											className="rounded-t-lg h-20 object-cover mb-3"
											src={value.img}
											alt="product"
										/>
										<div className="px-5 pb-5">
											<h5 className="text-sm tracking-tight text-gray-900 dark:text-white">
												{value.name}
											</h5>
										</div>
										<Checkbox
											id="productSelectCheckbox"
											value={value.id}
											onChange={(e) => inputProduct(e.target.value)}
											className="absolute bottom-2 right-2"
										/>
									</div>
								);
							})}
						</div>
						<div>
							{searchedproduct ? (
								<div className="flex justify-center items-center my-5">
									<label className=" p-1" htmlFor="">
										page
									</label>
									<button
										className="bg-red-500  border-y-[1px] border-l-[1px] p-2 rounded-l-lg"
										onClick={() => {
											productSelection(productname, selectedpage - 1);
											setselectedpage(selectedpage - 1);
										}}
										disabled={parseInt(selectedpage) === 1}
									>
										<GrPrevious />
									</button>
									<input
										type="text"
										value={selectedpage}
										onChange={(e) => {
											productSelection(productname, parseInt(e.target.value));
											setselectedpage(
												e.target.value ? parseInt(e.target.value) : 0
											);
										}}
										className="w-8 p-1 border-0"
									/>
									<button
										className="bg-red-500  border-y-[1px] border-r-[1px] p-2 rounded-r-lg"
										onClick={() => {
											productSelection(productname, selectedpage + 1);
											setselectedpage(selectedpage + 1);
										}}
										disabled={parseInt(selectedpage) === parseInt(page)}
									>
										<GrNext />
									</button>
									<label className="p-1" htmlFor="">
										of {page}
									</label>
								</div>
							) : null}
							<div className="w-full flex justify-end">
								{show.loading ? (
									<button>
										<Spinner aria-label="Default status example" />
									</button>
								) : (
									<Button
										onClick={() =>
											setshow({ ...show, productSelection: false })
										}
									>
										Submit
									</Button>
								)}
							</div>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
