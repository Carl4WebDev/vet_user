import React from "react";
import { Link } from "react-router-dom";

import Leo from "../assets/leo.png";

const FaceCard = ({ petName, petId, petImage }) => {
  return (
    <Link to={`/pet-profile/${petId}`}>
      <div className="w-16 h-24 sm:w-20 sm:h-30 md:w-40 md:h-60 relative flex items-center justify-center rounded-md">
        <img
          src={petImage || Leo}
          className="w-full h-full object-cover rounded-md"
          alt="Cat"
        />
        <h1 className="text-[8px] md:text-[19px] absolute bottom-2 bg-[#ffa673] p-2 rounded-md">
          {petName}
        </h1>
      </div>
    </Link>
  );
};

export default FaceCard;
