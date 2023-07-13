import React from "react";
import { Link } from "react-router-dom";
import MainGraphic from "../images/landinggraphic.jpg";

const LandingGraphic = () => {
  return (
    <div className="mb-36 mt-20 md:mt-28 lg:mt-60 flex flex-col-reverse lg:flex-row-reverse gap-8">
      <div className="lg:mr-20 flex flex-col justify-center items-center">
        <h1 className="text-center text-4xl md:text-5xl font-bold">
          Welcome to PlatePals!
        </h1>

        <div className="max-w-xs md:max-w-2xl mt-4">
          <p className="text-center mx-auto mt-2 md:mt-6 md:text-xl">
            <span className="font-bold">
              Welcome to PlatePals, the bridge between goodwill and food
              security.
            </span>{" "}
            We're on a mission to connect passionate volunteers with
            organizations tackling food insecurity, creating a nourishing
            network of care across communities. PlatePals is more than a
            platform - it's a movement towards a world where everyone has access
            to nutritious food.
          </p>

          <p className="text-center mx-auto mt-2 md:mt-6 md:text-xl">
            <span className=" font-bold">Join us to make a difference.</span> By
            volunteering through PlatePals, you're not just giving your time;
            you're nourishing lives, supporting local communities, and combating
            a global issue. Let's transform the narrative of food insecurity,
            one plate at a time.
          </p>

          <p className="text-center mx-auto mt-2 md:mt-6 md:text-xl">
            <span className=" font-bold">
              Together, we are PlatePals - feeding communities, nourishing
              connections.
            </span>{" "}
            Because in the fight against hunger, every helping hand makes a
            world of difference. Connect with us today, and let's create a
            better, well-fed future for all.
          </p>
        </div>

        <Link
          to="/mission"
          className="text-center btn xxw-72 font-bold bg-white text-black rounded-lg shadow-lg glow-on-hover mt-10 text-2xl mx-auto"
        >
          Learn More
        </Link>
      </div>

      <img
        className="mx-auto w-4/5 lg:w-2/5 lg:mt-20 lg:mb-40 lg:ml-16 object-contain"
        src={MainGraphic}
        alt=""
      />
    </div>
  );
};

export default LandingGraphic;
