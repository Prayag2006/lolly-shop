import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import './ChatBot.css';

// Render **bold** markdown inline in bot messages
const renderBotText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getInitialGreeting = () => {
    const clientHour = new Date().getHours();
    let timeGreeting = "Hello gorgeous";
    if (clientHour >= 5 && clientHour < 12) {
      timeGreeting = "Good morning gorgeous";
    } else if (clientHour >= 12 && clientHour < 17) {
      timeGreeting = "Good afternoon gorgeous";
    } else if (clientHour >= 17 && clientHour < 22) {
      timeGreeting = "Good evening gorgeous";
    } else {
      timeGreeting = "Good evening gorgeous";
    }
    return `${timeGreeting}! 🍭✨ I'm **Lolly**, your personal sweet assistant at Lolly Shop NZ! To make your day even sweeter, make sure to use coupon code **SWEET10** at checkout to get a yummy **10% OFF** your entire order! Plus, we offer **FREE shipping** on NZ orders over $50! 🚚💖 What candy cravings can I help satisfy today?`;
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: getInitialGreeting(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const trimmed = String(textToSend || '').trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Build multi-turn conversation for the server
      const conversationHistory = [...messages, userMsg].slice(-12).map(m => ({
        role: m.sender === 'bot' ? 'assistant' : 'user',
        content: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: conversationHistory,
          clientHour: new Date().getHours()
        })
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply || "Oh sugar! 🍭 Let me try that again — what sweet question can I help with?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error('Chatbot error:', err);
      // Rich local fallback
      const lower = trimmed.toLowerCase();
      const clientHour = new Date().getHours();
      let timeGreeting = "Good day";
      if (clientHour >= 5 && clientHour < 12) {
        timeGreeting = "Good morning";
      } else if (clientHour >= 12 && clientHour < 17) {
        timeGreeting = "Good afternoon";
      } else if (clientHour >= 17 && clientHour < 22) {
        timeGreeting = "Good evening";
      } else {
        timeGreeting = "Good evening";
      }

      let fallback;
      if (lower.match(/hello|hi+|hey+|howdy|morning|afternoon|evening|yo+/)) {
        fallback = `Hii sweetheart! ${timeGreeting}! 🍭✨ So glad you're here in our sweet paradise! Don't forget to use coupon code **SWEET10** at checkout to get a yummy 10% OFF your entire order! Plus, we offer FREE shipping on all NZ orders over $50! 🚚💖 What candy cravings can I help satisfy today?`;
      } else if (lower.match(/bye+|goodbye|see you|thanks|thank/)) {
        fallback = "Bye sweetheart! 🍭✨ Have an absolutely sugar-sweet day, and don't forget to treat yourself soon! 🍬💖";
      } else if (lower.match(/ship|deliver/)) {
        fallback = "Sweet news! 🚚 FREE express shipping on NZ orders over $50! Smaller orders ship for just $5 flat. Your treats arrive in 3-5 business days. Which products are you eyeing? 🍬";
      } else if (lower.match(/discount|code|promo/)) {
        fallback = "Oh you clever one! 🎟️ Use code **SWEET10** at checkout for 10% OFF your whole order! Ready to treat yourself? 💖";
      } else if (lower.match(/gumm|worm|peach|sour/)) {
        fallback = "Gummy heaven alert! 🍬🎉 Our Sour Neon Worms are tangy-coated pure bliss, and our Fuzzy Peach Rings are soft, juicy perfection! Available in 100g up to 1kg bags — the 1kg is the best value! Which size calls your name? 😋";
      } else if (lower.match(/choc|truffle|caramel/)) {
        fallback = "Chocolate lover, I see you! 🍫💖 Our Premium Dark Truffles have real Belgian ganache centres — absolutely divine! Or try the Sea Salt Caramel Bar for sweet-salty perfection. Want to try both in a gift pack? 🎁";
      } else {
        fallback = "Oh that's a great question! 🍭 While I get my answer together — have you checked out our Raspberry Sherbet Bombs? They're currently our #1 most-loved treat! Use code **SWEET10** for 10% off! What flavour are you in the mood for? 🍓";
      }
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: fallback,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    { label: '🍬 Best Gummies', query: 'What are your best gummy sweets?' },
    { label: '🍫 Top Chocolates', query: 'Recommend your best chocolates' },
    { label: '🎉 Party Picks', query: 'I need sweet ideas for a kids party' },
    { label: '🚚 Shipping Info', query: 'Tell me about shipping and delivery' },
    { label: '🎟️ Discount Code', query: 'Do you have any discount codes?' },
    { label: '🌿 Dietary Options', query: 'Do you have vegan or gluten free options?' },
  ];

  return (
    <div className="chatbot-wrapper">
      {/* Floating Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? 'active' : ''} animate-float`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Lolly Chat Assistant"
        id="chatbot-toggle-btn"
      >
        {isOpen ? <X size={24} /> : (
          <>
            <MessageCircle size={24} />
            <span className="chatbot-toggle-badge">AI</span>
          </>
        )}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="chatbot-panel glass-card" role="dialog" aria-label="Lolly Sweet Assistant">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div className="bot-avatar">
                <span className="bot-avatar-emoji">🍭</span>
                <span className="bot-avatar-pulse"></span>
              </div>
              <div>
                <h3>Lolly — Sweet Assistant</h3>
                <span className="bot-status">
                  <span className="status-dot"></span>
                  Powered by Gemini AI ✨
                </span>
              </div>
            </div>
            <button className="panel-close-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="chatbot-messages" id="chatbot-messages-area">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-bubble-wrapper ${msg.sender === 'user' ? 'msg-user' : 'msg-bot'}`}>
                {msg.sender === 'bot' && (
                  <div className="msg-bot-icon">🍭</div>
                )}
                <div className="message-bubble">
                  <p>{msg.sender === 'bot' ? renderBotText(msg.text) : msg.text}</p>
                  <span className="msg-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="message-bubble-wrapper msg-bot">
                <div className="msg-bot-icon">🍭</div>
                <div className="message-bubble typing-bubble">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="chatbot-suggestions">
            {suggestions.map((sug) => (
              <button
                key={sug.label}
                className="suggestion-chip"
                onClick={() => handleSendMessage(sug.query)}
                disabled={isTyping}
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            className="chatbot-input-area"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
          >
            <div className="chatbot-input-inner">
              <Sparkles size={15} className="chatbot-input-icon" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask Lolly anything sweet..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
                id="chatbot-input"
                aria-label="Chat message input"
              />
            </div>
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>

          <div className="chatbot-footer-note">
            🔐 Secured · Powered by Google Gemini
          </div>
        </div>
      )}
    </div>
  );
};
