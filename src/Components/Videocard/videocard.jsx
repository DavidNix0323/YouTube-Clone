import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { value_converter } from "../../data";

const VideoCard = ({ item }) => {
  if (!item?.snippet || !item?.statistics) return null;

  const [isHovered, setIsHovered] = useState(false);
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    let timer;
    if (isHovered) {
      timer = setTimeout(() => setShowIframe(true), 200); // slight delay
    } else {
      setShowIframe(false);
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [isHovered]);

  const { title, channelTitle, thumbnails, publishedAt, categoryId } = item.snippet;
  const { viewCount } = item.statistics;

  return (
    <Link to={`video/${categoryId}/${item.id}`} className="card">
      <div
        className="thumbnail-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={thumbnails?.medium?.url} alt={title} className="static-thumb" />
        {showIframe && (
          <iframe
            className="hover-preview"
            src={`https://www.youtube.com/embed/${item.id}?autoplay=1&mute=1&controls=0`}
            frameBorder="0"
            allow="autoplay"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>

      <h2>{title}</h2>
      <h3>{channelTitle}</h3>
      <p>{value_converter(viewCount)} Views &bull; {moment(publishedAt).fromNow()}</p>
    </Link>
  );
};

export default VideoCard;
