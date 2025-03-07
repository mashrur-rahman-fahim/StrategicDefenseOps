'use client'
import { useState, useRef, useEffect } from 'react'
import { flushSync } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { FaRegStopCircle } from 'react-icons/fa'
import Layout from '@/components/layout'
import axios from '@/lib/axios.js'

// Add Bootstrap CSS in your Layout or here
// In _app.js or Layout component: import 'bootstrap/dist/css/bootstrap.min.css'

export default function ReportGenerator() {
    const [operations, setOperations] = useState([])
    const [selectedOperationId, setSelectedOperationId] = useState('')
    const [reportType, setReportType] = useState('')
    const [operationStatus, setOperationStatus] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const abortControllerRef = useRef(null)
    const chatHistoryRef = useRef(null)
    const [stopped, setStopped] = useState(false)

    // Auto-scroll handling
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop =
                chatHistoryRef.current.scrollHeight
        }
    }, [messages])

    // Fetch completed operations
    useEffect(() => {
        const fetchCompletedOperations = async () => {
            try {
                const response = await axios.get('/api/get-all-operations')
                const completedOps = response.data[1].filter(
                    (op) => op.status === 'completed'
                )
                setOperations(completedOps)
            } catch (err) {
                console.error('Error fetching operations:', err)
            }
        }
        fetchCompletedOperations()
    }, [])

    const generateReport = async () => {
        if (!selectedOperationId || !operationStatus) {
            alert('Please select an operation and set its status')
            return
        }

        setMessages([])
        setLoading(true)
        setStopped(false)
        abortControllerRef.current = new AbortController()

        try {
            const token = localStorage.getItem('api_token')
            const headers = {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
                'X-Requested-With': 'XMLHttpRequest'
            }
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-report/${selectedOperationId}`,
                {
                    method: 'POST',
                    headers,
                    credentials: 'include',
                    body: JSON.stringify({
                        report_type: reportType,
                        operation_status: operationStatus
                    }),
                    signal: abortControllerRef.current.signal
                }
            )

            if (!response.body) throw new Error('No response body')

            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            let currentText = ''
            let buffer = ''

            // Initial bot message
            flushSync(() => {
                setMessages((prev) => [...prev, { sender: 'bot', text: '' }])
            })
            let loopController = true
            while (loopController) {
                if (stopped) break // ✅ Stop immediately when stop is triggered

                const { done, value } = await reader.read()
                if (done) {
                    break
                }

                buffer += decoder.decode(value, { stream: true })

                while (buffer.length > 0) {
                    if (stopped) break // ✅ Break the inner loop too

                    const char = buffer.charAt(0)
                    buffer = buffer.substring(1)

                    currentText += char

                    flushSync(() => {
                        setMessages((prev) => {
                            const newMessages = [...prev]
                            const lastMessage =
                                newMessages[newMessages.length - 1]

                            if (lastMessage?.sender === 'bot') {
                                lastMessage.text = currentText
                                return [...newMessages]
                            }
                            return [
                                ...newMessages,
                                { sender: 'bot', text: currentText }
                            ]
                        })
                    })

                    await new Promise((resolve) => setTimeout(resolve, 20))
                }
            }
        } catch (error) {
            if (error.name === 'AbortError' || stopped) {
                setMessages((prev) => [
                    ...prev,
                    { sender: 'bot', text: '\n\n**Report generation stopped**' }
                ])
            } else {
                console.error('Generation error:', error)
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: 'bot',
                        text: '## ❌ Error\nFailed to generate report. Please try again.'
                    }
                ])
            }
        } finally {
            setLoading(false)
        }
    }

    const stopReportGeneration = () => {
        setStopped(true) // ✅ Set the stopped flag immediately
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        setLoading(false)
    }

    return (
        <Layout>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-12 mb-4">
                        <h1 className="display-5">
                            Operation Report Generator
                        </h1>
                        <hr />
                    </div>
                </div>

                <div className="row">
                    {/* Left Panel - Operation Selection */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">Completed Operations</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    {operations.map((op) => (
                                        <div key={op.id} className="col-12">
                                            <div
                                                className={`card ${selectedOperationId === op.id ? 'border-primary shadow-sm' : ''}`}
                                                onClick={() => {
                                                    setSelectedOperationId(
                                                        op.id
                                                    )
                                                    setReportType(
                                                        'post_operation'
                                                    )
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="card-body">
                                                    <h6 className="card-title">
                                                        {op.name}
                                                    </h6>
                                                    <p className="card-text text-muted small">
                                                        Created:{' '}
                                                        {new Date(
                                                            op.created_at
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Report Generation */}
                    <div className="col-md-8">
                        <div className="card shadow mb-4">
                            <div className="card-header bg-secondary text-white">
                                <h5 className="mb-0">Report Parameters</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Report Type
                                        </label>
                                        <input
                                            type="text"
                                            value={reportType}
                                            readOnly
                                            className="form-control-plaintext border rounded p-2"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Operation Outcome
                                        </label>
                                        <select
                                            value={operationStatus}
                                            onChange={(e) =>
                                                setOperationStatus(
                                                    e.target.value
                                                )
                                            }
                                            disabled={loading}
                                            className="form-select"
                                        >
                                            <option value="">
                                                Select outcome
                                            </option>
                                            <option value="success">
                                                Successful
                                            </option>
                                            <option value="failed">
                                                Failed
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow mb-4">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Generated Report</h5>
                            </div>
                            <div
                                className="card-body chat-history p-0"
                                style={{
                                    maxHeight: '400px',
                                    overflowY: 'auto'
                                }}
                                ref={chatHistoryRef}
                            >
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 ${message.sender === 'bot' ? 'bg-light' : 'bg-secondary text-white'}`}
                                    >
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                h2: ({ ...props }) => (
                                                    <h2
                                                        className="h4"
                                                        {...props}
                                                    />
                                                ),
                                                p: ({ ...props }) => (
                                                    <p
                                                        className="mb-0"
                                                        {...props}
                                                    />
                                                )
                                            }}
                                        >
                                            {message.text}
                                        </ReactMarkdown>
                                    </div>
                                ))}

                                {loading && (
                                    <div className="p-3 bg-light">
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="spinner-border me-2"
                                                role="status"
                                            />
                                            <span>Generating report...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                onClick={generateReport}
                                disabled={
                                    loading ||
                                    !selectedOperationId ||
                                    !operationStatus
                                }
                                className="btn btn-primary flex-grow-1"
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Report'
                                )}
                            </button>

                            {loading && (
                                <button
                                    onClick={stopReportGeneration}
                                    className="btn btn-danger"
                                >
                                    <FaRegStopCircle /> Stop
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
