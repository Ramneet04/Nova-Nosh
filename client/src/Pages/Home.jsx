"use client";

import React, { useEffect } from "react";
// import { CheckCircle, ChevronDown, ChevronUp, Menu, Star, X } from 'lucide-react'
import Cook from "../assets/Images/COOKS.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import Cook1 from "../assets/Images/Cook1.png";
import Cook2 from "../assets/Images/Cook2.png";
import Cook3 from "../assets/Images/Cook3.png";
import { GiCook } from "react-icons/gi";
import { BiSolidDish } from "react-icons/bi";
import { GiThreeLeaves } from "react-icons/gi";
import { FaHotel } from "react-icons/fa";
function Home() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [error, setError] = useState("");
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    const fetchmenu = async () => {
      try {
        const res = await fetch(`/api/menu/getMenu?limit=5&order=asc`, {
          method: "GET",
          headers: {
            "COntent-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok) {
          setMenuData(data);
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchmenu();
  }, []);

  const menu = menuData?.message?.menu;
  console.log(menu);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [isOpen, setIsOpen] = useState(
    Array.from({ length: 4 }).map(() => false)
  );

  const toggleDropdown = (index) => {
    const newIsOpen = [...isOpen];
    newIsOpen[index] = !newIsOpen[index];
    setIsOpen(newIsOpen);
  };

  const faqs = [
    {
      question: "What are your restaurant's opening hours?",
      answer:
        "Our restaurant is open from 9:00 AM to 8:00 PM on Tuesday to Sunday.",
    },
    {
      question: "Do you offer vegetarian/vegan options?",
      answer:
        "Yes, we offer a variety of vegetarian and vegan dishes on our menu.",
    },
    {
      question: "Are reservations required for large groups or events?",

      answer:
        "Reservations are recommended for large groups or events to ensure availability and the best possible dining experience.",
    },
    {
      question: "Do you offer delivery or takeout options? ",
      answer:
        "A: Yes, we offer both delivery and takeout services. You can place an order through our website or by calling us.",
    },
  ];
  return (
    <div className="w-full bg-zinc-50">
      {/* Hero Section */}
      <div className="relative w-full bg-zinc-50">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12  lg:px-8">
          <div className="flex flex-col justify-center px-4 py-12 md:py-16 lg:col-span-7 lg:gap-x-6 lg:px-6 lg:py-20 xl:col-span-6">
            <div className="mt-8 flex lg:mx-0 mx-auto max-w-max items-center space-x-2 rounded-full bg-gray-100 p-1">
              <Link to="/menu">
                <p className="text-sm font-medium"> Explore Menu &rarr;</p>
              </Link>
            </div>
            <h1 className="mt-8 text-3xl  font-bold font-sans text-center lg:text-left tracking-tight text-black md:text-4xl lg:text-6xl">
              Experience Culinary Excellence:{" "}
              <span className=" text-[#E52A3D] ">NOVA NOSH</span>
            </h1>
            <p className="mt-8 text-lg text-center  lg:text-left text-gray-700">
              Setting the Standard: By merging excellence with taste, trust, and
              unforgettable moments, where each bite elevates your palate &
              reshaping your dining expectations in the city.
            </p>
            <div className="mt-8 flex items-center mx-auto lg:mx-0 lg:items-start gap-4">
              <div>
                <Link to="/reservations">
                  <button
                    type="button"
                    className="rounded-md bg-black  px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Book Dining
                  </button>
                </Link>
              </div>
              <div>
                <Link to="/menu">
                  <button
                    type="button"
                    className="rounded-md bg-[#E52A3D] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Order Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="relative my-auto mx-auto md:hidden lg:block lg:col-span-5 lg:-mr-8 xl:col-span-6">
            <img
              className="object-cover w-full h-auto  lg:w-auto lg:h-auto   lg:aspect-w-4 lg:aspect-h-3 xl:w-auto xl:aspect-w-16 xl:aspect-h-9"
              src={Cook}
              alt="Cook Image"
            />
          </div>
        </div>
      </div>

      {/* Our menu -> */}
      <div className="lg:my- md:my-16 my-10 bg-gray-100 py-10">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-3xl font-bold text-center leading-tight text-black sm:text-4xl lg:text-5xl">
            Prime Picks
          </h2>
          <p className="mt-4 text-center text-base leading-relaxed text-gray-600 mx-auto">
            Savor Our Signature Selections: Culinary Delights Await Your Palate
            Cook.
          </p>
        </div>
        <div className="mx-auto  max-w-7xl lg:max-w-8xl   bg-gray-100 lg:px-8 flex flex-col md:flex-row  ">
          {menu?.menus.map((m) => (
            <div
              key={m._id}
              className="
                mx-auto py-4 
          "
            >
              <Link to={`/menu/${m.slug}`}>
                <div>
                  <div className="mx-auto flex md:h-32 md:w-32 lg:h-44 lg:w-44  h-48 w-48 items-center justify-center rounded-full ">
                    <img src={m.menuImage}></img>
                  </div>

                  <h3 className="mt-4 text-center text-lg font-semibold text-black">
                    {m.menuName}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* FAQs */}
      <section className="mx-auto max-w-7xl bg-gray-50 px-2 py-10 md:px-0">
        <div>
          <div className="mx-auto text-center max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-center text-base leading-relaxed text-gray-600 mx-auto">
              Clearing the Path: Navigating Your Queries with Ease and Assurance
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl space-y-4 md:mt-16">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-md border border-gray-400 shadow-lg transition-all duration-200"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-5 sm:p-6"
                  onClick={() => toggleDropdown(index)}
                >
                  <span className="flex text-lg font-semibold text-black">
                    {faq.question}
                  </span>
                </button>
                {isOpen[index] && (
                  <div className="px-4 pb-5 sm:px-6 sm:pb-6">
                    <p className="text-gray-500">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="textbase mt-6 text-center text-gray-600">
            Can't find what you're looking for?{" "}
            <Link
              to="/contact"
              title=""
              className="font-semibold text-black hover:underline"
            >
              Contact our support
            </Link>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <div className="lg:my-20  md:my-16 my-10 bg-gray-100 py-10">
        <div className="mx-auto max-w-2xl pb-4 lg:text-center">
          <h2 className="text-3xl text-center font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            Why US ?
          </h2>
          <p className="mt-4  text-center text-base leading-relaxed text-gray-600 mx-auto">
            Elevate Your Experience: Embrace the Excellence of Our Establishmen
          </p>
        </div>
        <div className="grid grid-cols-1 px-4 lg:px-6 gap-y-8 text-center sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
          <div>
            <div className="mt-6">
              <FaHotel className="mx-auto px-3 py-3 text-sky-500 flex h-20 w-20 items-center justify-center rounded-full bg-sky-100" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-black">
              Memorable Ambiance
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              Immerse yourself in an inviting atmosphere designed to enhance
              your dining pleasure, creating unforgettable moments with friends
              and family.
            </p>
          </div>
          <div>
            <div className="mt-6">
              <GiCook className="mx-auto px-3 py-3 text-gray-500 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-black">
              Exceptional Service
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              Our dedicated team is committed to providing you with an
              unparalleled dining experience, where warmth and hospitality meet
              your every need.
            </p>
          </div>
          <div>
            <div className="mt-6">
              <BiSolidDish className="mx-auto px-3 py-3 text-red-500 flex h-20 w-20 items-center justify-center rounded-full bg-red-100" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-black">
              Authentic Flavors
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              Experience the essence of tradition with our carefully crafted
              dishes, bursting with authentic flavors that transport you to the
              heart of culinary heritage
            </p>
          </div>
          <div>
            <div className="mt-6">
              <GiThreeLeaves className="mx-auto px-3 py-3 text-green-500 flex h-20 w-20 items-center justify-center rounded-full bg-green-100" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-black">
              Fresh Ingredients
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              We source only the freshest, highest quality ingredients to ensure
              every bite is a celebration of freshness, health, and taste.
            </p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="lg:mt-12 md:mt-10 mt-4  flex items-center">
        <div className=" mx-auto space-y-6 md:w-3/4">
          <div className="  text-center  mx-auto ">
            <h2 className="text-3xl text-center font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Culinary Squad
            </h2>
            <p className="mt-4  text-center  text-base leading-relaxed text-gray-600 mx-auto">
              Taste the Magic: Culinary Creations Crafted by Our Squad
            </p>
          </div>
          <div></div>
        </div>
      </div>
      <div className=" flex flex-col md:flex-row gap-8 md:gap-4   mx-auto justify-around max-w-5xl px-2 py-8 md:py-12 pb-20 ">
        <div className="rounded-md border">
          <img
            src={Cook1}
            alt="Cook1"
            className="h-[300px] w-full rounded-lg object-cover "
          />
          <p className="mt-6 w-full px-2 text-xl text-center font-semibold text-gray-900">
            Vivaan
          </p>
          <p className="w-full px-2 pb-6 text-sm  text-center  font-semibold text-gray-500">
            Executive Chef
          </p>
        </div>
        <div className="rounded-md border">
          <img
            src={Cook2}
            alt="Cook2"
            className="h-[300px] w-full rounded-lg object-cover "
          />
          <p className="mt-6 w-full px-2 text-xl  text-center   font-semibold text-gray-900">
            Aaravendra
          </p>
          <p className="w-full px-2 pb-6 text-sm font-semibold  text-center  text-gray-500">
            Chef de Cuisine
          </p>
        </div>

        <div className="rounded-md border">
          <img
            src={Cook3}
            alt="Cook3"
            className="h-[300px] w-full rounded-lg object-cover "
          />
          <p className="mt-6 w-full px-2 text-xl  text-center   font-semibold text-gray-900">
            Prisha Mishra
          </p>
          <p className="w-full px-2 pb-6 text-sm  text-center  font-semibold text-gray-500">
          Culinary Maestro
          </p>
        </div>
      </div>

      {/* Offers Poster */}
      <div className="relative w-full  px-4 py-4 md:py-12 lg:px-8">
  <div className="mx-auto bg-red-400 rounded-lg shadow p-8 max-w-5xl">
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl font-bold text-white mb-4 lg:text-4xl xl:text-5xl">Hungry?</h2>
      <p className="text-lg text-white mb-6 lg:text-xl xl:text-2xl">Grab our delicious offers now!</p>
      <div className="flex  flex-row gap-4">
        <Link to="/menu">
        <button
          type="button"
          className="bg-black text-white px-6 py-3 rounded-md text-sm font-semibold shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 lg:text-base"
        >
          Order Now
        </button>
        </Link>
        <Link to="/reservations">
        <button
          type="button"
          className="bg-white  text-red-400 px-6 py-3 rounded-md text-sm font-semibold shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 lg:text-base"
        >
          Book Table
        </button>
        </Link>
      </div>
    </div>
  </div>
</div>

    </div>
  );
}

export default Home;
