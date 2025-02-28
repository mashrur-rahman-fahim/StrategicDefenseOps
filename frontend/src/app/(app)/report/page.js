"use client";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "./report.css";
import Layout from '../components/layout'; 

export default function ReportGenerator() {
    const [reportType, setReportType] = useState("");
    const [operationStatus, setOperationStatus] = useState("");
    const [messages, setMessages] = useState([]); // Use messages array for chat-like display
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef(null);
    const operationId = 8; // Replace with actual operation ID

    const generateReport = async () => {
        setMessages([]); // Clear previous messages
        setLoading(true);

        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        try {
            const token = localStorage.getItem("api_token"); // Assuming you use a token for auth
            const headers = {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
                "X-Requested-With": "XMLHttpRequest",
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-report/${operationId}`, {
                method: "POST",
                headers,
                credentials: "include",
                body: JSON.stringify({
                    report_type: reportType,
                    operation_status: operationStatus,
                }),
                signal, // Pass the AbortController signal
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botResponse = "";

            // Add a "bot" message to the messages array
            setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                botResponse += chunk;

                // Update the last "bot" message with the new chunk
                setMessages((prev) => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.sender === "bot") {
                        return [...prev.slice(0, -1), { sender: "bot", text: botResponse }];
                    }
                    return [...prev, { sender: "bot", text: botResponse }];
                });

                await new Promise((resolve) => setTimeout(resolve, 50)); // Throttle updates
            }
        } catch (error) {
            if (error.name === "AbortError") {
                setMessages((prev) => [...prev, { sender: "bot", text: "Report generation stopped." }]);
            } else {
                console.error("Error generating report:", error);
                setMessages((prev) => [...prev, { sender: "bot", text: "An error occurred. Please try again." }]);
            }
        } finally {
            setLoading(false);
        }
    };

    const stopReportGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setLoading(false);
        }
    };

    return (
         <Layout> 
        <div className="p-4 max-w-lg mx-auto border rounded shadow-lg">
            <h1 className="text-xl font-bold mb-4">Generate Report</h1>
            <div className="mb-2">
                <label className="block font-semibold">Report Type:</label>
                <input 
                    type="text" 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full border p-2 rounded" 
                    placeholder="Enter report type"
                />
            </div>
            <div className="mb-2">
                <label className="block font-semibold">Operation Status:</label>
                <input 
                    type="text" 
                    value={operationStatus} 
                    onChange={(e) => setOperationStatus(e.target.value)}
                    className="w-full border p-2 rounded" 
                    placeholder="Enter operation status"
                />
            </div>
            <button 
                onClick={generateReport} 
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full disabled:opacity-50"
            >
                {loading ? "Generating..." : "Generate Report"}
            </button>
            {loading && (
                <button 
                    onClick={stopReportGeneration} 
                    className="bg-red-600 text-white px-4 py-2 rounded mt-2 w-full"
                >
                    Stop Generation
                </button>
            )}
            <div className="mt-4 p-2 border rounded bg-gray-100">
                <h2 className="font-semibold">Generated Report:</h2>
                <div className="chat-history">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender}`}>
                            <strong>{message.sender === "bot" ? "Report" : "You"}:</strong>
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {message.text}
                            </ReactMarkdown>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </Layout> 
        
    );
}