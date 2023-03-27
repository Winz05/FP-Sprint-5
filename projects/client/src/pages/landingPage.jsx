import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import FooterBar from "../components/footer";
import "react-multi-carousel/lib/styles.css";
import REST_API from "../support/services/RESTApiService";
import banner from "../support/assets/banner/blm-c1-long-atas-mar23.png";
import banner1 from "../support/assets/banner/UFS-Long-revamp-1200x320.png";
import banner2 from "../support/assets/banner/LeeKumKee-blm-24feb-Banner-A-600x250.png";
import banner3 from "../support/assets/banner/TG-7mar-blm-bannerA.png";
import car1 from "../support/assets/carousell/Beras-Raja-blm-07maret-C1.jpg";
import car2 from "../support/assets/carousell/cloud9-mar23-blm-c1.jpg";
import car3 from "../support/assets/carousell/kbaby-blm-feb23-c1.jpg";
import car4 from "../support/assets/carousell/KILAU-RAMBUT-mar-2023-c1-lk.jpg";
import car5 from "../support/assets/carousell/oreo-blackpink-mar23-blm-c1-1.jpg";
import car6 from "../support/assets/carousell/Pasar-Murah-blm-28feb-C1.jpg";
import car7 from "../support/assets/carousell/pcmp-blm-mar09-c1p-.jpg";
import car8 from "../support/assets/carousell/SEAFOOD-BLM-mar2-c1.jpg";
import car9 from "../support/assets/carousell/Sesa-blm-06maret-C1.jpg";
import car10 from "../support/assets/carousell/SoKlin-liquid-blm-10mar-C1.jpg";
import car11 from "../support/assets/carousell/Sparkle-blm-27feb-C1.jpg";
import car12 from "../support/assets/carousell/telur-blm-mar09-c1.jpg";
export default function LandingPage() {
	const [product, setproduct] = useState();
	const [random, setrandom] = useState();
	const [category, setcategory] = useState();
	const navigate = useNavigate();
	const responsive = {
		desktop: {
			breakpoint: {
				max: 3000,
				min: 1024,
			},
			items: 1,
			partialVisibilityGutter: 50,
		},
		mobile: {
			breakpoint: {
				max: 464,
				min: 0,
			},
			items: 1,
			partialVisibilityGutter: 0,
		},
	};
	const responsiveProduct = {
		desktop: {
			breakpoint: {
				max: 3000,
				min: 1024,
			},
			items: 6,
		},
		mobile: {
			breakpoint: {
				max: 464,
				min: 0,
			},
			items: 3,
		},
	};

	const getCategory = async () => {
		const { data } = await REST_API({
			url: "/product/category",
			method: "GET",
		});
		setcategory(data.data);
	};
	const getSuggested = async () => {
		try {
			const { data } = await REST_API({
				url: `/product/suggested`,
				method: "GET",
			});
			setproduct(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	const forYou = async () => {
		try {
			const { data } = await REST_API({
				url: `/product/foryou`,
				method: "GET",
			});
			setrandom(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getSuggested();
		getCategory();
		forYou();
	}, []);
	return (
		<>
			<div className="pt-24 max-w-screen-xl mx-auto font-tokpedFont px-2">
				<div className="flex justify-center">
					<img
						src={banner}
						alt="banner"
						className="w-full shadow-md rounded-xl"
					/>
				</div>
				<div className="flex justify-center mt-5">
					<div className="h-56 sm:h-64 xl:h-64 w-full">
						<Carousel
							additionalTransfrom={0}
							arrows
							autoPlay={true}
							autoPlaySpeed={2500}
							centerMode
							className="rounded-lg"
							containerClass="container shadow"
							infinite={true}
							renderDotsOutside={false}
							responsive={responsive}
							rewind={false}
							rewindWithAnimation={false}
							rtl={false}
							showDots={false}
							slidesToSlide={1}
						>
							<img src={car1} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car2} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car3} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car4} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car5} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car6} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car7} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car8} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car9} alt="carousel" className="rounded-lg shadow-md" />
							<img
								src={car10}
								alt="carousel"
								className="rounded-lg shadow-md"
							/>
							<img
								src={car11}
								alt="carousel"
								className="rounded-lg shadow-md"
							/>
							<img
								src={car12}
								alt="carousel"
								className="rounded-lg shadow-md"
							/>
						</Carousel>
					</div>
				</div>
				<div className="grid grid-cols-10 gap-5 py-10">
					{category
						? category.map((value, index) => {
								return (
									<button key={index} className="space-y-2 h-max">
										<div
											onClick={() =>
												navigate(
													`/category/category=${value.id}&branch=${
														1
													}`
												)
											}
											className="flex flex-col justify-center items-center space-y-1"
										>
											<img
												src={value.img}
												alt={value.name}
												className="w-11/12 rounded-full overflow-visible"
											/>
											<p className=" font-medium font-tokpedFont text-sm">
												{value.name}
											</p>
										</div>
									</button>
								);
						  })
						: null}
				</div>
				<div>
					<h2 className="text-xl font-semibold pb-3">Best Seller</h2>
				</div>
				<div className="h-56 sm:h-64 xl:h-64 w-full">
					<Carousel
						additionalTransfrom={0}
						arrows
						className="rounded-lg py-5 px-3"
						renderDotsOutside={false}
						responsive={responsiveProduct}
						rewind={false}
						rewindWithAnimation={false}
						rtl={false}
						showDots={false}
						slidesToSlide={1}
					>
						{product ? (
							product.map((value, index) => {
								return (
									<div
										key={index}
										className="flex flex-col shadow-md w-48 h-80 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
									>
										<img
											className="rounded-t-lg h-44 object-cover mb-3"
											src={value.product.img}
											alt="product"
										/>
										<div className="px-5 pb-5">
											<h5 className="text-sm tracking-tight text-gray-900 dark:text-white">
												{value.product.name}
											</h5>
											<div className="flex items-center justify-between">
												<span className="text-lg font-bold text-gray-900 dark:text-white">
													Rp. {value.product.price.toLocaleString()}
												</span>
											</div>
											<h4 className="text-xs font-thin">
												Toko {value.branch.location}
											</h4>
										</div>
									</div>
								);
							})
						) : (
							<div>Loading</div>
						)}
					</Carousel>
				</div>
				<div className="mt-24">
					<img src={banner1} alt="banner 2" className="mx-auto" />
				</div>
				<div className="flex">
					<img
						src={banner2}
						alt="banner 3"
						className="overflow-hidden mx-auto"
					/>
					<img
						src={banner3}
						alt="banner 4"
						className="overflow-hidden mx-auto"
					/>
				</div>
				<div>
					<h2 className="text-xl font-semibold py-3">For you</h2>
				</div>
				<div className="h-56 sm:h-64 xl:h-64 w-full">
					<Carousel
						additionalTransfrom={0}
						arrows
						className="rounded-lg py-5 px-3"
						renderDotsOutside={false}
						responsive={responsiveProduct}
						rewind={false}
						rewindWithAnimation={false}
						rtl={false}
						showDots={false}
						slidesToSlide={1}
					>
						{random ? (
							random.map((value, index) => {
								return (
									<div
										key={index}
										className="flex flex-col shadow-md w-48 h-80 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
									>
										<img
											className="rounded-t-lg h-44 object-cover mb-3"
											src={value.product.img}
											alt="product"
										/>
										<div className="px-5 pb-5">
											<h5 className="text-sm tracking-tight text-gray-900 dark:text-white">
												{value.product.name}
											</h5>
											<div className="flex items-center justify-between">
												<span className="text-lg font-bold text-gray-900 dark:text-white">
													Rp. {value.product.price.toLocaleString()}
												</span>
											</div>
											<h4 className="text-xs font-thin">
												Toko {value.branch.location}
											</h4>
										</div>
									</div>
								);
							})
						) : (
							<div>Loading</div>
						)}
					</Carousel>
				</div>
			</div>
			<FooterBar />
		</>
	);
}
