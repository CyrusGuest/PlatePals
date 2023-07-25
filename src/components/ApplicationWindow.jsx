import React, { useState } from "react";
import { toast } from "react-toastify";

const ApplicationWindow = () => {
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState("");

  const handleResumeChange = (e) => {
    let selectedFile = e.target.files[0];

    // Add file type validation here
    const fileType = selectedFile.type;
    const validFileTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.apple.pages",
    ];

    if (!validFileTypes.includes(fileType)) {
      toast.error("Please upload a PDF, DOCX, or Pages document", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return;
    }

    setResume(selectedFile);
  };

  return (
    <div className="w-full p-10 flex flex-col justify-center z-20 max-w-2xl bg-gray-200 rounded-lg shadow-lg fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
      <h1 className="text-3xl font-bold">Apply Now</h1>
      <p className="text-gray-500 md:mb-0 mb-10">
        Easy apply through PlatePals
      </p>

      <div className="flex flex-col gap-4 mt-6">
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="apikey">
            Email*
          </label>
          <input
            className="outline-none btn  placeholder:text-gray-500 border-none shadow-lg rounded-lg p-2 mt-1 text-primary bg-white focus:bg-primary focus:text-white focus:placeholder-white transition-all duration-200"
            type="text"
            placeholder="johndoe@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold" htmlFor="apikey">
            Resume*
          </label>
          <input
            className="outline-none btn flex gap-4 placeholder:text-gray-500 border-none shadow-lg rounded-lg p-2 mt-1    text-primary bg-white focus:bg-primary focus:text-white focus:placeholder-white transition-all duration-200"
            type="file"
            accept=".pdf, .docx, application/vnd.apple.pages"
            onChange={(e) => handleResumeChange(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationWindow;
