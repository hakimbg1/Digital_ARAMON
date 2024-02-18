import React, { useState, useEffect } from "react";
import axios, { getImageUrl } from "../../api/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.scss";

const Home = () => {
  const [storedUrls, setStoredUrls] = useState([]);

  const fetchStoredUrls = async () => {
    try {
      const response = await axios.get("/StoredUrl/StoredUrls");
      setStoredUrls(response.data);
    } catch (error) {
      console.error("Error fetching stored URLs:", error);
    }
  };

  useEffect(() => {
    fetchStoredUrls();
  }, []);

  const handleLinkClick = async (customName) => {
    try {
      await axios.get(`/StoredUrl/StoredUrls/count/${customName}`);
      
    } catch (error) {
      console.error("Error updating click count:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="table-responsive">
        <table className="table table-striped">
          <tbody>
            {storedUrls.map((storedUrl) => (
              <a
                key={storedUrl._id}
                href={storedUrl.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="row-link"
              >
                <tr key={storedUrl._id}
                onClick={() => handleLinkClick(storedUrl.customName)}
                >
                  <td className="image-cell">
                    <img
                      src={getImageUrl(storedUrl.iconPath)}
                      alt="Icon"
                      width="50"
                      height="50"
                      crossOrigin="anonymous"
                    />
                  </td>
                  <td className="link-cell">
                    <span className="d-block link-cell-link">
                    <h2> {storedUrl.customName}</h2>
                    </span>
                  </td>
                </tr>
              </a>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;