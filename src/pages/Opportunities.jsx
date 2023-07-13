import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import MobileNav from "../components/MobileNav";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Search from "../components/Search";
import Opportunity from "../components/Opportunity";

const Opportunities = () => {
  let { MobileNavOpen } = useContext(AppContext);

  const testPosition = {
    name: "Food Kitchen Volunteer",
    organization: "Philly Food Kitchen",
    location: "Philadelphia, PA 01534",
    rate: 7.5,
    fulltime: true,
    id: 1,
  };

  return (
    <div>
      {MobileNavOpen ? <MobileNav /> : ""}
      <div className={MobileNavOpen ? "opacity-50" : "opacity-100"}>
        <Navbar />

        <Search />

        <div className="grid mt-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto p-3">
          <Opportunity position={testPosition} />
          <Opportunity position={testPosition} />
          <Opportunity position={testPosition} />
          <Opportunity position={testPosition} />
          <Opportunity position={testPosition} />
          <Opportunity position={testPosition} />
          <Opportunity position={testPosition} />
          <Opportunity position={testPosition} />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Opportunities;
