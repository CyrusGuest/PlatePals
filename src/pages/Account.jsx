import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import MobileNav from "../components/MobileNav";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faGlobe,
  faUser,
  faArrowCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import ApplicationComp from "../components/ApplicationComp";
import { useNavigate } from "react-router-dom";

const Account = () => {
  let { MobileNavOpen, User, handleLogout } = useContext(AppContext);
  let navigate = useNavigate();

  const testApplication = {
    title: "Food Kitchen Volunteer",
    organization: "Philly Food Kitchen",
    city: "Philadelphia",
    state: "PA",
    zip: "01434",
    dateSubmitted: "05/20/2023",
    status: "Open",
    organizationId: 0,
    opportunityId: 0,
  };

  return (
    <div>
      {MobileNavOpen ? <MobileNav /> : ""}

      <div className={MobileNavOpen ? "opacity-50" : "opacity-100"}>
        <Navbar />

        <div className="px-6 flex flex-col gap-6 md:max-w-xl md:mx-auto md:border-2 md:border-slate-400 md:shadow-lg md:rounded-lg md:py-6">
          <div className="flex mt-4 gap-4">
            <div onClick={() => navigate(-1)}>
              <FontAwesomeIcon
                icon={faArrowCircleLeft}
                className="text-primary text-5xl cursor-pointer hover:rotate-[360deg] duration-300"
              />
            </div>
            <div className="flex flex-col mr-auto">
              <h1 className="text-3xl font-bold">My account</h1>
              <p className="text-gray-500 text-sm">
                View your account details here
              </p>
            </div>
          </div>

          <button
            className="btn bg-primary text-white text-2xl"
            onClick={() => {
              navigate("/");
              handleLogout();
            }}
          >
            Log out
          </button>

          <div className="flex flex-col">
            <label className="font-bold text-xl">Your email</label>
            <div className="border-2 rounded-lg border-slate-400 text-gray-500 flex pl-3 py-4 shadow-lg gap-3">
              <p className="mr-auto">{User.email}</p>
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-gray-500 text-2xl mr-4 float-right"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-bold text-xl">Your name</label>
            <div className=" border-2 rounded-lg border-slate-400 text-gray-500 flex pl-3 py-4 shadow-lg gap-3">
              <p className="mr-auto">{User.name}</p>
              <FontAwesomeIcon
                icon={faUser}
                className="text-gray-500 text-2xl mr-4 float-right"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-bold text-xl">Account type</label>
            <div className=" border-2 rounded-lg border-slate-400 text-gray-500 flex pl-3 py-4 shadow-lg gap-3">
              <p className="mr-auto">{User.account_type}</p>
              <FontAwesomeIcon
                icon={faGlobe}
                className="text-gray-500 text-2xl float-right mr-4"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl font-bold mb-1">Your applications</h1>
            <div className="flex flex-col gap-4">
              <ApplicationComp application={testApplication} />
              <ApplicationComp application={testApplication} />
              <ApplicationComp application={testApplication} />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Account;
