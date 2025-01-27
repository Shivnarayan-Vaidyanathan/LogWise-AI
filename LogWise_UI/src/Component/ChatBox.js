import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SideNav from "./SideNav";
import "./ChatBox.css";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState([]);
  const [errorCounts, setErrorCounts] = useState({ byTime: {}, byErrorCode: {} });
  const chatHistoryRef = useRef(null);

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (!file) return; // If no file selected, exit
  
    // Check file size (5 MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5 MB. Please upload a smaller file.");
      e.target.value = null; // Clear the input value
      return;
    }
  
    const reader = new FileReader(); // Create a new FileReader instance
    reader.onload = (event) => {
      setFileContent(event.target.result); // Set the file content to state
    };
    reader.readAsText(file); // Read the file content as text
  };

  const parseLogData = (fileContent) => {
    const logLines = fileContent.split("\n");
    const logEntries = [];
    const counts = {
      byTime: {}, // Count errors by timestamp
      byErrorCode: {}, // Count errors by error code
    };
    let currentEntry = null;
  
    logLines.forEach((line) => {
      if (line.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/)) {
        if (currentEntry) {
          logEntries.push({
            timestamp: currentEntry.timestamp || "N/A",
            time: currentEntry.time || "N/A",
            title: currentEntry.title || "N/A",
            error_code: currentEntry.error_code || "N/A",
            message: currentEntry.message || "N/A",
            details: currentEntry.details || "N/A",
            description: currentEntry.description || "N/A",
          });
          // Count errors by time
          if (currentEntry.timestamp) {
            counts.byTime[currentEntry.timestamp] =
              (counts.byTime[currentEntry.timestamp] || 0) + 1;
          }
          // Count errors by error code
          if (currentEntry.error_code !== "N/A") {
            counts.byErrorCode[currentEntry.error_code] =
              (counts.byErrorCode[currentEntry.error_code] || 0) + 1;
          }
        }
        const [timestamp, time] = line.split(" ");
        const message = line.substring(line.indexOf("]") + 2).trim();
        const title = line.match(/\[(.*?)\]/)?.[1] || "N/A";
  
        currentEntry = {
          timestamp: timestamp || "N/A",
          time: time || "N/A",
          title: title || "N/A",
          error_code: "N/A",
          message: message || "N/A",
          details: "",
          description: "", // Placeholder for short description
        };
      } else if (line.includes("Error Code:") && currentEntry) {
        currentEntry.error_code = line.split(":")[1]?.trim() || "N/A";
      } else if (currentEntry) {
        currentEntry.details += `${line.trim()}\n` || "N/A";
      }
    });
  
    if (currentEntry) {
      logEntries.push({
        timestamp: currentEntry.timestamp || "N/A",
        time: currentEntry.time || "N/A",
        title: currentEntry.title || "N/A",
        error_code: currentEntry.error_code || "N/A",
        message: currentEntry.message || "N/A",
        details: currentEntry.details || "N/A",
        description: currentEntry.description || "N/A",
      });
      if (currentEntry.timestamp) {
        counts.byTime[currentEntry.timestamp] =
          (counts.byTime[currentEntry.timestamp] || 0) + 1;
      }
      if (currentEntry.error_code !== "N/A") {
        counts.byErrorCode[currentEntry.error_code] =
          (counts.byErrorCode[currentEntry.error_code] || 0) + 1;
      }
    }
  
    return { logEntries, counts };
  };  

  const handleSend = async () => {
    if (!fileContent) {
      alert("Please upload a file first.");
      return;
    }
  
    // Clear chat history, analysis data, and error counts before sending new data
    setMessages([]); // Clears the chat history
    setAnalysisData([]); // Clears the analysis table
    setErrorCounts({ byTime: {}, byErrorCode: {} }); // Clears the error counts table
    setLoading(true);
  
    try {
      const { logEntries, counts } = parseLogData(fileContent);
  
      // Optionally, you can add a message here, like "Analyzing data..."
      setMessages((prevMessages) => [
        ...prevMessages,
        { txt: "Log Table", type: "system", isLogTable: true }, // Add a flag to identify "Log Table"
      ]);
  
      const response = await axios.post("http://localhost:5000/api/analyze", {
        file_content: fileContent,
        parsed_log_data: logEntries,
      });
  
      if (response.status === 200) {
        const enrichedData = response.data.log_analysis.map((entry, index) => ({
          ...entry,
          description: response.data.descriptions[index] || "No description available.",
        }));
        setAnalysisData(enrichedData);
        setErrorCounts(counts); // Restore error counts with new data
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { txt: "Error analyzing the log data. Please try again later.", type: "system" },
        ]);
      }
    } catch (error) {
      // Check if the error has a response, and display the backend error message
      const errorMessage = error.response?.data?.error || `Error analyzing the log data: ${error.message}`;
      setMessages((prevMessages) => [
        ...prevMessages,
        { txt: errorMessage, type: "system" }, // Display the error from the backend
      ]);
    }
  
    // Clear the textarea and reset file input after sending
    setFileContent(""); // Clear the textarea
    const fileInput = document.getElementById("fileInput"); // Access the file input by its ID
    if (fileInput) fileInput.value = ""; // Reset the file input
    setLoading(false);
  };    

  const renderAnalysisTable = () => {
    if (!analysisData || analysisData.length === 0) {
      return;
    }
  
    return (
      <table className="analysis-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Title</th>
            <th>Error Code</th>
            <th>Message</th>
            <th>Details</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {analysisData.map((row, index) => (
            <tr key={index}>
              <td>{row.timestamp || "N/A"}</td>
              <td>{row.time || "N/A"}</td>
              <td>{row.title || "N/A"}</td>
              <td>{row.error_code || "N/A"}</td>
              <td>{row.message || "N/A"}</td>
              <td>
                <pre>{row.details || "N/A"}</pre>
              </td>
              <td>{row.description || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };  

  const renderErrorCounts = () => {
    if (!errorCounts || (!Object.keys(errorCounts.byTime).length && !Object.keys(errorCounts.byErrorCode).length)) {
      return;
    }

    return (
      <div>
        <p></p>
        <h3>Error Counts by Date</h3>
        <table className="error-count-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(errorCounts.byTime).map(([time, count], index) => (
              <tr key={index}>
                <td>{time}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p></p>
        <h3>Error Counts by Error Code</h3>
        <table className="error-count-table">
          <thead>
            <tr>
              <th>Error Code</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(errorCounts.byErrorCode).map(([errorCode, count], index) => (
              <tr key={index}>
                <td>{errorCode}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleKeyDown = (e) => {
    // Trigger handleSend when 'Enter' key is pressed (without Shift key)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();  // Prevents new line in the textarea
      handleSend(); // Calls the handleSend function
    }
  };

  return (
    <div className="chatbox-container">
      <div className="side-nav-left">
        <SideNav />
      </div>
      <div className="chat-container">
        <div className="chat-history" ref={chatHistoryRef}>
          {messages.map((message, index) => (
            <div key={index} className={message.type}>
              {message.type === "user" ? (
                <div className="user-message">{message.txt}</div>
              ) : (
                <div
                  className={message.isLogTable ? "system-message log-table-label" : "system-message"}
                >
                  {message.txt}
                </div>
              )}
            </div>
          ))}
          {/* Loading indicator */}
          {loading && (
            <div className="center">
              {Array.from({ length: 10 }, (_, index) => (
            <div key={index} className="wave"></div>
            ))}
            </div>
          )}
          <div className="analysis-result">{renderAnalysisTable()}</div>
          <div className="error-counts">{renderErrorCounts()}</div>
        </div>

        <div className="chat-input">
          <input id="fileInput" type="file" onChange={handleFileChange} style={{ marginBottom: "10px" }} />
          <textarea
            value={fileContent}
            onKeyDown={handleKeyDown}  // Add this line for Enter key handling
            readOnly
            placeholder="File content will appear here. Click on this box and then press enter button in keyboard to send data."
            rows="10"
            style={{ marginTop: "10px", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;