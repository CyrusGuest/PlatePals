import React, { useContext, useState } from "react";
import ExploreGraphic from "../images/exploregraphic.png";
import Loading from "./Loading";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const CreateAccountComp = () => {
  const [individual, setIndividual] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");
  const { User, setUser } = useContext(AppContext);
  let navigate = useNavigate();

  const handleSubmission = async (e) => {
    e.preventDefault();

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (email === "" || password === "" || name === "")
      return toast.error("Please fill out all fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    if (!emailRegex.test(email) || !passwordRegex.test(password))
      return toast.error("Please enter a valid email/password", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    const user = {
      account_type: `${individual ? "Individual" : "Organization"}`,
      name,
      email,
      password,
    };

    setLoading(true);

    try {
      const result = await axios.post(
        "http://localhost:3001/api/v1/create_user",
        user
      );

      setLoading(false);
      toast.warning("Please confirm your account", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setUser(result.data.user);
      console.log(User);
      navigate("/confirmation");
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data.error, {
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
  };

  return (
    <div className="flex gap-8 mx-auto justify-center mt-20 mb-40 shadow-lg rounded-lg w-fit ">
      <div className="bg-white hidden text-primary rounded-l-lg h-full w-full max-w-lg md:flex justify-center flex-col">
        <h1 className="font-bold text-3xl text-black mt-10 text-center">
          Welcome!
        </h1>
        <p className="text-center text-gray-500">
          We're glad you decided to start volunteering.
        </p>
        <img
          src={ExploreGraphic}
          alt=""
          className="object-contain w-3/4 mx-auto mt-20"
        />
      </div>

      <div className="md:mt-4 mx-auto md:mx-0 w-96 bg-primary text-white p-6 rounded-lg md:rounded-r-lg">
        <h1 className="font-bold text-3xl">Create an account</h1>
        <p>
          Already have an account? Sign in{" "}
          <Link to="/signin" className="underline font-bold">
            here
          </Link>
          .
        </p>

        {loading ? (
          <Loading />
        ) : (
          <form className="flex flex-col max-w-md mt-4 md:mx-auto gap-2 text-x">
            <div className="flex flex-col">
              <label className="font-bold" htmlFor="apikey">
                User type
              </label>

              <div className="flex gap-2">
                <button
                  className={`btn w-full mt-1 ${
                    individual
                      ? " text-primary bg-white "
                      : " text-white bg-primary "
                  }`}
                  type="button"
                  onClick={() => setIndividual(true)}
                >
                  Individual
                </button>
                <button
                  className={`btn w-full mt-1 ${
                    !individual
                      ? " text-primary bg-white "
                      : " text-white bg-primary "
                  }`}
                  type="button"
                  onClick={() => setIndividual(false)}
                >
                  Organization
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-bold" htmlFor="apikey">
                {individual ? "Full Name" : "Organization Name"}
              </label>
              <input
                className="outline-none btn placeholder-primary border-none shadow-lg rounded-lg p-2 mt-1 text-primary bg-white focus:bg-primary focus:text-white focus:placeholder-white transition-all duration-200"
                type="text"
                placeholder={individual ? "Johnathon Doe" : "John Doe Inc."}
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-bold" htmlFor="apikey">
                Email
              </label>
              <input
                className="outline-none btn placeholder-primary border-none shadow-lg rounded-lg p-2 mt-1 text-primary bg-white focus:bg-primary focus:text-white focus:placeholder-white transition-all duration-200"
                type="text"
                placeholder="johndoe@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-bold" htmlFor="apikey">
                Password
              </label>
              <input
                className="outline-none btn placeholder-primary border-none shadow-lg rounded-lg p-2 mt-1 text-primary bg-white focus:bg-primary focus:text-white focus:placeholder-white transition-all duration-200"
                type="password"
                placeholder="johnlovesdogs123"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <button
              className="btn text-primary bg-white mt-12"
              type="button"
              onClick={(e) => handleSubmission(e)}
            >
              Create account
            </button>

            <p className="text-sm text-center">Get started today!</p>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateAccountComp;
