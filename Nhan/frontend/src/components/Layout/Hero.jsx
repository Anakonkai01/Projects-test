import React from "react";

import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="z-10 relative">
      
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-5 flex flex-col justify-center items-center text-white">
        <h1 className="tex-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
          Vacation <br /> Ready
        </h1>
        <p className="text-sm tracking-tighter md:text-lg mb-6">
          Explore our vaction-ready outfits with fast worldwide shipping and
          easy returns.
        </p>
        <Link
          to="#"
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300 ease-in-out"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default Hero;
