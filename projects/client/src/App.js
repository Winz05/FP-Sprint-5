import "./App.css";
import REST_API from "./support/services/RESTApiService";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import NavigationBar from "./components/navbar";
import Profile from "./pages/profile";
import { useEffect, useState } from "react";
import Login from "./pages/login";
import UpdatePassword from "./pages/newpass";
import Register from "./pages/register";
import Activation from "./pages/activation";
import ForgotPass from "./pages/forgotpass";
import Dashboard from "./pages/dashboard";
import SalesReport from "./components/salesReport";
import ProductCategory from "./pages/product_category";
import Checkout from "./pages/checkout";
import Cart from "./pages/cart";
import BranchAdminRegister from "./components/branchAdminRegister";
import Transaction from "./pages/transaction";
import LoginAdmin from "./pages/loginAdmin";
import StockHistory from "./components/stockHistory";
import { toast } from "react-hot-toast";
import ProductManagement from "./pages/productManagement";
import DiscountManagement from "./pages/discountManagement";
import BranchAdminProductList from "./components/branchAdminProductlist";
import PaymentProof from "./pages/paymentProof";
import TransactionAdmin from "./components/transaction";

function App() {
	const [disable, setdisable] = useState();
	const [profile, setprofile] = useState({
		id: null,
		name: null,
		birthdate: null,
		gender: null,
		email: null,
		phone_number: null,
		profile_picture: null,
		address: null,
	});
	const getProfile = async () => {
		try {
			const { data } = await REST_API({
				url: "/user/profile",
				method: "GET",
			});
			setprofile({
				...profile,
				name: data.data.name,
				birthdate: data.data.birthdate,
				gender: data.data.gender,
				email: data.data.email,
				phone_number: data.data.phone_number,
				profile_picture: data.data.img,
				role: data.data.role,
				address: data.data.user_addresses,
			});
		} catch (error) {
			console.log(error);
		}
	};

	let onLogin = async (email, password) => {
		try {
			setdisable(true);
			const { data } = await REST_API({
				url: "/user/login",
				method: "POST",
				data: {
					email: email,
					password: password,
				},
			});
			await localStorage.setItem("token", `${data.data.token}`);
			toast.success(data.message);
			email = "";
			password = "";
			getProfile();
			setTimeout(() => {
				window.location.href = "http://localhost:3000/home";
			}, 3000);
		} catch (error) {
			toast.error(error.response.data.message);
			console.log(error);
		} finally {
			setdisable(false);
		}
	};

	useEffect(() => {
		getProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let onLogout = () => {
		localStorage.removeItem("token");
		setprofile({ ...profile, name: "" });
	};

	return (
		<div className="relative">
			<Routes>
				{/* User */}
				<Route path="/" element={<NavigationBar state={{ profile }} Func={{ onLogout }} />}>
					<Route path="home" element={<LandingPage />} />
					<Route
						path="profile"
						element={<Profile func={{ getProfile }} state={{ profile, setprofile }} />}
					/>
					<Route path="category/:product" element={<ProductCategory />} />
					<Route path="cart" element={<Cart />} />
					<Route path="transaction" element={<Transaction />} />
				</Route>
				<Route path="checkout" element={<Checkout state={{profile}} />} />
				<Route path="/login" element={<Login MyFunc={{ onLogin }} isDisable={{ disable }} />} />
				<Route path="/updatePassword/:uid" element={<UpdatePassword />} />
				<Route path="/register" element={<Register />} />
				<Route path="/activation/:uid" element={<Activation />} />
				<Route path="/forgotpassword" element={<ForgotPass />} />
				<Route path="/uploadpayment" element={<PaymentProof />} />
				{/* Admin */}
				<Route path="/admin" element={<Dashboard />}>
					{/* <Route path="/admin" element={<Overview />} /> */}
					<Route path="sales-report" element={<SalesReport />} />
					<Route path="branch-admin-register" element={<BranchAdminRegister />} />
					<Route path="stock-history" element={<StockHistory />} />
					<Route path="admin-product" element={<BranchAdminProductList />} />
					<Route path="product-management" element={<ProductManagement />} />
					<Route path="discount-management" element={<DiscountManagement />} />
					<Route path="transaction" element={<TransactionAdmin />} />
				</Route>
				<Route path="/loginAdmin" element={<LoginAdmin />} />
			</Routes>
		</div>
	);
}

export default App;
