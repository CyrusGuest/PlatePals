import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div>
      <h1 className="md:max-w-3xl max-w-sm mx-auto mt-20 md:mt-28 lg:mt-52 text-center text-4xl md:text-6xl font-bold">
        your <span className="text-gradient font-bold">one-stop-shop</span> for
        food-related volunteer opportunities
      </h1>
      <h3 className="mt-8 md:max-w-3xl max-w-md mx-auto text-xl px-4 md:text-2xl text-[#999999] text-center">
        Volunteer opportunities that actually make a difference - change the
        world by fighting food insecurity
      </h3>
      <div className="flex justify-center mt-10 space-x-6">
        <Link to="/opportunities">
          <button className="text-xl md:text-2xl btn text-white bg-primary">
            opportunities
          </button>
        </Link>
        <Link to="/getstarted">
          <button className="text-xl btn md:text-2xl btn shadow-lg bg-accent text-black">
            start now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
