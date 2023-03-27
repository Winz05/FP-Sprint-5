import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import REST_API from "../support/services/RESTApiService";
import FooterBar from "../components/footer";

export default function Transaction() {
	const [transaction, settransaction] = useState();

	const getTransaction = async () => {
		try {
			const { data } = await REST_API({
				url: "/transaction",
				method: "GET",
			});
			settransaction(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	const cancel = async (invoice) => {
		try {
			await REST_API({
				url: `/transaction/status/cancel`,
				method: "PATCH",
				data: { invoice },
			});
			toast.success("Transaction canceled");
			getTransaction();
		} catch (error) {
			toast.error("Something went wrong");
			console.log(error);
		}
	};
	const received = async (invoice) => {
		try {
			await REST_API({
				url: `/transaction/status/received`,
				method: "PATCH",
				data: { invoice },
			});
			toast.success("Pakage received");
			getTransaction();
		} catch (error) {
			toast.error("Something went wrong");
			console.log(error);
		}
	};

	useEffect(() => {
		getTransaction();
	}, []);
	return (
		<div className="pt-20 flex justify-center font-tokpedFont">
			<div className="max-w-screen-xl w-full border-[1px] rounded-lg p-8">
				<h1 className="text-2xl font-semibold text-gray-500">
					Transaction List
				</h1>
				{transaction?.map((value, index) => {
					return (
						<div
							className="p-6 mt-5 flex bg-white border border-gray-200 rounded-lg shadow w-full"
							key={index}
						>
							<img
								src={value.product.img}
								alt=""
								className="h-32 w-32 object-cover rounded-lg mr-5"
							/>
							<div className="w-full">
								<div className="flex items-center space-x-2 mb-2 text-gray-500">
									<p>{value.createdAt.split("T")[0]}</p>
									<p className="text-xs my-1">{value.invoice}</p>
								</div>
								<div className="grid grid-cols-5">
									<div className=" col-span-4">
										{value.total_item === 1 ? (
											<h5 className="text-xl font-bold tracking-tight text-gray-500">
												{value.product_name}
											</h5>
										) : (
											<>
												<h5 className="text-xl font-bold tracking-tight text-gray-500">
													{value.product_name}
												</h5>
												<h4 className="text-gray-500 text-xs">
													+ {value.total_item - 1} item
												</h4>
											</>
										)}
										<p className="text-red-600 bg-gray-300 w-fit py-1 px-2 rounded-lg mt-2s">
											{value.status}
										</p>
									</div>
									<div className="col-span-1 flex justify-end border-l-[1px]">
										<p>Rp. {parseInt(value.total_price).toLocaleString()}</p>
									</div>
								</div>
								<div className="flex justify-end">
									{value.status === "Waiting Payment" ? (
										<div className="space-x-5">
											<button className="inline-flex items-center mt-4 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800">
												Upload payment proof
											</button>
											<button
												onClick={() => cancel(value.invoice)}
												className="inline-flex items-center mt-4 px-3 py-2 text-sm font-medium text-center border-[2px] border-red-700 bg-white rounded-lg hover:bg-red-600"
											>
												Cancel
											</button>
										</div>
									) : value.status === "Sent" ? (
										<button
											onClick={() => received(value.invoice)}
											className="inline-flex items-center mt-4 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
										>
											Received
										</button>
									) : null}
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<Toaster />
			<FooterBar />
		</div>
	);
}
