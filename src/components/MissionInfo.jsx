import React from "react";
import foodKitchenIMG from "../images/foodKitchen.jpg";

const MissionInfo = () => {
  return (
    <div className="mb-8 mt-8 md:mt-22 lg:mt-10 flex flex-col lg:flex-row gap-8">
      <img
        className="rounded-md mx-auto w-3/5 lg:w-2/5 mb-10 max-w-4xl lg:mb-0 object-cover lg:mr-16 shadow-lg"
        src={foodKitchenIMG}
        alt=""
      />

      <div className="lg:ml-16 flex flex-col justify-center items-center lg:items-start">
        <div className="max-w-xs md:max-w-2xl pr-8">
          <p className="text-center md:text-left mt-2 md:mt-6 md:text-xl">
            <span className="font-bold">
              Nearly 325,000 people are food insecure
            </span>{" "}
            in the Philadelphia Area today. At PlatePals, our mission is to
            bridge the gap between food kitchens in need and compassionate 
            individuals eager to make a difference. We believe that everyone
            deserves access to a warm, nourishing meal, and we recognize the
            power of volunteers in creating positive change.
          </p>

          <p className="text-center md:text-left mt-2 md:mt-6 md:text-xl">
            Our platform serves as a dynamic hub, effortlessly connecting food
            kitchens seeking volunteers with individuals eager to lend a helping
            hand. Developed by students at the Drexel Digital Development Camp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissionInfo;
