'use client'; // Mark this as a Client Component
import React from "react";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Stats Section */}
      <div className="stats-section">
        <h2>Stats</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Active Operations</h3>
            <p className="stat-number">4</p>
            <button>Check</button>
          </div>
          <div className="stat-card">
            <h3>Upcoming Operations</h3>
            <p className="stat-number">1</p>
            <button>Check</button>
          </div>
          <div className="stat-card">
            <h3>Resources Used</h3>
            <p className="stat-number">16%</p>
            <button>Check</button>
          </div>
        </div>
      </div>

      {/* Operations Section */}
      <div className="operations-section">
        <h2>Operations</h2>
        <table className="operations-table">
          <thead>
            <tr>
              <th></th>
              <th>OP Name</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="checkbox" /></td>
              <td>Operation Kingfish</td>
              <td className="status ongoing">ongoing</td>
              <td>12/12/24</td>
              <td>15/1/25</td>
              <td>
                <span className="icon">👁️</span> {/* Eye Icon */}
                <span className="icon">✏️</span> {/* Edit Icon */}
                <span className="icon">🗑️</span> {/* Trash Icon */}
              </td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>Operation Falcon</td>
              <td className="status upcoming">upcoming</td>
              <td>30/1/25</td>
              <td>21/2/25</td>
              <td>
                <span className="icon">👁️</span> {/* Eye Icon */}
                <span className="icon">✏️</span> {/* Edit Icon */}
                <span className="icon">🗑️</span> {/* Trash Icon */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Resource Usage Section */}
      <div className="resource-usage-section">
        <h2>Resource Usage</h2>
        <div className="legend">
          <span className="legend-item available"></span> Available
          <span className="legend-item in-use"></span> In use
          <span className="legend-item maintenance"></span> Under Maintenance
        </div>
        <div className="resource-chart">
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="green" />
          </svg>
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
          </svg>
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="orange" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
