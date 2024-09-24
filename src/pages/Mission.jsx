import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import MobileNav from "../components/MobileNav";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../images/hero.jpg";

const Mission = () => {
  let { MobileNavOpen } = useContext(AppContext);

  return (
    <div>
      {MobileNavOpen ? <MobileNav /> : ""}

      <div className={MobileNavOpen ? "opacity-50" : "opacity-100"}>
        <Navbar />

        <div className="mb-36 mx-auto max-w-7xl md:mb-16 mt-20 flex flex-col lg:flex-row-reverse gap-8 lg:gap-16">
          <img
            className="mx-auto w-4/5 md:w-2/5 md:mr-6 lg:mr-12 max-w-2xl lg:mt-20 lg:mb-40 flex rounded-lg"
            src={Hero}
            alt="cyrus guest"
          />

          <div className="lg:ml-20 flex flex-col justify-center items-center">
            <h1 className="text-center text-4xl md:text-5xl text-gradient font-bold">
              Who am I?
            </h1>

            <div className="max-w-xs md:max-w-2xl mt-4">
              <p className="text-center mx-auto mt-2 md:mt-6 md:text-xl">
                My name is Cyrus Guest, I'm a freshman at Framingham State
                University studying computer science. I specialize in web
                development, and have launched an e-commerce platform for music
                posters called Jaded Prints and a volunteer-board called
                PlatePals.
              </p>

              <h2 className="text-center text-3xl mt-6 font-bold text-primary">
                🛠️ Technologies Used
              </h2>
              <p className=" text-gray-500 text-center">
                This project leverages a wide range of AWS services and modern
                web technologies to provide a responsive and scalable solution:
              </p>

              <p className="text-center mx-auto mt-2 md:mt-6 md:text-xl">
                <p className="text-left font-bold">Frontend:</p>
                <ul className="list-disc text-left">
                  <li>React.js (with responsive design)</li>
                  <li>TailwindCSS</li>
                  <li>Toastify</li>
                  <li>Amplify (for frontend hosting and CI/CD)</li>
                </ul>

                <br />

                <p className="text-left font-bold">Backend:</p>
                <ul className="list-disc text-left">
                  <li>Node.js & Express.js (for building the RESTful API)</li>
                  <li>
                    AWS App Runner (to run the backend services in the cloud)
                  </li>
                  <li>
                    AWS ECR (Elastic Container Registry to store Docker images)
                  </li>
                  <li>AWS ECS (Elastic Container Service to run the Docker)</li>
                  <li>AWS S3 (for storing static assets)</li>
                  <li>
                    AWS DynamoDB (as the NoSQL database to manage volunteer
                    opportunities and user data)
                  </li>
                  <li>
                    Amazon Cognito (for authentication and user management)
                  </li>
                </ul>
              </p>

              <p className="text-center mx-auto mt-2 md:mt-6 md:text-xl">
                Thank you for visiting my site, please feel free to contact me
                about any opportunities or questions you may have.
              </p>
            </div>

            <a
              href="https://www.linkedin.com/in/cyrus-guest/"
              target="_blank"
              rel="noreferrer"
              className="text-center btn w-72 font-bold bg-primary rounded-lg shadow-lg text-white glow-on-hover mt-10 text-2xl mx-auto"
            >
              view linkedin
            </a>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Mission;
