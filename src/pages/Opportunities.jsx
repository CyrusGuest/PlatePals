import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import MobileNav from "../components/MobileNav";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Search from "../components/Search";
import Opportunity from "../components/Opportunity";
import Loading from "../components/Loading";

const Opportunities = () => {
  let { MobileNavOpen } = useContext(AppContext);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);

  let isFetched = false;

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "http://api.platepals.org/api/v1/opportunities"
        );
        setOpportunities(res.data.items);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load opportunities from server", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      setLoading(false);
    };

    if (!isFetched) fetchOpportunities();
    isFetched = true;
  }, []);

  return (
    <div>
      {MobileNavOpen ? <MobileNav /> : ""}
      <div className={MobileNavOpen ? "opacity-50" : "opacity-100"}>
        <Navbar />

        <Search setOpportunities={setOpportunities} setLoading={setLoading} />

        {loading ? (
          <div className="mx-auto w-fit mt-10 mb-80">
            <Loading />
          </div>
        ) : (
          <div className="grid mt-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto p-3">
            {opportunities.map((opportunity) => (
              <Opportunity key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        )}

        {opportunities.length === 0 ? (
          <p className="text-gray-500 text-center mx-10">
            No opportunities were found. Please try a different search or try
            again later.
          </p>
        ) : (
          ""
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Opportunities;
