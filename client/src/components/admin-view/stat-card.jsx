import React from "react";

const StatCard = ({ title, icon, value }) => {
  return (
    <div className="border border-gray-200 bg-white hover:shadow-sm transition-all duration-300 p-4 flex items-start justify-between rounded-md cursor-pointer">
      <div>
        <p className="font-medium">{title}</p>
        <h2 className="mt-4 font-bold text-2xl">{value}</h2>
      </div>
      <div className="p-2 rounded-full bg-gray-200 text-gray-600">{icon}</div>
    </div>
  );
};

export default StatCard;
