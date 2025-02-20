'use client';
import React, { useState } from "react";
import "./dashboard.css";

const Dashboard = () => {

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


  const [newOperation, setNewOperation] = useState({
    name: "",
    status: "ongoing",
    startDate: "",
    endDate: "",
  });


  const [editing, setEditing] = useState(null);


  const [error, setError] = useState("");

 
  const isValidDate = (date) => {
    const regex = /^\d{2}\/\d{2}\/\d{2}$/; 
    if (!regex.test(date)) return false;

    const [day, month, year] = date.split("/");
    const parsedDate = new Date(`20${year}-${month}-${day}`);
    return parsedDate instanceof Date && !isNaN(parsedDate);
  };


  const addOperation = () => {
    if (!newOperation.name || !newOperation.startDate || !newOperation.endDate) {
      setError("All fields are required.");
      return;
    }

    if (!isValidDate(newOperation.startDate)) {
      setError("Invalid start date. Please use DD/MM/YY format.");
      return;
    }

    if (!isValidDate(newOperation.endDate)) {
      setError("Invalid end date. Please use DD/MM/YY format.");
      return;
    }

    const newOp = {
      id: operations.length + 1,
      name: newOperation.name,
      status: newOperation.status,
      startDate: newOperation.startDate,
      endDate: newOperation.endDate,
      visible: true,
      selected: false,
    };


    setOperations((prev) => [...prev, newOp]);


    setNewOperation({ name: "", status: "ongoing", startDate: "", endDate: "" });
    setError(""); 
  };

  
  const updateOperation = () => {
    if (!editing.name || !editing.startDate || !editing.endDate) {
      setError("All fields are required.");
      return;
    }

    if (!isValidDate(editing.startDate)) {
      setError("Invalid start date. Please use DD/MM/YY format.");
      return;
    }

    if (!isValidDate(editing.endDate)) {
      setError("Invalid end date. Please use DD/MM/YY format.");
      return;
    }


    setOperations((prev) =>
      prev.map((op) => (op.id === editing.id ? { ...op, ...editing } : op))
    );


    setEditing(null);
    setError(""); 
  };


  const toggleVisibility = (id) => {
    setOperations((prev) =>
      prev.map((op) =>
        op.id === id ? { ...op, visible: !op.visible } : op
      )
    );
  };


  const handleSelect = (id) => {
    setOperations((prev) =>
      prev.map((op) =>
        op.id === id ? { ...op, selected: !op.selected } : op
      )
    );
  };


  const deleteSelectedOperations = () => {
    setOperations((prev) => prev.filter((op) => !op.selected));
  };


  const deleteOperation = (id) => {
    setOperations((prev) => prev.filter((op) => op.id !== id));
  };


  const toggleEditing = (id) => {
    if (editing && editing.id === id) {
      setEditing(null); 
    } else {
      const operationToEdit = operations.find((op) => op.id === id);
      setEditing({ ...operationToEdit }); 
    }
  };

  return (
    <div className="dashboard">
      <div className="stats-section">
        <h2>Stats</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Active Operations</h3>
            <p className="stat-number">{operations.filter(op => op.status === 'ongoing').length}</p>
            <button>Check</button>
          </div>
          <div className="stat-card">
            <h3>Upcoming Operations</h3>
            <p className="stat-number">{operations.filter(op => op.status === 'upcoming').length}</p>
            <button>Check</button>
          </div>
          <div className="stat-card">
            <h3>Resources Used</h3>
            <p className="stat-number">16%</p>
            <button>Check</button>
          </div>
        </div>
      </div>

      <div className="operations-section">
        <h2>Operations</h2>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Add New Operation Form */}
        <div className="add-operation">
          <input
            type="text"
            placeholder="Operation Name"
            value={newOperation.name}
            onChange={(e) => setNewOperation({ ...newOperation, name: e.target.value })}
          />
          <select
            value={newOperation.status}
            onChange={(e) => setNewOperation({ ...newOperation, status: e.target.value })}
          >
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
          </select>
          <input
            type="text"
            placeholder="Start Date (DD/MM/YY)"
            value={newOperation.startDate}
            onChange={(e) => setNewOperation({ ...newOperation, startDate: e.target.value })}
          />
          <input
            type="text"
            placeholder="End Date (DD/MM/YY)"
            value={newOperation.endDate}
            onChange={(e) => setNewOperation({ ...newOperation, endDate: e.target.value })}
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
                  <span onClick={() => toggleVisibility(op.id)} aria-label="Toggle visibility">
                    {op.visible ? "👁️" : "👁️‍🗨️"}
                  </span>
                  <span onClick={() => toggleEditing(op.id)} aria-label="Edit operation">
                    ✏️
                  </span>
                  <span onClick={() => deleteOperation(op.id)} aria-label="Delete operation">
                    🗑️
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

       
        {editing && (
          <div className="edit-operation">
            <h3>Edit Operation</h3>
            <input
              type="text"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
            <select
              value={editing.status}
              onChange={(e) => setEditing({ ...editing, status: e.target.value })}
            >
              <option value="ongoing">Ongoing</option>
              <option value="upcoming">Upcoming</option>
            </select>
            <input
              type="text"
              value={editing.startDate}
              onChange={(e) => setEditing({ ...editing, startDate: e.target.value })}
            />
            <input
              type="text"
              value={editing.endDate}
              onChange={(e) => setEditing({ ...editing, endDate: e.target.value })}
            />
            <button onClick={updateOperation}>Update Operation</button>
          </div>
        )}

  
        <button
          className="delete-selected"
          onClick={deleteSelectedOperations}
          disabled={!operations.some((op) => op.selected)}
        >
          Delete
        </button>      
      </div>

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
