import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [status, setStatus] = useState("");
  const BACKEND_URL = "https://photo-backend-u62f.onrender.com/";

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading...");

    try {
      const res = await fetch(BACKEND_URL + "/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.image_url) {
        setUploadedUrl(data.image_url);
        setStatus("Upload successful!");
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

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Upload
      </button>

      <p>{status}</p>

      {uploadedUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={uploadedUrl} alt="uploaded" width="300" />
        </div>
      )}
    </div>
  );
}

export default App;