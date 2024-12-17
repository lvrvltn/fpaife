import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import newChatIcon from './new_chat.png';
import linkIcon from './link.png';

function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8080/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data.answer);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleChat = async () => {
    if (query.trim() === "") return;

    try {
      const res = await axios.post("http://localhost:8080/chat", { 
        context: "Some context or default context", 
        query: query
      });
      setResponse(res.data.reply); 
    } catch (error) {
      console.error("Error querying chat:", error);
    }
  };

  const handleKeyPress = (e) => {
    console.log('Key pressed:', e.key);  
    if (e.key === "Enter") {
      e.preventDefault(); 
      handleChat(); 
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log('Button clicked');  
    file ? handleUpload() : handleChat();
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <img src={newChatIcon} alt="New Chat" className="app-logo" />
        <h1>GenAI</h1>
        <div className="app-user-icon">
          <span>👤</span>
        </div>
      </header>

      {/* Chat Section */}
      <main className="chat-section">
        <div className="chat-input-container">
          <label htmlFor="file-upload" className="file-input-label">
            <img src={linkIcon} alt="Upload" className="link-icon" />
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="file-input-hidden"
          />

          {/* Text Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}  
            placeholder="Chat with GenAI"
            className="chat-input"
          />

          {/* Send Button */}
          <button onClick={handleClick} className="send-btn">
            ➤
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
