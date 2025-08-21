import React from "react";
import "./SkeletonCard.css";

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-thumbnail" />
      <div className="skeleton-text-line short" />
      <div className="skeleton-text-line long" />
    </div>
  );
};

export default SkeletonCard;
