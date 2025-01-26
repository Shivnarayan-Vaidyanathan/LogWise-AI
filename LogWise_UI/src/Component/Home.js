// Home.js
 
import React from "react";
import "./Home.css"; // Import your Home page styling

import SideNav from "./SideNav";
 
const Home = () => {
  return (
    <div className="chatbox-container">
      <div className="side-nav-left">
        <SideNav />
      </div>
      <div className="home-container">
        <h1>Welcome To LogWise AI 🤖</h1>
 
        <div className="description">
          <p>
          Our application is built to efficiently analyze log records within large log files.
          By processing the log data, the system identifies and categorizes various error types,
          generating a comprehensive report with error codes and their respective logged counts.
          </p>
 
          <p>
          If you upload a log file, the application will process the data and produce an insightful report based on the errors logged.
          </p>
        </div>
 
        <div className="features">
          <h2>Key Features:</h2>
          <ul>
            <li>Log File Analysis</li>
            <li>Error Categorization & Reporting</li>
            <li>Comprehensive Error Count Tracking</li>
            {/* Add more features as needed */}
          </ul>
        </div>
 
        {/* Add more sections, such as a demo video or links to other pages if necessary */}
      </div>
    </div>
  );
};
 
export default Home;