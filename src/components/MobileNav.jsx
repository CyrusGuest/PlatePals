import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import arrow from "../images/arrow.svg";
import logo from "../images/logo.svg";
import menuDots from "../images/menu-dots.svg";

const MobileNav = () => {
  let { setMobileNavOpen } = useContext(AppContext);

  return (
    <div className="fixed z-20 w-3/4 h-full bg-white right-0">
      <div className="flex mt-4">
        <img
          onClick={() => setMobileNavOpen(false)}
          src={arrow}
          alt=""
          className="cursor-pointer mr-8 mt-2"
        />
        <img src={logo} alt="" className="cursor-pointer mx-auto w-12 mt-4" />
        <img
          onClick={() => setMobileNavOpen(false)}
          src={menuDots}
          alt=""
          className="cursor-pointer ml-auto mr-4 mt-4"
        />
      </div>

      <div className="flex flex-col ml-6 mt-10 gap-10">
        <ul className="text-2xl ">
          <h1 className="font-bold text-5xl text-gradient">volunteer</h1>
          <Link onClick={() => setMobileNavOpen(false)} to="/listings">
            <h4 className="mt-1">opportunities</h4>
          </Link>
          <Link onClick={() => setMobileNavOpen(false)} to="/mission">
            <h4 className="mt-1">our mission</h4>
          </Link>
        </ul>

        <Link
          onClick={() => setMobileNavOpen(false)}
          className="btn bg-primary text-white text-2xl text-center fixed bottom-10 w-8/12"
          to="/signin"
        >
          sign in
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
