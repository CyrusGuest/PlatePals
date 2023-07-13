import React from "react";
import { useParams } from "react-router-dom";

const OpportunityPage = () => {
  const { id } = useParams();

  return <div>Opportunity: ${id}</div>;
};

export default OpportunityPage;
