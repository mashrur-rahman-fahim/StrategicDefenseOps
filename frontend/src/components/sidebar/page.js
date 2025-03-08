"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "@/lib/axios";
import "./sidebar.css";
import { Icon } from "@iconify/react";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "sonner";

const Sidebar = ({
    isOpen,
    toggleSidebar,
    selectedItem,
    handleNavigation,
    menuButtonRef,
}) => {
    const sidebarRef = useRef();
    const [userName, setUserName] = useState("Error");
    const [userEmail, setUserEmail] = useState("");
    const [roleName, setRoleName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [tempName, setTempName] = useState("");

    const [loading, setLoading] = useState(false);

    const roleMapping = {
        1: "Admin",
        2: "Manager",
        3: "Operator",
        4: "Viewer",
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const menuButton = document.querySelector(".menu-button"); // Get the "three dots" button
            if (
                isOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                menuButton && // Check if menuButton exists
                !menuButton.contains(event.target) // Exclude the "three dots" button
            ) {
                toggleSidebar();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, toggleSidebar]);
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`/api/user`);
                setUserName(response?.data.name || "Unknown");
                setUserEmail(response?.data.email || "");
                setRoleName(roleMapping[response.data.role_id] || "Unknown");
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, []);

    // Open modal and set temporary values
    const handleEditProfile = () => {
        setTempName(userName);
        setShowModal(true);
    };

    const handleDeleteProfile = async () => {
        if (window.confirm('This will permanently delete your account! Are you sure you want to proceed?')) {
            try {
                setLoading(true);
                await axios.delete('/api/delete-profile')
                console.log('Profile bombed')
            } catch (error) {
                console.error('Error: ', error)
                toast.error('Failed to delete profile')
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle form submission
    const handleSaveChanges = async () => {
        try {
            setLoading(true);
            const response = await axios.put(`/api/update-profile`, {
                name: tempName,
            });
            console.log("User details updated:", response.data);

            setUserName(tempName);
            setShowModal(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating user details:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
            {/* Arrow button to close sidebar */}
            <div className="icon-container d-flex justify-content-between align-items-center">
                <button className="back-button" onClick={toggleSidebar}>
                    ←
                </button>
                <button className="back-button" onClick={handleEditProfile}>
                    <Icon icon="bi:pencil-square" width="16" height="16" />
                </button>
            </div>

            {/* Profile section */}
            <div className="profile">
                <h2>{userName}</h2>
                <div className="rank">{roleName}</div>
                <p className="rank">{userEmail}</p>
            </div>

            {/* Menu items */}
            <nav className="menu">
                {[
                    "Dashboard",
                    "Resources",
                    "Operation",
                    "Reports",
                    "AuditLog",
                    "Notifications",
                    "Chatbot",
                    "LandingPage",
                ].map((item) => (
                    <div
                        key={item}
                        className={`menu-item ${selectedItem === item.toLowerCase() ? "active" : ""}`}
                        onClick={() => {
                            handleNavigation(item.toLowerCase());
                            toggleSidebar(); // Close the sidebar after navigation
                        }}
                    >
                        {item}
                    </div>
                ))}
            </nav>

            {/* Modal for Editing Profile */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex justify-content-between w-100">
                        <Button
                            variant="danger"
                            onClick={handleDeleteProfile}
                        >
                            {loading ? "Deleting..." : "Delete Profile"}
                        </Button>
                        <div>
                            <Button
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSaveChanges}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Sidebar;