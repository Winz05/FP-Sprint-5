import { BiSearchAlt, BiCart, BiBell } from "react-icons/bi";
import { AiOutlineUser, AiOutlineShopping } from "react-icons/ai";
import { Outlet, useNavigate } from "react-router-dom";
import { Dropdown } from "flowbite-react";

export default function NavigationBar(props) {
	const navigate = useNavigate();
	return (
		<>
			<div className="grid grid-cols-12 fixed py-6 px-8 shadow-md max-w-screen w-full bg-[#0095DA] z-50">
				<button
					onClick={() => navigate("/home")}
					className=" col-span-3 font-mandalaFont font-extrabold text-xl text-red-700 xl:text-4xl"
				>
					tokonglomerat
				</button>
				<div className=" col-span-6 relative flex items-center">
					<input
						type="text"
						className=" pl-10 h-7 rounded-lg border-gray-300 w-full"
						placeholder="Cari di tokonglomerat"
					/>
					<BiSearchAlt className="text-2xl text-gray-500 absolute top-2 left-1" />
				</div>
				<div className="flex justify-center text-gray-500 gap-7">
					<button
						onClick={() =>
							localStorage.getItem("token") ? navigate("/cart") : navigate("/login")
						}
					>
						<BiCart className="text-2xl" />
					</button>
					<button>
						<BiBell className="text-2xl" />
					</button>
				</div>
				{localStorage.getItem("token") ? (
					<div className="col-span-2 flex text-[#6C727C] items-center justify-end space-x-4">
						<Dropdown
							inline={true}
							label={props.state.profile.name}
							dismissOnClick={true}
						>
							<Dropdown.Item
								onClick={() => navigate("/profile")}
								className="flex items-center px-3 space-x-2"
							>
								<AiOutlineUser className="text-xl" />
								<p>Profile</p>
							</Dropdown.Item>
							<Dropdown.Item
								onClick={() => navigate("/transaction")}
								className="flex items-center px-3 space-x-2"
							>
								<AiOutlineShopping className="text-xl" />
								<p>Transaction</p>
							</Dropdown.Item>
						</Dropdown>
					</div>
				) : (
					<div className="col-span-2 grid grid-cols-2 gap-4">
						<button
							onClick={() => navigate("/login")}
							className="border-[2px] rounded-lg px-2 py-1"
						>
							<p>Login</p>
						</button>
						<button
							onClick={() => navigate("/register")}
							className="border-[2px] rounded-lg px-2 py-1"
						>
							<p>Register</p>
						</button>
					</div>
				)}
			</div>
			<Outlet />
		</>
	);
}
