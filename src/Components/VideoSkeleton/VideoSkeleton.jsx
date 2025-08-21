import React from "react";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import "./VideoSkeleton.css";

const VideoSkeleton = () => {
  return (
    <div className="video-skeleton">
      <div className="skeleton-player" />
      <SkeletonCard />
      <div className="skeleton-channel">
        <div className="skeleton-avatar" />
        <div className="skeleton-channel-info">
          <div className="skeleton-text-line short" />
          <div className="skeleton-text-line long" />
        </div>
      </div>
      <div className="skeleton-description" />
      <div className="skeleton-comments">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton-comment">
            <div className="skeleton-avatar" />
            <div className="skeleton-comment-lines">
              <div className="skeleton-text-line short" />
              <div className="skeleton-text-line long" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSkeleton;
