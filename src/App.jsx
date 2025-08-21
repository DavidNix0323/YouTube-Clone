import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import Video from "./Pages/Video/Video";

const App = () => {
  const [sidebar, setSidebar] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [searchTerm, setSearchTerm] = useState("");
  const [renderedVideos, setRenderedVideos] = useState([]);


  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div>
      <Navbar
  setSidebar={setSidebar}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  theme={theme}
  toggleTheme={toggleTheme}
  renderedVideos={renderedVideos}
/>

      <Routes>
        <Route
  path="/"
  element={
    <Home
      sidebar={sidebar}
      searchTerm={searchTerm}
      setRenderedVideos={setRenderedVideos}
    />
  }
/><Route
  path="/"
  element={
    <Home
      sidebar={sidebar}
      searchTerm={searchTerm}
      setRenderedVideos={setRenderedVideos}
    />
  }
/>

<Route
  path="/video/:categoryId/:videoId"
  element={
    <Video
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  }
/>


        <Route path="/video/:categoryId/:videoId" element={<Video />} />
        {/* Optional: <Route path="/search/:query" element={<SearchResults />} /> */}
      </Routes>
    </div>
  );
};

export default App;
