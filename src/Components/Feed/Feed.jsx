import React, { useEffect, useState } from "react";
import "./Feed.css";
import { API_KEY } from "../../data";
import VideoCard from "../Videocard/videocard";

const Feed = ({ category }) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
    const response = await fetch(videoList_url);
    const result = await response.json();
    setData(result.items || []);
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (
    <div className="feed">
      {data.length === 0 ? (
        <p>Loading...</p>
      ) : (
        data.map((item) => <VideoCard key={item.id} item={item} />)
      )}
    </div>
  );
};

export default Feed;

