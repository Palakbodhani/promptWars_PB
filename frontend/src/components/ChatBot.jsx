import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';

const ChatBot = ({ onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello Dadi! I'm your AI helper. How are you feeling today? ✨", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulated API call to Gemini
    setTimeout(() => {
      const responses = [
        "That sounds wonderful! Remember to drink some water. 💧",
        "I'm here for you. Would you like me to check your medicine schedule? 💊",
        "You're doing great! Shall we look at a healthy recipe for dinner? 📖",
        "It's a beautiful day! Maybe a short walk in the garden would be nice? 📍",
        "I'm always here to chat. Is there anything else you need help with?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: randomResponse, sender: 'bot' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="feature-page chat-page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back to home">
          <ArrowLeft size={32} />
        </button>
        <h2>Care Bot</h2>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
              <div className="chat-icon">
                {msg.sender === 'bot' ? <Bot size={24} color="#9B5DE5" /> : <User size={24} color="#FF6B6B" />}
              </div>
              <div className="chat-bubble">
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble-wrapper bot">
              <div className="chat-icon"><Bot size={24} color="#9B5DE5" /></div>
              <div className="chat-bubble typing">
                <p>Thinking...</p>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            aria-label="Chat input"
          />
          <button className="send-btn" onClick={handleSend} aria-label="Send message">
            <Send size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
