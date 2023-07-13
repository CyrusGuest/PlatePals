import React from "react";
import JobAttribute from "./JobAttribute";
import { Link } from "react-router-dom";

const Opportunity = ({ position }) => {
  return (
    <Link
      to={`/opportunities/${position.id}`}
      className="m-4 border-2 rounded-lg border-slate-400 p-4 shadow-lg cursor-pointer"
    >
      <h1 className="font-bold ">{position.name}</h1>
      <h3 className="text-slate-600">{position.organization}</h3>
      <h3 className="text-slate-600">{position.location}</h3>

      <div className="flex gap-3 mt-2">
        <JobAttribute type="pay" rate={position.rate} />
        <JobAttribute type="hours" fulltime={position.fulltime} />
      </div>

      <ul className="list-disc ml-4 mt-3 text-sm text-gray-500">
        <li>Bachelors degree in M.S. Computer Science</li>
        <li>Translate three years</li>
        <li>Minimum 40 hours a week</li>
        <li>Must be really cute</li>
      </ul>

      <button className="btn bg-primary text-white w-full mt-2">View</button>
    </Link>
  );
};

export default Opportunity;
