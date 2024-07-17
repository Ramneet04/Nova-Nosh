"use client";

import React from "react";
import { Link } from "react-router-dom";
// import { Menu, X, MapPin } from 'lucide-react'
import { useState, useEffect } from "react";

import Cook1 from "../assets/Images/Cook1.png";
import Cook2 from "../assets/Images/Cook2.png";
import Cook3 from "../assets/Images/Cook3.png";


function About() {
  const [error, setError] = useState(null);
  const [totalData, setTotalData] = useState([]);

  useEffect(() => {
    const total = async () => {
      setError(null);
      try {
        const res = await fetch("/api/order/total");
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setTimeout(() => {
            setError(null);
          }, 2000);
          return;
        }
        setTotalData(data);
      } catch (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 2000);
      }
    };

    total();
  }, []);

  console.log(totalData.data);

  return (
    <section className="bg-zinc-50">
      <div>
        <div className="mx-auto max-w-7xl ">

          {/* About Us - */}
          <div className="flex items-center flex-col  justify-between px-2  md:px-8 lg:py-6">
            <p className="text-center font-serif  pt-8 pb-2 text-3xl text-gray-900  md:text-5xl md:leading-10">
              About Us
            </p>
            <p className=" hidden lg:block max-w-4xl mx-auto py-4 text-center text-base font-body_font justify-center   text-gray-600 md:text-xl">
              Embark on a Gastronomic Journey: Unveiling the Passion, Precision,
              and Perseverance That Shape Our Online Culinary Haven – Explore
              the Heartfelt Narrative of Our Virtual Kitchen
            </p>
          </div>

          <div className="flex mt-12 lg:mt-16 lg:flex-row gap-6  lg:max-w-5xl   mx-auto flex-col">
            <div className="flex flex-grow lg:w-1/2 flex-col gap-4 lg:gap-7 lg:pb-10 pb-4 lg:mx-4 lg:px-4  md:pt-8">
              <p className="text-xl font-normal font-serif w-full text-gray-800 text-center  lg:text-left md:text-4xl lg:leading-10 leading-6">
                Nova Nosh: A Taste of India's Rich Culinary Tradition!
              </p>
              <p className="max-w-4xl text-sm lg:text-base px-2 lg:px-0 lg:text-left text-center text-gray-600 md:text-xl">
                Nova Nosh, where we blend the vibrant flavors of India with
                modern culinary innovation. Indulge in our exquisite dishes
                crafted with authentic Indian spices and fresh, locally-sourced
                ingredients. Step into a culinary adventure with our team, where creativity sizzles and flavors harmonize, crafting unforgettable experiences for every palate
              </p>
      <Link to ="/menu">
              <p className="text-sm text-center lg:text-left font-semibold md:text-base">
               Explore Now &rarr;
              </p>
              </Link>


            </div>
            <div className="w-full  flex-grow lg:w-1/2  space-y-4">
              <img
                className="h-[200px] w-full rounded-xl object-cover md:h-full"
                src="https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/google-map.jpg"
                alt=""
              />
            </div>
          </div>

          {/* Achievments -> */}
          <div className="bg-gray-100">
            <div className="mx-auto my-28 max-w-5xl py-10 ">
              <div className="flex gap-10 md:flex-row lg:gap-2 justify-center  flex-col md:justify-around">
                
                <div>
                  {totalData.data ? (
                    <p className="text-2xl font-semibold text-center text-green-600">
                      + {totalData.data.totalOrder} Orders{" "}
                    </p>
                  ) : (
                    <p className="text-3xl text-center font-semibold text-green-600">
                      0 Orders
                    </p>
                  )}

                  <h3 className="mt-2 text-lg text-center font-semibold text-black">
                    Total Order Delivered
                  </h3>
                </div>

                <div>
                  {totalData.data ? (
                    <p className="text-2xl font-semibold text-center text-sky-600">
                      + {totalData.data.totalMenu} Menus{" "}
                    </p>
                  ) : (
                    <p className="text-3xl text-center font-semibold text-green-600">
                      0 Menus
                    </p>
                  )}

                  <h3 className="mt-2 text-lg text-center font-semibold text-black">
                    Total Menus Served
                  </h3>
                </div>

                <div>
                  {totalData.data ? (
                    <p className="text-2xl text-center font-semibold text-red-600">
                      + {totalData.data.totalUser} Customers{" "}
                    </p>
                  ) : (
                    <p className="text-3xl text-center font-semibold text-green-600">
                      0 Customers
                    </p>
                  )}

                  <h3 className="mt-2 text-center text-lg font-semibold text-black">
                    Total Customers Registered
                  </h3>
                </div>
              </div>
            </div>
          </div>


        {/* Team */}

          <div className="lg:mt-16 md:mt-12 mt-4  flex items-center">
            <div className=" mx-auto space-y-6 md:w-3/4">
              <p className="text-3xl text-center font-serif  text-gray-900 md:text-4xl">
               My Team
              </p>
              <p className="max-w-4xl text-sm text-center text-gray-700 md:text-base md:mx-3 mx-4 lg:mx-16">
              Embark on a gastronomic journey led by our unparalleled team of culinary wizards, where every dish is a masterpiece and every bite a symphony of taste. Join us and discover why we're the undisputed champions of flavor in the heart of the city
              </p>
              <div></div>
            </div>
          </div>
          <div className=" flex flex-col md:flex-row gap-8 md:gap-4   mx-auto justify-around max-w-5xl px-4 border-b border-gray-300 py-12 pb-20 ">
            
              <div className="rounded-md border" >
                <img
                  src={Cook1}
                  alt= "Cook1"
                  className="h-[300px] w-full rounded-lg object-cover "
                />
                <p className="mt-6 w-full px-2 text-xl  font-semibold text-gray-900">
                Vivaan
                </p>
                <p className="w-full px-2 pb-6 text-sm font-semibold text-gray-500">
                Executive Chef
                </p>
              </div>
              <div className="rounded-md border" >
                <img
                  src={Cook2}
                  alt= "Cook2"
                  className="h-[300px] w-full rounded-lg object-cover "
                />
                <p className="mt-6 w-full px-2 text-xl  font-semibold text-gray-900">
                Aaravendra 
                </p>
                <p className="w-full px-2 pb-6 text-sm font-semibold text-gray-500">
                Chef de Cuisine
                </p>
              </div>

              <div className="rounded-md border" >
                <img
                  src={Cook3}
                  alt= "Cook3"
                  className="h-[300px] w-full rounded-lg object-cover "
                />
                <p className="mt-6 w-full px-2 text-xl  font-semibold text-gray-900">
                Prisha Mishra
                </p>
                <p className="w-full px-2 pb-6 text-sm font-semibold text-gray-500">
                Head Chef
                </p>
              </div>
          </div>
         
        </div>
        
      </div>
    </section>
  );
}

export default About;
