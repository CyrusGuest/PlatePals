import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import MobileNav from "../components/MobileNav";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Mission = () => {
  let { MobileNavOpen } = useContext(AppContext);

  return (
    <div>
      {MobileNavOpen ? <MobileNav /> : ""}

      <div className={MobileNavOpen ? "opacity-50" : "opacity-100"}>
        <Navbar />

        <Footer />
      </div>
    </div>
  );
};

export default Mission;
