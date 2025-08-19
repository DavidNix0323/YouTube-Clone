import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { value_converter } from "../../data";

const VideoCard = ({ item }) => {
    if (!item?.snippet || !item?.statistics) return null;
  
    const { title, channelTitle, thumbnails, publishedAt, categoryId } = item.snippet;
    const { viewCount } = item.statistics;
  
    return (
        <Link to={`video/${categoryId}/${item.id}`} className="card">
        <div className="thumbnail-wrapper">
          <img src={thumbnails?.medium?.url} alt={title} className="static-thumb" />
          <iframe
  className="hover-preview"
  src={`https://www.youtube.com/embed/${item.id}?autoplay=1&mute=1&controls=0`}
  frameBorder="0"
  allow="autoplay"
  sandbox="allow-scripts allow-same-origin"
></iframe>

        </div>
        <h2>{title}</h2>
        <h3>{channelTitle}</h3>
        <p>{value_converter(viewCount)} Views &bull; {moment(publishedAt).fromNow()}</p>
      </Link>
      
    );
  };
  

export default VideoCard;
