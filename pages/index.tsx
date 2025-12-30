import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  async function submit() {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setUrl(data.url);
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
