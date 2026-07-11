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
    let timeGreeting = "Hello";
    if (clientHour >= 5 && clientHour < 12) {
      timeGreeting = "Good morning";
    } else if (clientHour >= 12 && clientHour < 17) {
      timeGreeting = "Good afternoon";
    } else if (clientHour >= 17 && clientHour < 22) {
      timeGreeting = "Good evening";
    } else {
      timeGreeting = "Good evening";
    }
    return `${timeGreeting}! 🍭 Welcome to Best Lolly Shop New Zealand! I am your **Best Lolly Shop AI Assistant**. To make your shopping experience even sweeter, make sure to use coupon code **SWEET10** at checkout to get a yummy **10% OFF** your entire order! Plus, we offer **FREE shipping** on NZ orders over $50! 🚚 How can I help satisfy your candy cravings today?`;
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
        text: data.reply || "I don't want to give you incorrect information. Please contact our support team, and they'll be happy to assist you.",
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
        fallback = `Hello! ${timeGreeting}! 🍭 Welcome to Best Lolly Shop New Zealand! I am your Best Lolly Shop AI Assistant. To make your shopping experience even sweeter, make sure to use coupon code **SWEET10** at checkout for **10% OFF** your entire order! Plus, we offer **FREE shipping** on all NZ orders over $50! 🚚 How can I help satisfies your candy cravings today?`;
      } else if (lower.match(/bye+|goodbye|see you|thanks|thank/)) {
        fallback = "Thank you for visiting! Have a wonderful, sweet day! If you need anything else, feel free to ask. 🍭";
      } else if (lower.match(/ship|deliver/)) {
        fallback = "We offer FREE express delivery across New Zealand on orders over $50 NZD! For orders under $50, shipping is a flat rate of $5 NZD. Standard delivery time is 3-5 business days. Can I help you find some sweets to qualify for free shipping? 🚚";
      } else if (lower.match(/discount|code|promo/)) {
        fallback = "You can use the coupon code **SWEET10** at checkout to get 10% OFF your entire order! Plus, we offer free shipping on New Zealand orders over $50. Ready to grab some treats? 🎟️";
      } else if (lower.match(/vegan|vegetarian|halal|gelatin|gluten|allerg|dietary/)) {
        fallback = "We have delicious options for everyone! 🌿 Many of our lollies are gluten-free or gelatin-free (like our Mayceys Sour Peaches and Spaceman Candy Sticks). You can find clear dietary badges and full ingredient lists on each product page. Are you looking for something gluten-free, gelatin-free, or vegan? 🍬";
      } else if (lower.match(/gumm|worm|peach|sour|ring|chew/)) {
        fallback = "We have an amazing selection of gummies! 🍬 Our Sour Neon Worms are tangy-coated bliss, and our Mayceys Sour Peaches are the gold standard of sour candy. They are available in 100g, 250g, 500g, and 1kg bags. Would you like me to recommend some specific gummies? 😋";
      } else if (lower.match(/choc|truffle|caramel|button|fish|bar/)) {
        fallback = "Chocolate lovers, you're in the right place! 🍫 We highly recommend our Premium Dark Truffles with Belgian ganache centres, the silkily rich Cadbury Caramilk Bar, or the iconic Pascall Chocolate Fish. Which chocolate treat would you like to add to your order? 💖";
      } else if (lower.match(/party|kid|pick|idea|gift|wedding|birthday|baby|shower|christmas|easter|halloween|valent/)) {
        fallback = "We love helping with parties and events! 🎉 For kid's parties, our custom pick-and-mix bulk bags are a huge hit. We also offer beautiful gift wrapping, corporate gifts, wedding favours, baby shower sweets, and seasonal collections. How many guests are you hosting, and what's your budget? 🎁";
      } else if (lower.match(/best|popular|top|recommend|favourite|favorite/)) {
        fallback = "I'd love to make some recommendations! Before I do, could you let me know what occasion you are shopping for, how many people it is for, and if you have a preferred flavour or budget? 🍭";
      } else {
        fallback = "I don't want to give you incorrect information. Please contact our support team, and they'll be happy to assist you.";
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
        aria-label="Toggle Best Lolly Shop AI Assistant"
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
        <div className="chatbot-panel glass-card" role="dialog" aria-label="Best Lolly Shop AI Assistant">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div className="bot-avatar">
                <span className="bot-avatar-emoji">🍭</span>
                <span className="bot-avatar-pulse"></span>
              </div>
              <div>
                <h3>Best Lolly Shop AI Assistant</h3>
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
                placeholder="Ask Best Lolly Shop AI Assistant..."
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
