'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Layout from '@/components/layout';
import { RiSendPlaneFill } from 'react-icons/ri';
import { FaRobot, FaUser, FaStop } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('dark'); // 'light' or 'dark'
    const [model] = useState('default'); // Model selection
    const abortControllerRef = useRef(null);
    const chatHistoryRef = useRef(null);
    const inputRef = useRef(null);

    // Initialize with a welcome message
    useEffect(() => {
        setMessages([
            {
                sender: 'bot',
                text: "👋 Hello! I'm your AI assistant. How can I help you today?",
            },
        ]);
    }, []);

    // Function to scroll to the bottom
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop =
                chatHistoryRef.current.scrollHeight;
        }
    }, [messages]);

    // Focus input on load
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Toggle theme
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }

    const sendMessage = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setMessages((prev) => [...prev, { sender: 'user', text: input }]);
        setInput('');

        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        try {
            const token = localStorage.getItem('api_token');
            const headers = {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
                'X-Requested-With': 'XMLHttpRequest',
            };

            // Show typing indicator
            setMessages((prev) => [
                ...prev,
                { sender: 'bot', text: '', isTyping: true },
            ]);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ollama/generate`,
                {
                    method: 'POST',
                    headers,
                    credentials: 'include',
                    body: JSON.stringify({
                        prompt: input,
                        model: model,
                    }),
                    signal,
                }
            );

            if (!response.ok) throw new Error('Failed to fetch response');

            const botResponse = await response.text();

            // Remove typing indicator
            setMessages((prev) => prev.filter((msg) => !msg.isTyping));

            // Add real message
            setMessages((prev) => [...prev, { sender: 'bot', text: '' }]);

            let currentText = '';
            for (let i = 0; i < botResponse.length; i++) {
                if (abortControllerRef.current === null) break;
                currentText += botResponse[i];

                setMessages((prev) => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.sender === 'bot') {
                        return [
                            ...prev.slice(0, -1),
                            { sender: 'bot', text: currentText },
                        ];
                    }
                    return [...prev, { sender: 'bot', text: currentText }];
                })

                await new Promise((resolve) => setTimeout(resolve, 20));
            }
        } catch (error) {
            // Remove typing indicator
            setMessages((prev) => prev.filter((msg) => !msg.isTyping));

            if (error.name === 'AbortError') {
                setMessages((prev) => [
                    ...prev,
                    { sender: 'bot', text: 'Response stopped.' },
                ]);
            } else {
                console.error('Error fetching response:', error);
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: 'bot',
                        text: 'An error occurred. Please try again.',
                    },
                ]);
            }
        } finally {
            setLoading(false);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const stopResponse = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setLoading(false);

            // Remove typing indicator
            setMessages((prev) => prev.filter((msg) => !msg.isTyping));
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey && !loading) {
            event.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            {
                sender: 'bot',
                text: 'Chat cleared. How can I help you today?',
            },
        ]);
    }

    return (
        <Layout>
            <div
                className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}
            >
                <div className="container mx-auto px-4 py-8 max-w-6xl w-full">
                    {' '}
                    {/* Increased from max-w-4xl to max-w-6xl */}
                    <div
                        className={`rounded-lg overflow-hidden shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full`}
                    >
                        {/* Header */}
                        <div
                            className={`py-4 px-6 flex justify-between items-center border-b ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-purple-500 to-blue-500 border-gray-200'}`}
                        >
                            <div className="flex items-center space-x-2">
                                <FaRobot
                                    className={`text-2xl ${theme === 'dark' ? 'text-blue-300' : 'text-white'}`}
                                />
                                <h1
                                    className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-white'}`}
                                >
                                    AI Assistant
                                </h1>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={toggleTheme}
                                    className={`px-3 py-1 rounded-md text-sm ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100 text-gray-800'}`}
                                >
                                    {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                                </button>
                                <button
                                    onClick={clearChat}
                                    className={`px-3 py-1 rounded-md text-sm ${theme === 'dark' ? 'bg-red-900 hover:bg-red-800 text-white' : 'bg-red-100 hover:bg-red-200 text-red-800'}`}
                                >
                                    Clear Chat
                                </button>
                            </div>
                        </div>

                        {/* Chat History */}
                        <div
                            ref={chatHistoryRef}
                            className={`p-4 h-[500px] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
                        >
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 ${message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                                >
                                    <div
                                        className={`
                                            max-w-[70%] rounded-lg px-4 py-2 shadow-sm
                                            ${
                                                message.sender === 'user'
                                                    ? theme === 'dark'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-blue-500 text-white'
                                                    : theme === 'dark'
                                                      ? 'bg-gray-700 text-white'
                                                      : 'bg-white text-gray-800'
                                            }
                                            ${message.isTyping ? 'animate-pulse' : ''}
                                        `}
                                    >
                                        <div className="flex items-center space-x-2 mb-1">
                                            {message.sender === 'user' ? (
                                                <FaUser className="text-sm opacity-70" />
                                            ) : (
                                                <FaRobot className="text-sm opacity-70" />
                                            )}
                                            <span className="text-xs font-medium opacity-70">
                                                {message.sender === 'user'
                                                    ? 'You'
                                                    : 'AI Assistant'}
                                            </span>
                                        </div>

                                        {message.isTyping ? (
                                            <div className="flex items-center space-x-1">
                                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100" />
                                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200" />
                                            </div>
                                        ) : (
                                            <div className="prose prose-sm max-w-none">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkMath]}
                                                    rehypePlugins={[
                                                        rehypeKatex,
                                                    ]}
                                                    components={{
                                                        // Apply custom styling to different markdown elements
                                                        p: ({ ...props }) => (
                                                            <p
                                                                className="my-1"
                                                                {...props}
                                                            />
                                                        ),
                                                        pre: ({ ...props }) => (
                                                            <pre
                                                                className={`p-3 my-2 rounded-md overflow-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}
                                                                {...props}
                                                            />
                                                        ),
                                                        code: ({
                                                            inline,
                                                            ...props
                                                        }) =>
                                                            inline ? (
                                                                <code
                                                                    className={`px-1 py-0.5 rounded ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}
                                                                    {...props}
                                                                />
                                                            ) : (
                                                                <code
                                                                    {...props}
                                                                />
                                                            ),
                                                        a: ({ ...props }) => (
                                                            <a
                                                                className="text-blue-400 hover:underline"
                                                                {...props}
                                                            />
                                                        ),
                                                        ul: ({ ...props }) => (
                                                            <ul
                                                                className="list-disc pl-5 my-2"
                                                                {...props}
                                                            />
                                                        ),
                                                        ol: ({ ...props }) => (
                                                            <ol
                                                                className="list-decimal pl-5 my-2"
                                                                {...props}
                                                            />
                                                        ),
                                                        li: ({ ...props }) => (
                                                            <li
                                                                className="my-1"
                                                                {...props}
                                                            />
                                                        ),
                                                        h1: ({ ...props }) => (
                                                            <h1
                                                                className="text-xl font-bold my-2"
                                                                {...props}
                                                            />
                                                        ),
                                                        h2: ({ ...props }) => (
                                                            <h2
                                                                className="text-lg font-bold my-2"
                                                                {...props}
                                                            />
                                                        ),
                                                        h3: ({ ...props }) => (
                                                            <h3
                                                                className="text-md font-bold my-2"
                                                                {...props}
                                                            />
                                                        ),
                                                        blockquote: ({
                                                            ...props
                                                        }) => (
                                                            <blockquote
                                                                className={`border-l-4 pl-3 my-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
                                                                {...props}
                                                            />
                                                        ),
                                                    }}
                                                >
                                                    {message.text}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                                    <FaRobot className="text-6xl mb-4 opacity-30" />
                                    <p>
                                        No messages yet. Start a conversation!
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div
                            className={`p-4 border-t ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                        >
                            <div className="flex items-center space-x-2">
                                <textarea
                                    ref={inputRef}
                                    rows="2"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type your message here..."
                                    disabled={loading}
                                    className={`flex-grow resize-none rounded-lg px-4 py-2 outline-none focus:ring-2 ${
                                        theme === 'dark'
                                            ? 'bg-gray-800 text-white border-gray-700 focus:ring-blue-500'
                                            : 'bg-gray-100 text-gray-800 border-gray-300 focus:ring-blue-400'
                                    }`}
                                />
                                {loading ? (
                                    <button
                                        onClick={stopResponse}
                                        className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        <FaStop />
                                    </button>
                                ) : (
                                    <button
                                        onClick={sendMessage}
                                        disabled={!input.trim()}
                                        className={`p-3 rounded-full ${
                                            input.trim()
                                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                                : theme === 'dark'
                                                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {loading ? (
                                            <ImSpinner8 className="animate-spin" />
                                        ) : (
                                            <RiSendPlaneFill />
                                        )}
                                    </button>
                                )}
                            </div>
                            <div className="mt-2 text-xs text-center opacity-60">
                                <p>
                                    Press Enter to send, Shift+Enter for new
                                    line
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
