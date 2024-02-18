// StoredUrlsContainer.js
import React, { useState, useEffect } from "react";
import StoredUrlsCardLayout from "./StoredUrlsCardLayout"; // Import the card layout version
import StoredUrlsTableLayout from "./StoredUrlsTableLayout"; // Import the table layout version

const StoredUrlsContainer = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Decide which version of the component to render based on screen width
  const ComponentToRender = windowWidth < 995 ? StoredUrlsCardLayout : StoredUrlsTableLayout;

  return <ComponentToRender />;
};

export default StoredUrlsContainer;