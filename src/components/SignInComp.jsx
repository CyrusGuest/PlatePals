import React, { useState, useContext } from "react";
import ExploreGraphic from "../images/exploregraphic.png";
import Loading from "./Loading";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const SignInComp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { User, setUser } = useContext(AppContext);
  let navigate = useNavigate();

  const handleSubmission = async (e) => {
    e.preventDefault();

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (email === "" || password === "")
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

    console.log(emailRegex.test(email));
    console.log(emailRegex.test(password));

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
      email,
      password,
    };

    setLoading(true);

    try {
      const result = await axios.post(
        "http://localhost:3001/api/v1/signin",
        user
      );

      setLoading(false);
      setUser(result.data.user);
      toast.success("Sign in succesful 🎉🥳", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/opportunities");
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
          Welcome back!
        </h1>
        <p className="text-center text-gray-500">
          We're glad you decided to keep volunteering.
        </p>
        <img
          src={ExploreGraphic}
          alt=""
          className="object-contain w-3/4 mx-auto mt-10"
        />
      </div>

      <div className="md:mt-4 mx-auto md:mx-0 w-96 bg-primary text-white p-6 rounded-lg md:rounded-r-lg">
        <h1 className="font-bold text-3xl">Sign in</h1>
        <p>
          Don't have an account? Create one{" "}
          <Link to="/getstarted" className="underline font-bold">
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
              className="btn text-primary bg-white mt-36"
              type="button"
              onClick={(e) => handleSubmission(e)}
            >
              Sign in
            </button>

            <p className="text-sm text-center">Forgot your password?</p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignInComp;
