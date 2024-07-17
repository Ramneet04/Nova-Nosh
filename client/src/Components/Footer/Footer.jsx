import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import { AiFillLinkedin } from "react-icons/ai";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <section className="relative overflow-hidden bg-black  py-10">
      <div className="relative z-10 mx-auto  max-w-7xl px-4">
        <div className="-m-6 flex  flex-wrap ">

          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center  md:justify-start justify-center">
                <Link
                  to="/"
                  className={`whitespace-nowrap self-center font-logo_font text-gray-400 text-sm sm:text-xl font-semibold `}
                >
                  <span className="px-2 py-1 font-logo_font    text-[#E52A3D] rounded-lg">
                    NOVA
                  </span>
                  NOSH
                </Link>
                
              </div>
              <div className="text-gray-500 text-sm text-center md:text-left">
                <p>
                Discover the magic of Nova Nosh: Where every slice of cake brings joy & every meal is a culinary adventure. Join us for a delightful dining experience i.e promises to tantalize your taste buds & leave you craving for more.
                </p>
              </div>
              <div>
              <div>
                <ul className="flex p-4 md:justify-start justify-center space-x-4">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      <FaFacebook className="text-2xl" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/iampriyanshu29/?next=%2F" className="text-gray-600 hover:text-red-600">
                      <FaInstagram className="text-2xl" />
                    </a>
                  </li>
                  <li>
                    <a href="https://x.com/iampriyanshu29" className="text-gray-600 hover:text-gray-100">
                      <FaXTwitter className="text-2xl" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/in/iampriyanshu29/" className="text-gray-600 hover:text-blue-700">
                      <AiFillLinkedin className="text-2xl" />
                    </a>
                  </li>
                </ul>
              </div>
              
              </div>
            </div>
          </div>

          <div className=" hidden md:block w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-6  text-base font-semibold uppercase  text-[#E52A3D]">
                Page
              </h3>
              <ul>
                <li className="mb-3">
                  <a
                    className=" text-base font-medium text-gray-600 hover:text-gray-500"
                    href="/"
                  >
                    Home
                  </a>
                </li>
                <li className="mb-3">
                  <a
                    className=" text-base font-medium text-gray-600 hover:text-gray-500"
                    href="/menu"
                  >
                    Menu
                  </a>
                </li>
                <li className="mb-3">
                  <a
                    className=" text-base font-medium text-gray-600 hover:text-gray-500"
                    href="/reservations"
                  >
                 Reservations
                  </a>
                </li>
                <li>
                  <a
                    className=" text-base font-medium text-gray-600 hover:text-gray-500"
                    href="/order"
                  >
                   Order Online
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="hidden md:block w-full p-6 md:w-1/2 lg:w-3/12">
          <div className="h-full">
              <h3 className="tracking-px mb-6  text-base font-semibold uppercase  text-[#E52A3D]">
              Information
              </h3>
              <ul>
                <h1> </h1>
                <li className="mb-3">
                  <a
                    className=" text-base font-medium text-gray-600 hover:text-gray-500"
                    href="/about"
                  >
                    About Us
                  </a>
                </li>
                <li className="mb-3">
                  <a
                    className=" text-base font-medium text-gray-600 hover:text-gray-500"
                    href="/testimonial"
                  >
                 Testimonial
                  </a>
                </li>
                <li>
                  <a
                    className=" text-base font-medium text-gray-600 hover:text-gray-500"
                    href="/events"
                  >
                   Events
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className=" hidden md:block w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-6  text-base font-semibold uppercase  text-[#E52A3D]">
                Get In Touch
              </h3>
              <ul>
                <h1> </h1>
                <li className="mb-3">
                  <a
                    className=" text-base font-medium text-gray-600 hover:text-gray-500"
                    href="/menu"
                  >
                    Menu
                  </a>
                </li>
                <li className="mb-3">
                  <a
                    className=" text-base font-medium text-gray-600 hover:text-gray-500"
                    href="/reservations"
                  >
                 Reservations
                  </a>
                </li>
                <li>
                  <a
                    className=" text-base font-medium text-gray-600 hover:text-gray-500"
                    href="/order"
                  >
                   Order Online
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className=" ">
      <div className="flex justify-center mt-16">
                <p className="text-sm text-gray-500">
                © Copyright {year} All Rights Reserved by  <span className="text-[#E52A3D] font-bold">NOVA</span> <span className="font-bold text-gray-400">NOSH</span>
                </p>
              </div>
      </div>
    </section>
  );
}

export default Footer;
