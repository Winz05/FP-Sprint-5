import { GrNext, GrPrevious } from "react-icons/gr";
import REST_API from "../support/services/RESTApiService";
import { useState, useEffect } from "react";
import { Dropdown } from "flowbite-react";

function BranchAdminProductList() {
	const [product, setproduct] = useState();
	const [page, setpage] = useState();
	const [selectedpage, setselectedpage] = useState(1);
	const [category, setCategory] = useState();
	const [selectedCategory, setSelectedCategory] = useState();
	const [sort, setSort] = useState();

	const getAllProduct = async (page, sort) => {
		try {
			const { data } = await REST_API({
				url: `/admin/branch-admin-product-list?page=${page}&sort=${
					sort ? sort : ""
				}`,
				method: "GET",
			});
			setproduct(data.data.data);
			setselectedpage(page);
			setSort(sort);
		} catch (error) {
			console.log(error);
		}
	};

	const getTotalPage = async () => {
		try {
			const { data } = await REST_API({
				url: `/admin/total-page`,
				method: "GET",
			});
			setpage(Math.ceil(data.data / 16));
		} catch (error) {
			console.log(error);
		}
	};

	const getCategory = async () => {
		try {
			const { data } = await REST_API({
				url: `/admin/get-category`,
				method: "GET",
			});
			setCategory(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	const getProductCategory = async (id, page, sort) => {
		try {
			const { data } = await REST_API({
				url: `/admin//get-product-by-category?category=${id}&page=${page}&sort=${
					sort ? sort : ""
				}`,
				method: "GET",
			});
			setproduct(data.data);
			setSort(sort);
			console.log(data.data, "ini dari category");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getAllProduct(1);
		getTotalPage();
		getCategory();
	}, []);

	return (
		<div>
			{console.log(product)}
			<div className="mb-2">Sort By Category</div>
			<button
				onClick={() => {
					getAllProduct(1);
					setSort();
					setSelectedCategory();
				}}
				className="h-6 bg-[#0095DA] rounded-md mb-2 "
			>
				<p className="text-xs">All Category</p>
			</button>
			<div className="grid grid-cols-10 gap-2 pb-4">
				{category
					? category.map((value) => {
							return (
								<button
									onClick={() => {
										getProductCategory(value.id, 1);
										setSelectedCategory(value.id);
										setSort();
									}}
									className="h-6 bg-[#0095DA] rounded-md "
								>
									<p className="text-xs">{value.name}</p>
								</button>
							);
					  })
					: null}
			</div>
			<div className="mb-2">
				<Dropdown className="" label="Sort" dismissOnClick={false}>
					<Dropdown.Item
						onClick={() => {
							selectedCategory
								? getProductCategory(selectedCategory, selectedpage, "name-asc")
								: getAllProduct(selectedpage, "name-asc");
						}}
					>
						A-Z
					</Dropdown.Item>
					<Dropdown.Item
						onClick={() => {
							selectedCategory
								? getProductCategory(
										selectedCategory,
										selectedpage,
										"name-desc"
								  )
								: getAllProduct(selectedpage, "name-desc");
						}}
					>
						Z-A
					</Dropdown.Item>
					<Dropdown.Item
						onClick={() => {
							selectedCategory
								? getProductCategory(
										selectedCategory,
										selectedpage,
										"price-desc"
								  )
								: getAllProduct(selectedpage, "price-desc");
						}}
					>
						Higest Price
					</Dropdown.Item>
					<Dropdown.Item
						onClick={() => {
							selectedCategory
								? getProductCategory(
										selectedCategory,
										selectedpage,
										"price-asc"
								  )
								: getAllProduct(selectedpage, "price-asc");
						}}
					>
						Lowest Price
					</Dropdown.Item>
				</Dropdown>
			</div>
			<div className="grid grid-cols-4 gap-7 h-[1100px]">
				{product
					? product.map((value, index) => {
							return (
								<div
									key={index}
									className="flex flex-col shadow-md justify-between w-full max-w-sms h-64 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
								>
									<img
										className="rounded-t-lg h-32"
										src={value.product.img}
										alt="product"
									/>
									<div className="px-5 pb-5">
										<h5 className="text-xs font-semibold tracking-tight text-gray-900 dark:text-white">
											{value.product.name}
										</h5>
										<h4 className="text-xs">Jumlah Stok {value.stock}</h4>
										<div className="flex items-center justify-between">
											<span className="text-xs font-bold text-gray-900 dark:text-white">
												Rp. {value.product.price.toLocaleString()}
											</span>
										</div>
									</div>
									<div className="flex justify-end px-2 mb-4">
										<button className="bg-blue-700 rounded-xl text-white px-2">
											Edit
										</button>
										<button className="bg-red-700 rounded-xl text-white px-2">
											Delete
										</button>
									</div>
								</div>
							);
					  })
					: null}
			</div>

			<div className="flex justify-center items-center my-5">
				<label className=" p-1" htmlFor="">
					page
				</label>
				<button
					className="bg-red-500  border-y-[1px] border-l-[1px] p-2 rounded-l-lg"
					onClick={
						selectedCategory
							? () => getProductCategory(selectedCategory, selectedpage - 1)
							: () => getAllProduct(selectedpage - 1)
					}
					disabled={parseInt(selectedpage) === 1}
				>
					<GrPrevious />
				</button>
				<input
					type="text"
					value={selectedpage}
					onChange={(e) => {
						selectedCategory
							? getProductCategory(selectedCategory, e.target.value, sort)
							: getAllProduct(parseInt(e.target.value, sort));
						setselectedpage(e.target.value ? parseInt(e.target.value) : 0);
					}}
					className="w-8 p-1 border-0"
				/>
				<button
					className="bg-red-500  border-y-[1px] border-r-[1px] p-2 rounded-r-lg"
					onClick={
						selectedCategory
							? () =>
									getProductCategory(selectedCategory, selectedpage + 1, sort)
							: () => getAllProduct(selectedpage + 1, sort)
					}
					disabled={parseInt(selectedpage) === parseInt(page)}
				>
					<GrNext />
				</button>
				<label className="p-1" htmlFor="">
					of {page}
				</label>
			</div>
		</div>
	);
}

export default BranchAdminProductList;
