import React from "react";
import { Footer } from "flowbite-react";
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from "react-icons/bs";

export default function FooterBar() {
	return (
		<Footer className="mt-32 border-t-[2px]" bgDark={true}>
			<div className="w-full">
				<div className="grid w-full grid-cols-2 gap-8 py-8 px-6 md:grid-cols-4">
					<div>
						<Footer.Title title="Company" />
						<Footer.LinkGroup col={true}>
							<Footer.Link>About</Footer.Link>
							<Footer.Link>Careers</Footer.Link>
							<Footer.Link>Brand Center</Footer.Link>
							<Footer.Link>Blog</Footer.Link>
						</Footer.LinkGroup>
					</div>
					<div>
						<Footer.Title title="help center" />
						<Footer.LinkGroup col={true}>
							<Footer.Link>Discord Server</Footer.Link>
							<Footer.Link>Twitter</Footer.Link>
							<Footer.Link>Facebook</Footer.Link>
							<Footer.Link>Contact Us</Footer.Link>
						</Footer.LinkGroup>
					</div>
					<div>
						<Footer.Title title="legal" />
						<Footer.LinkGroup col={true}>
							<Footer.Link>Privacy Policy</Footer.Link>
							<Footer.Link>Licensing</Footer.Link>
							<Footer.Link>Terms & Conditions</Footer.Link>
						</Footer.LinkGroup>
					</div>
					<div>
						<Footer.Title title="download" />
						<Footer.LinkGroup col={true}>
							<Footer.Link>iOS</Footer.Link>
							<Footer.Link>Android</Footer.Link>
							<Footer.Link>Windows</Footer.Link>
							<Footer.Link>MacOS</Footer.Link>
						</Footer.LinkGroup>
					</div>
				</div>
				<div className="w-full bg-gray-700 py-6 px-4 sm:flex sm:items-center sm:justify-between">
					<Footer.Copyright by="tokonglomerat™" year={2023} />
					<div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
						<Footer.Icon href="#" icon={BsFacebook} />
						<Footer.Icon href="#" icon={BsInstagram} />
						<Footer.Icon href="#" icon={BsTwitter} />
						<Footer.Icon href="#" icon={BsGithub} />
						<Footer.Icon href="#" icon={BsDribbble} />
					</div>
				</div>
			</div>
		</Footer>
	);
}
