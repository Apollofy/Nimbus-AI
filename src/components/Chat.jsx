import { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/gemini';
import { Send } from 'lucide-react';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages(prev => [...prev, { text: newMessage, sender: 'user' }]);
            setNewMessage('');
            setIsLoading(true);

            try {
                const response = await getGeminiResponse(newMessage);
                setMessages(prev => [...prev, {
                    text: response,
                    sender: 'gemini'
                }]);
            } catch (error) {
                setMessages(prev => [...prev, {
                    text: "Sorry, I encountered an error. Please try again.",
                    sender: 'gemini'
                }]);
                console.error('Gemini API Error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-8xl mx-auto bg-gray-100 rounded-lg" >
            {/* Header */}
            <div className="bg-white shadow-md p-1 sticky top-0 rounded-2xl">
                <div className="flex items-center gap-3">
                    <img
                        src="/chat-bot.gif"
                        alt="G-Chat Logo"
                        className="size-14"
                    />
                    <h1 className="text-3xl font-extralight text-gray-800 font-montserrat">Nimbus  </h1>
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 p-4 overflow-y-auto scrollbar-hide rounded-md bg-[url('/chat-container.jpg')] bg-center">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex items-end gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Avatar */}
                            <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                                <img
                                    src={message.sender === 'user' ? "/user-avatar.gif" : "/chat-bot.gif"}
                                    alt={message.sender === 'user' ? "User Avatar" : "Gemini Avatar"}
                                    className="w-10 h-10 rounded-full object-cover shadow-md"
                                />
                            </div>

                            {/* Message Bubble */}
                            <div
                                className={`max-w-[75%] rounded-xl p-3 ${message.sender === 'user'
                                    ? 'bg-black text-white rounded-br-none'
                                    : 'bg-white text-gray-800 shadow-md rounded-bl-none'
                                    }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2">
                            <div className="flex-shrink-0 mr-2">
                                <img
                                    src="/chat-bot.gif"
                                    alt="Gemini Avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            </div>
                            <div className="bg-gray-300 rounded-xl rounded-bl-none p-3 animate-pulse">
                                Typing...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-white p-2 shadow-lg sticky bottom-0 rounded-2xl">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded-2xl focus:outline-none focus:border-black"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-2xl transition-colors flex items-center justify-center ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-black hover:bg-gray-600 text-white'
                            }`}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;