import React, { useState, useEffect, useContext } from "react";
import axios, { getImageUrl } from "../../api/axios";
import { AuthContext } from "../../contexts/AuthContext";
import "./StoredUrls.scss";

const StoredUrls = () => {
  const [storedUrls, setStoredUrls] = useState([]);
  const [customName, setCustomName] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const { user } = useContext(AuthContext);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        console.error("User is undefined");
        return;
      }

      const trimmedCustomName = customName.trim();
      const trimmedOriginalUrl = originalUrl.trim();

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("customName", trimmedCustomName);
      formData.append("originalUrl", trimmedOriginalUrl);
      formData.append("createdBy", user.email);

      await axios.post("/StoredUrl/StoredUrls", formData);

      fetchStoredUrls();
      setCustomName("");
      setOriginalUrl("");
      setImageFile(null);
    } catch (error) {
      console.error("Error creating stored URL:", error);
    }
  };

  const handleDelete = async (_id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this stored URL?");
    if (!shouldDelete) {
      return;
    }

    try {
      await axios.delete(`/StoredUrl/StoredUrls/${_id}`);
      fetchStoredUrls();
    } catch (error) {
      console.error("Error deleting stored URL:", error);
    }
  };

  const truncateUrl = (url, maxLength) => {
    if (url.length <= maxLength) {
      return url;
    }
    return url.substring(0, maxLength - 3) + '...';
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Stored URLs</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
        <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Custom Name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Original URL"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Create
        </button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Custom Name</th>
            <th>Original URL</th>
            <th>Created By</th>
            <th>Icon</th>
            <th>Visits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {storedUrls.map((storedUrl) => (
            <tr key={storedUrl._id}>
              <td>{storedUrl.customName}</td>
              <td>
                <div className="url-cell">
                  <span className="truncated-url" title={storedUrl.originalUrl}>
                    {truncateUrl(storedUrl.originalUrl, 40)}
                  </span>
                </div>
              </td>
              <td>{storedUrl.createdBy}</td>
              <td>
                <img
                  src={getImageUrl(storedUrl.iconPath)}
                  alt="Icon"
                  width="50"
                  height="50"
                  crossOrigin="anonymous"
                />
              </td>
              <td>{storedUrl.clickCount}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(storedUrl._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoredUrls;