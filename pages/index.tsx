import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setUrl("");

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      // ✅ Handle backend errors properly
      if (!res.ok) {
        setError(data.error || "Invalid input");
        return;
      }

      setUrl(data.url);
      setContent("");
    } catch {
      setError("Network error. Please try again.");
    }
  }

  return (
    <main className="container">
      <div className="card">
        <h1 className="title">Pastebin Lite</h1>

        <textarea
          className="textarea"
          placeholder="Paste your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="button" onClick={submit}>
          Create Paste
        </button>

        {/* ✅ Clear error display */}
        {error && <p className="error">{error}</p>}

        {url && (
          <div className="share-box">
            <p>Share link:</p>
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
