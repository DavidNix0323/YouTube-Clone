import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Feed from "../../Components/Feed/Feed";
import "./Home.css";

const Home = ({ sidebar, searchTerm, setRenderedVideos }) => {
  const [category, setCategory] = useState(0);

  return (
    <>
      <Sidebar
        setCategory={setCategory}
        sidebar={sidebar}
        category={category}
      />
      <div className={`container ${sidebar ? "" : "large-container"}`}>
      <Feed
  category={category}
  setRenderedVideos={setRenderedVideos}
  searchTerm={searchTerm}
/>

      </div>
    </>
  );
};

export default Home;
