"use client"
import { useState, useEffect } from "react"
import axios from "@/lib/axios"

export default function Assign({ user }) {
    const [role, setRole] = useState(null)
    const [managerEmail, setManagerEmail] = useState("")
    const [operatorEmail, setOperatorEmail] = useState("")
    const [viewerEmail, setViewerEmail] = useState("")
    const [assignedManagerEmail, setAssignedManagerEmail] = useState("")

    useEffect(() => {
        if (user) {
            setRole(user.role_id)
        }
    }, [user])

    const assignRole = async (roleType) => {
        try {
            let payload = {}
            let endpoint = ""

            if (roleType === "manager") {
                endpoint = "/api/manager-assign"
                payload = { managerEmail }
            } else if (roleType === "operator") {
                endpoint = "/api/operator-assign"
                payload = { operatorEmail, managerEmail: assignedManagerEmail }
            } else if (roleType === "viewer") {
                endpoint = "/api/viewer-assign"
                payload = { viewerEmail, managerEmail: assignedManagerEmail }
            }

            const response = await axios.post(endpoint, payload)
            console.log(response.data)
            alert(response.data.message || "Role assigned successfully")

            // Clear input fields after assignment
            if (roleType === "manager") setManagerEmail("")
            if (roleType === "operator") setOperatorEmail("")
            if (roleType === "viewer") setViewerEmail("")
        } catch (error) {
            console.error("Error assigning role", error.response?.data || error.message)
            alert(error.response?.data?.message || "Failed to assign role")
        }
    }

    return (
        <div className="assign p-4">
            <h1 className="text-lg font-bold">User ID: {user?.id} | Role: {user?.role_id}</h1>
            
            {role === 1 && (
                <div>
                    <h2 className="text-md font-semibold">Assign Manager</h2>
                    <input type="email" value={managerEmail} onChange={(e) => setManagerEmail(e.target.value)} placeholder="Manager Email" className="border p-2 m-2" />
                    <button onClick={() => assignRole("manager")} className="bg-blue-500 text-white p-2">Assign</button>
                </div>
            )}
            
            {(role === 1 || role === 2) && (
                <div>
                    <h2 className="text-md font-semibold">Assign Operator</h2>
                    <input type="email" value={operatorEmail} onChange={(e) => setOperatorEmail(e.target.value)} placeholder="Operator Email" className="border p-2 m-2" />
                    <input type="email" value={assignedManagerEmail} onChange={(e) => setAssignedManagerEmail(e.target.value)} placeholder="Manager Email (Optional)" className="border p-2 m-2" />
                    <button onClick={() => assignRole("operator")} className="bg-blue-500 text-white p-2">Assign</button>
                </div>
            )}
            
            {(role === 1 || role === 2) && (
                <div>
                    <h2 className="text-md font-semibold">Assign Viewer</h2>
                    <input type="email" value={viewerEmail} onChange={(e) => setViewerEmail(e.target.value)} placeholder="Viewer Email" className="border p-2 m-2" />
                    <input type="email" value={assignedManagerEmail} onChange={(e) => setAssignedManagerEmail(e.target.value)} placeholder="Manager Email (Optional)" className="border p-2 m-2" />
                    <button onClick={() => assignRole("viewer")} className="bg-blue-500 text-white p-2">Assign</button>
                </div>
            )}
        </div>
    )
}
