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
              <div
                key={photo.id}
                className="overlay-hover"
                style={{ position: "relative", width: "200px", height: "200px", overflow: "hidden" }}
              >
                <img
                  src={photo.url}
                  alt="uploaded"
                  className="gallery-img"
                  style={{
                    transition: "filter 0.3s ease",
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />

                <div
                  className="overlay"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    padding: "10px",
                    boxSizing: "border-box",
                    zIndex: 5,
                  }}
                >
                  <h3 style={{ margin: "5px 0" }}>{photo.title}</h3>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>{photo.date}</p>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>{photo.caption}</p>
                </div>

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
                    zIndex: 10,
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .overlay-hover:hover .overlay {
              opacity: 1 !important;
            }
            .overlay-hover:hover .gallery-img {
              filter: blur(4px) !important;
            }
          `,
        }}
      />
    </div>
  );
}

export default App;