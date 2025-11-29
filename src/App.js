import { useState, useEffect } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [status, setStatus] = useState("");
  const [photos, setPhotos] = useState([]);

  const BACKEND_URL = "https://photo-backend-u62f.onrender.com";

  // Fetch photos from backend
  const fetchPhotos = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/photos`);
      const data = await res.json();
      setPhotos(data.photos);
    } catch (err) {
      console.error("Error fetching photos:", err);
    }
  };

  // Load gallery on page load
  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading...");

    try {
      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.image_url) {
        setUploadedUrl(data.image_url);
        setStatus("Upload successful!");
        fetchPhotos(); // Refresh gallery
      } else {
        setStatus("Upload failed — the server did not return an image URL.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Upload failed — network error.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "40px" }}>
      <h1>Photo Upload Demo</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Upload
      </button>

      <p>{status}</p>

      <h2>Gallery</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {photos.map((url, i) => (
          <img key={i} src={url} alt="uploaded" width="200" />
        ))}
      </div>
    </div>
  );
}

export default App;