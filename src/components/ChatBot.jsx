import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import './ChatBot.css';

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi there! I'm your Sweet Assistant 🍭✨. Craving something delicious today? Ask me about our premium chocolates, sour gummies, shipping rates, or discount codes! 💖",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const answerPatterns = [
    {
      keywords: ['hello', 'hi ', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'hola'],
      answer: "Hello! Welcome to Lolly Shop! 🍭✨ I’m your Sweet Assistant. Cravings run high today! Ask me about our candy collections, delivery details, or promo codes, and let's get snacking! 🍬💖"
    },
    {
      keywords: ['gumm', 'worm', 'peach', 'rings', 'sour', 'berry', 'strap'],
      answer: "Gummies are our absolute specialty! 🍬🎉 You MUST try our top-selling Sour Neon Worms (tangy-coated bliss!) or our juicy Fuzzy Peach Rings! They are soft, chewable, and bursting with fruity joy. Available in sizes up to 1kg! 🍑😋"
    },
    {
      keywords: ['choc', 'truffle', 'caramel', 'dark', 'milk', 'cocoa'],
      answer: "Mmm, did someone say chocolate? 🍫🤤 Our top recommendations are the rich, velvety Premium Dark Truffles (Belgian ganache centers!) and the luxurious Sea Salt Caramel Bar. Absolute heaven in every single bite!"
    },
    {
      keywords: ['lolli', 'pop', 'lollipop', 'suck', 'stick'],
      answer: "Lolly lovers rejoice! 🍭 Try our gorgeous Rainbow Carousel Lollipop (perfect for retro photos!) or our fruity, fun Blueberry Bubble Pop with a bubblegum surprise inside! 🎈"
    },
    {
      keywords: ['deliver', 'ship', 'shipping', 'charge', 'free', 'order', 'arrival', 'time', 'days', 'nz'],
      answer: "Here's the scoop on shipping! 🚚 We offer FREE Express Shipping across New Zealand on all orders over $50 NZD! For smaller orders, it's just a flat $5 NZD fee. Your sweet box will arrive within 3-5 business days packed with absolute care! 📦✨"
    },
    {
      keywords: ['discount', 'offer', 'coupon', 'promo', 'sale', 'deal', 'save', 'code'],
      answer: "OMG yes! 🎟️💖 Use coupon code SWEET10 at checkout to get a sweet 10% OFF your entire order! Just type it in during checkout to save. Happy snacking! 🍭"
    },
    {
      keywords: ['price', 'how much', 'cost', 'weight', '100g', '250g', '500g', '1kg', 'kg', 'gram', 'grams'],
      answer: "We let you customize your sweet bag size! ⚖️ Every sweet is available in 100g, 250g, 500g, and 1kg bags! Check the weight selector on any product page to see the prices instantly. The larger the bag, the more you save! 📈🍭"
    },
    {
      keywords: ['vegan', 'vegetarian', 'halal', 'gelatin', 'gluten', 'allergen', 'allergy'],
      answer: "We care about your sweet preferences! 🌿 Many of our treats are gluten-free and gelatin-free. Check the ingredients accordion on any product details page for exact info, or try our delicious gelatin-free lollipops! 🍭💚"
    },
    {
      keywords: ['best', 'popular', 'top', 'recommend', 'favorite'],
      answer: "You can't go wrong with our crowd favorites! 🏆 The overall top sellers are Sour Neon Worms 🍬, Premium Dark Truffles 🍫, and Raspberry Sherbet Bombs 🍭! Try them out and thank us later!"
    },
    {
      keywords: ['admin', 'login', 'portal', 'dashboard', 'owner'],
      answer: "Looking to access the administrator panel? 🔑 You can login via the Portal Sign In page! Use username admin and password admin123 to check out the admin dashboard where you can manage orders, products, and categories! 💻⚙"
    },
    {
      keywords: ['return', 'refund', 'exchange', 'cancel'],
      answer: "Due to food safety regulations, we cannot accept returns on opened lollies. 🛡️ However, if your delivery arrived damaged or incorrect, please email us immediately at BestLollyShop@gmail.com with your order details and we'll make it right! 💖"
    },
    {
      keywords: ['contact', 'support', 'help', 'email', 'phone'],
      answer: "We are here to help! 💌 You can reach out directly by emailing us at BestLollyShop@gmail.com or by leaving a request through our Contact Form on the page! We usually respond within a few hours! ⏰"
    },
    {
      keywords: ['thank you', 'thanks', 'awesome', 'perfect', 'cool'],
      answer: "Aw, you're sweet! 🍬💖 Let me know if you need anything else, and have a delicious day!"
    }
  ];

  const getBotResponse = (textLower) => {
    const match = answerPatterns.find(pattern => pattern.keywords.some(k => textLower.includes(k)));
    return match ? match.answer : "I'm here to answer all your sweet questions! 🍭 Ask me about products, shipping speeds, coupon codes, gift ideas, or portal login credentials and I'll do my best to assist! ✨";
  };

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await res.json();

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply || "I'm here to help you pick the best candies! 🍭",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chatbot API error:', err);
      // Fallback to local regex-like pattern matching if API fails
      const textLower = textToSend.toLowerCase();
      const botResponseText = getBotResponse(textLower);

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestionText) => {
    // Strip emojis for keyword parser matching if needed
    handleSendMessage(suggestionText);
  };

  const suggestions = [
    'Recommend Chocolates 🍫',
    'Recommend Gummies 🍬',
    'Shipping & Delivery 🚚',
    'Discount Codes 🎟️',
    'Admin Portal 🔑'
  ];

  return (
    <div className="chatbot-wrapper">
      {/* Floating Toggle Button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'active' : ''} animate-float`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="chatbot-panel glass-card">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div className="bot-avatar">🍭</div>
              <div>
                <h3>Sweet Assistant</h3>
                <span className="bot-status">Online and Ready</span>
              </div>
            </div>
            <button className="panel-close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-bubble-wrapper ${msg.sender === 'user' ? 'msg-user' : 'msg-bot'}`}>
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <span className="msg-time">{msg.time}</span>
                </div>
              </div>
            ))}
            
            {/* Typing Loader */}
            {isTyping && (
              <div className="message-bubble-wrapper msg-bot">
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
                key={sug} 
                className="suggestion-chip"
                onClick={() => handleSuggestionClick(sug)}
              >
                {sug}
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
            <input
              type="text"
              placeholder="Ask about sweets, delivery..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="chatbot-send-btn" disabled={!inputValue.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
