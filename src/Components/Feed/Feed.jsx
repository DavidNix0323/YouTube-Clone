import React, { useEffect, useState } from "react";
import "./Feed.css";
import { API_KEY } from "../../data";
import VideoCard from "../Videocard/videocard";
import SkeletonCard from "../SkeletonCard/SkeletonCard";

const Feed = ({ category, searchTerm, setRenderedVideos }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);

    const baseURL = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=US`;
    const categoryParam =
      category && category !== "0" ? `&videoCategoryId=${category}` : "";
    const videoList_url = `${baseURL}${categoryParam}&key=${API_KEY}`;

    try {
      const response = await fetch(videoList_url);
      const result = await response.json();

      if (!response.ok || !result.items) {
        console.error("YouTube API error:", result);
        setData([]);
        setRenderedVideos([]);
        setIsLoading(false);
        return;
      }

      const filteredItems = searchTerm
        ? result.items.filter((item) =>
            item.snippet?.title
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
        : result.items;

      setData(filteredItems);
      setRenderedVideos(
        filteredItems.map((item) => item.snippet?.title).filter(Boolean)
      );
    } catch (err) {
      console.error("Fetch failed:", err);
      setData([]);
      setRenderedVideos([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [category, searchTerm]);

  return (
    <div className="feed">
      {isLoading ? (
        Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
      ) : data.length === 0 ? (
        <p>
          {searchTerm
            ? `No results for "${searchTerm}"`
            : "No videos available."}
        </p>
      ) : (
        data.map((item) => <VideoCard key={item.id} item={item} />)
      )}
    </div>
  );
};

export default Feed;
