import React from "react";
import { Link } from "react-router-dom";

const ApplicationComp = ({ application }) => {
  return (
    <Link
      to={`${
        application.status === "Open"
          ? `/opportunities/${application.organizationId}/${application.opportunityId}`
          : ""
      }`}
      className={`${
        application.status === "Open" ? "cursor-pointer" : ""
      } border-2 rounded-lg border-slate-400 text-gray-500 flex flex-col pl-3 py-4 shadow-lg text-sm`}
    >
      <h1 className="text-black font-bold text-lg">
        {application.title} -{" "}
        <span
          className={`${
            application.status === "Open" ? "text-gray-500" : "text-red-600"
          }`}
        >
          {application.status}
        </span>
      </h1>
      <p>{application.organization}</p>
      <p>
        {application.city}, {application.state} {application.zip}
      </p>
      <p>Date submitted: {application.dateSubmitted}</p>
    </Link>
  );
};

export default ApplicationComp;
