'use client'
import './chatbot.css'
import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import Layout from '@/components/layout'

export default function Chatbot() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const abortControllerRef = useRef(null)
    const chatHistoryRef = useRef(null) // Ref for automatic scrolling

    // Function to scroll to the bottom
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop =
                chatHistoryRef.current.scrollHeight
        }
    }, [messages]) // Runs whenever messages update

    const sendMessage = async () => {
        if (!input.trim()) return
        setLoading(true)
        setMessages(prev => [...prev, { sender: 'user', text: input }])
        setInput('')
    
        abortControllerRef.current = new AbortController()
        const { signal } = abortControllerRef.current
    
        try {
            const token = localStorage.getItem('api_token')
            const headers = {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
                'X-Requested-With': 'XMLHttpRequest',
            }
    
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ollama/generate`,
                {
                    method: 'POST',
                    headers,
                    credentials: 'include',
                    body: JSON.stringify({ prompt: input }),
                    signal,
                }
            )
    
            if (!response.ok) throw new Error('Failed to fetch response')
    
            const botResponse = await response.text() // Get the entire response at once
            setMessages(prev => [...prev, { sender: 'bot', text: '' }])
    
            let currentText = ''
            for (let i = 0; i < botResponse.length; i++) {
                if (abortControllerRef.current === null) break // Stop if user cancels
                currentText += botResponse[i]
    
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1]
                    if (lastMessage.sender === 'bot') {
                        return [
                            ...prev.slice(0, -1),
                            { sender: 'bot', text: currentText },
                        ]
                    }
                    return [...prev, { sender: 'bot', text: currentText }]
                })
    
                await new Promise(resolve => setTimeout(resolve, 30)) // Delay for typing effect
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                setMessages(prev => [
                    ...prev,
                    { sender: 'bot', text: 'Response stopped.' },
                ])
            } else {
                console.error('Error fetching response:', error)
                setMessages(prev => [
                    ...prev,
                    { sender: 'bot', text: 'An error occurred. Please try again.' },
                ])
            }
        } finally {
            setLoading(false)
        }
    }
    

    const stopResponse = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
            setLoading(false)
        }
    }

    // Handle Enter key press
    const handleKeyPress = event => {
        if (event.key === 'Enter' && !loading) {
            event.preventDefault()
            sendMessage()
        }
    }

    return (
        <Layout>
            <div className="chatbot-container">
                <h1>Chatbot</h1>
                <div className="chat-history" ref={chatHistoryRef}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message ${message.sender}`}>
                            <strong>
                                {message.sender === 'user' ? 'You' : 'Bot'}:
                            </strong>
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}>
                                {message.text}
                            </ReactMarkdown>
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message here..."
                        disabled={loading}
                    />
                    <button onClick={sendMessage} disabled={loading}>
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                    {loading && <button onClick={stopResponse}>Stop</button>}
                </div>
            </div>
        </Layout>
    )
}
