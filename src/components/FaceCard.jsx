import React from "react";

import Leo from "../assets/leo.png";

const FaceCard = () => {
  return (
    <div className="w-40 h-60 relative flex items-center justify-center rounded-md">
      <img
        src={Leo}
        className="w-full h-full object-cover rounded-md"
        alt="Cat"
      />
      <h1 className="absolute bottom-2 bg-[#ffa673] p-2 rounded-md">
        Hello Carl
      </h1>
    </div>
  );
};

export default FaceCard;
