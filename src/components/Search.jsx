import React from "react";

const Search = () => {
  return (
    <div className="text-center px-4">
      <h1 className="font-bold text-3xl">Opportunities</h1>
      <p className="text-slate-500 ">
        Explore oppurtunities here - change the world
      </p>

      <form className="flex flex-col gap-4 mt-6 max-w-2xl mx-auto">
        <div className="mx-4 border-2 rounded-lg border-slate-400 flex pl-3 py-4 shadow-lg gap-3">
          <label className="font-bold text-lg">What</label>
          <input
            className="outline-none w-full"
            type="text"
            placeholder="Job title, keyword, or company"
          />
          <img src="" alt="" />
        </div>
        <div className="mx-4 border-2 rounded-lg border-slate-400 flex pl-3 py-4 shadow-lg gap-3">
          <label className="font-bold text-lg">Where</label>
          <input
            className="outline-none w-full"
            type="text"
            placeholder="Philadelphia, PA"
          />
          <img src="" alt="" />
        </div>

        <button className="mx-4 btn bg-primary text-white">Search</button>
      </form>
    </div>
  );
};

export default Search;
