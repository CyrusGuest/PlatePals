import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import MobileNav from "../components/MobileNav";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  let { MobileNavOpen } = useContext(AppContext);
  let navigate = useNavigate();

  const opportunity = {
    title: "Food Kitchen Volunteer",
    applicants: 324,
    status: "Open",
    organizationId: 0,
    id: 0,
  };

  return (
    <div>
      {MobileNavOpen ? <MobileNav /> : ""}

      <div className={MobileNavOpen ? "opacity-50" : "opacity-100"}>
        <Navbar />

        <div className="mx-6 mb-60 md:max-w-xl md:mx-auto md:border-2 md:border-slate-400 md:shadow-lg md:rounded-lg md:py-6 md:px-8">
          <div className="flex mt-4 gap-4">
            <div onClick={() => navigate(-1)}>
              <FontAwesomeIcon
                icon={faArrowCircleLeft}
                className="text-primary text-5xl cursor-pointer hover:rotate-[360deg] duration-300"
              />
            </div>
            <div className="flex flex-col mr-auto">
              <h1 className="text-3xl font-bold">My Listings</h1>
              <p className="text-gray-500 text-sm">
                Create, edit, and manage your listings here
              </p>
            </div>
            <div>
              <FontAwesomeIcon
                icon={faPlusCircle}
                className="text-primary opacity-0 md:opacity-100 my-auto text-5xl md:text-7xl md:fixed bottom-7 right-10 cursor-pointer"
              />
            </div>
          </div>

          <button className="btn md:hidden bg-primary text-lg text-white w-full mt-4">
            Create Listing
          </button>

          <div className="flex flex-col gap-4 mt-8">
            <ListingCard listing={opportunity} />
            <ListingCard listing={opportunity} />
            <ListingCard listing={opportunity} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Landing;
