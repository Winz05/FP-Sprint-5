import { Button, Label, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import tokonglomerat from "../support/assets/edit_register_new.png";
import REST_API from "../support/services/RESTApiService";
export default function PaymentProof() {
	const [data, setdata] = useState();
	const [sum, setsum] = useState();
	const [disc, setdisc] = useState();
	const [img, setimg] = useState();
	const [show, setshow] = useState();

	const Navigate = useNavigate();

	let onGetCart = async () => {
		try {
			let { data } = await REST_API({
				url: "/cart/get",
				method: "GET",
			});
			let total = 0;
			console.log(data.data);
			data.data.forEach((value, index) => {
				total += value.qty * value.product.price;
			});
			console.log(total);
			setsum(total);
			setdisc(5000);
			setdata(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	const validateImage = (e) => {
		const err = {
			msg1: "Select 1 Image only!",
			msg2: `${e.target.files[0].name} more than 1MB`,
		};
		try {
			if (e.target.files > 1) throw err.msg1;

			if (e.target.files[0].size > 1000000) throw err.msg2;
			setimg(e.target.files[0]);
		} catch (error) {
			toast.error(error);
		}
	};

	const onSubmitPP = async () => {
		const fd = new FormData();
		try {
			fd.append("images", img);
			await REST_API({
				url: "/user/profile/picture",
				method: "PATCH",
				data: fd,
			});
			toast("Profile picture updated");
		} catch (error) {
			toast.error("Upload image failed");
		}
	};

	useEffect(() => {
		onGetCart();
	}, []);
	return (
		<div className=" max-h-screen overflow-hidden ">
			<div className=" mt-[20px] mb-[25px] flex content-center justify-center">
				<h1 className=" font-bold text-4xl font-mandalaFont text-[#0095DA] ">
					<button onClick={() => Navigate("/home")}>tokonglomerat</button>
				</h1>
			</div>
			<div className="  flex content-center justify-center max-w-sm h-screen xl:max-w-screen-2xl mx-auto">
				<div className=" hidden xl:flex-row xl:block">
					<img
						className=" mt-[173px] h-[303px] w-[360px] mr-[149px] "
						src={tokonglomerat}
						alt="Gambar Tokonglomerat"
					/>
					<p className=" font-tokpedFont mr-[130px] mt-[30px] font-bold text-[22px] ">
						{" "}
						Easy Buying and Selling Only at Tokonglomerat
					</p>
					<p className=" font-tokpedFont ml-[15px] mt-[13px] text-[#6d7588] text-[13px]">
						Join and feel the convenience of making transactions at Tokonglomerat
					</p>
				</div>
				{data ? (
					<div className=" font-tokpedFont w-[400px] h-fit ml-[45px] mt-[173px] px-4 py-4 rounded-lg border shadow-xl">
						<p className=" font-semibold text-[14px]">Shopping Summary</p>
						<div className=" h-fit my-4 flex justify-between">
							<div>
								{data
									? data.map((value, index) => {
											return (
												<p key={index} className=" mb-2 text-[14px] ">
													{`${value.product.name} x ${value.qty}`}
												</p>
											);
									  })
									: null}
								<p className=" mt-2 text-[14px]">Shipping Cost</p>
								<p className=" mt-2 text-[14px] ">Promo </p>
							</div>
							<div>
								{data
									? data.map((value, index) => {
											return (
												<p className=" flex gap-1 mb-2 text-[14px]">
													Rp. {(value.product.price*value.qty).toLocaleString()}{" "}
												</p>
											);
									  })
									: null}
								<p className=" mt-2 text-[14px]">Rp. 64,000</p>
								<p className=" mt-2 font-semibold text-[14px]">Buy 1 Get 1</p>
							</div>
						</div>
						<div className=" border-t flex justify-between h-[37px] items-end ">
							<p className=" font-semibold text-[16px] ">Total Bill</p>
							<p className=" font-semibold text-[16px] ">Rp. {(sum + 64000).toLocaleString()} </p>
						</div>
						<p className=" mt-4 text-slate-500 text-[11px]">
							Dengan mengaktifkan asuransi, Saya menyetujui{" "}
							<p className=" text-red-700">syarat dan ketentuan yang berlaku.</p>
						</p>
						<button
							onClick={() => setshow(true)}
							className=" mt-6 h-12 w-full text-white bg-[#0095DA] rounded-lg "
						>
							Upload Payment
						</button>
					</div>
				) : null}
				<Modal show={show} size="md" popup={true} onClose={() => setshow(false)} id="name modal">
					<Modal.Header />
					<Modal.Body>
						<div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
							<h3 className="text-xl font-semibold font-tokpedFont text-gray-900 dark:text-white">
								Upload Your Payment
							</h3>
							<div className="space-y-2">
								<div className="mb-2 block">
									<Label htmlFor="password" value="Upload image" />
								</div>
								<input
									type="file"
									name="myImage"
									accept="image/png, image/gif, image/jpeg, image/jpg"
									onChange={(e) => validateImage(e)}
									className="rounded-lg bg-slate-500 text-white"
								/>
								<p className="text-xs">Upload image with .jpg, .png, .jpeg</p>
								<p className="text-xs">Max size 1MB</p>
							</div>
							<div className="w-full flex justify-end">
								<Button onClick={() => onSubmitPP()}>Submit</Button>
							</div>
						</div>
					</Modal.Body>
				</Modal>
				<Toaster />
			</div>
		</div>
	);
}
