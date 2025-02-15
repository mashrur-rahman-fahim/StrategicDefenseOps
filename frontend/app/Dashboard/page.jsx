'use client';
import React, { useState } from "react";
import "./dashboard.css";

const Dashboard = () => {
  // State to manage operations
  const [operations, setOperations] = useState([
    {
      id: 1,
      name: "Operation Kingfish",
      status: "ongoing",
      startDate: "12/12/24",
      endDate: "15/1/25",
      visible: true,
      selected: false,
    },
    {
      id: 2,
      name: "Operation Falcon",
      status: "upcoming",
      startDate: "30/1/25",
      endDate: "21/2/25",
      visible: true,
      selected: false,
    },
  ]);

  // State to manage new operation input
  const [newOperation, setNewOperation] = useState({
    name: "",
    status: "ongoing",
    startDate: "",
    endDate: "",
  });

  // Function to toggle visibility for a specific operation
  const toggleVisibility = (id) => {
    setOperations((prev) =>
      prev.map((op) =>
        op.id === id ? { ...op, visible: !op.visible } : op
      )
    );
  };

  // Function to handle checkbox selection
  const handleSelect = (id) => {
    setOperations((prev) =>
      prev.map((op) =>
        op.id === id ? { ...op, selected: !op.selected } : op
      )
    );
  };

  // Function to delete selected operations
  const deleteSelectedOperations = () => {
    setOperations((prev) => prev.filter((op) => !op.selected));
  };

  // Function to add a new operation
  const addOperation = () => {
    if (newOperation.name && newOperation.startDate && newOperation.endDate) {
      const newOp = {
        id: operations.length + 1, // Simple ID generation
        name: newOperation.name,
        status: newOperation.status,
        startDate: newOperation.startDate,
        endDate: newOperation.endDate,
        visible: true,
        selected: false,
      };
      setOperations((prev) => [...prev, newOp]);
      setNewOperation({ name: "", status: "ongoing", startDate: "", endDate: "" }); // Reset input
    }
  };

  return (
    <div className="dashboard">
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
        {/* Add New Operation Form */}
        <div className="add-operation">
          <input
            type="text"
            placeholder="Operation Name"
            value={newOperation.name}
            onChange={(e) =>
              setNewOperation({ ...newOperation, name: e.target.value })
            }
          />
          <select
            value={newOperation.status}
            onChange={(e) =>
              setNewOperation({ ...newOperation, status: e.target.value })
            }
          >
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
          </select>
          <input
            type="text"
            placeholder="Start Date (DD/MM/YY)"
            value={newOperation.startDate}
            onChange={(e) =>
              setNewOperation({ ...newOperation, startDate: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="End Date (DD/MM/YY)"
            value={newOperation.endDate}
            onChange={(e) =>
              setNewOperation({ ...newOperation, endDate: e.target.value })
            }
          />
          <button onClick={addOperation}>Add Operation</button>
        </div>

        {/* Operations Table */}
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
            {operations.map((op) => (
              <tr key={op.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={op.selected}
                    onChange={() => handleSelect(op.id)}
                  />
                </td>
                <td>{op.name}</td>
                <td className={`status ${op.status}`}>{op.status}</td>
                <td>{op.visible ? op.startDate : "**"}</td>
                <td>{op.visible ? op.endDate : "**"}</td>
                <td>
                  <span
                    className="icon"
                    onClick={() => toggleVisibility(op.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {op.visible ? "👁️" : "👁️‍🗨️"}
                  </span>
                  <span className="icon">✏️</span>
                  <span className="icon">🗑️</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Delete Selected Button */}
        <button
          className="delete-selected"
          onClick={deleteSelectedOperations}
          disabled={!operations.some((op) => op.selected)}
        >
          Delete Selected
        </button>
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