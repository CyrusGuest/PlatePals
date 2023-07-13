import React from "react";

const JobAttribute = ({ type, rate, fulltime, days }) => {
  if (type === "pay")
    return (
      <div className="bg-gray-200 rounded-lg p-2">
        <img src="" alt="" />
        <h1 className="text-gray-600">From ${rate}/hr</h1>
      </div>
    );

  if (type === "hours")
    return (
      <div className="bg-gray-200 rounded-lg p-2">
        <img src="" alt="" />
        <h1 className="text-gray-600">
          {fulltime ? "Full time" : "Part time"}
        </h1>
      </div>
    );

  if (type === "schedule")
    return (
      <div>
        <img src="" alt="" />
        <h1>{days}</h1>
      </div>
    );
};

export default JobAttribute;
