import React, { useEffect, useState } from "react";
import "./Feed.css";
import { API_KEY } from "../../data";
import VideoCard from "../Videocard/videocard";
import SkeletonCard from "../SkeletonCard/SkeletonCard"; // ✅ import your skeleton

const Feed = ({ category, searchTerm, setRenderedVideos }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ✅ define loading state

  const fetchData = async () => {
    setIsLoading(true); // start loading

    const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
    const response = await fetch(videoList_url);
    const result = await response.json();
    const items = result.items || [];

    const filteredItems = searchTerm
      ? items.filter((item) =>
          item.snippet?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : items;

    setData(filteredItems);
    setRenderedVideos(
      filteredItems.map((item) => item.snippet?.title).filter(Boolean)
    );

    setIsLoading(false); // done loading
  };

  useEffect(() => {
    fetchData();
  }, [category, searchTerm]);

  return (
    <div className="feed">
      {isLoading ? (
        Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
      ) : data.length === 0 ? (
        <p>{searchTerm ? `No results for "${searchTerm}"` : "No videos available."}</p>
      ) : (
        data.map((item) => <VideoCard key={item.id} item={item} />)
      )}
    </div>
  );
};

export default Feed;
