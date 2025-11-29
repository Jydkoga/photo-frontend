import { useState, useEffect } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [status, setStatus] = useState("");
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");
  const [currentPage, setCurrentPage] = useState("gallery");

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

  // Delete a photo
  const deletePhoto = async (id) => {
    await fetch(`${BACKEND_URL}/photo/${id}`, {
      method: "DELETE",
    });
    fetchPhotos();
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
    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("date", date);

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
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>TITLE GOES HERE</h1>

      <nav style={{ display: "flex", gap: "20px", marginBottom: "30px", fontSize: "18px" }}>
        <button onClick={() => setCurrentPage("gallery")} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: currentPage === "gallery" ? "bold" : "normal" }}>
          Gallery
        </button>
        <button onClick={() => setCurrentPage("upload")} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: currentPage === "upload" ? "bold" : "normal" }}>
          Upload
        </button>
      </nav>

      {currentPage === "upload" && (
        <div>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <div style={{ marginTop: "20px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ display: "block", marginBottom: "10px", width: "200px" }}
            />

            <textarea
              placeholder="Caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{ display: "block", marginBottom: "10px", width: "300px", height: "60px" }}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ display: "block", marginBottom: "10px", width: "150px" }}
            />
          </div>

          <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
            Upload
          </button>

          <p>{status}</p>
        </div>
      )}

      {currentPage === "gallery" && (
        <>
          <h2>Gallery</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {photos.map((photo) => (
              <div key={photo.id} style={{ position: "relative" }}>
                <img src={photo.url} alt="uploaded" width="200" />

                <button
                  onClick={() => deletePhoto(photo.id)}
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;