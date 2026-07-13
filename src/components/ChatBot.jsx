import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import './ChatBot.css';

// Render **bold** and line breaks in bot messages
const renderBotText = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={lineIdx}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return <span key={i}>{part}</span>;
        })}
        {lineIdx < text.split('\n').length - 1 && <br />}
      </span>
    );
  });
};

// ── LOCAL TRAINED RESPONSES (used when Gemini API is unavailable) ─────────────
const TRAINED_RESPONSES = {
  greeting: (timeGreeting) =>
    `${timeGreeting}! 🍭\n\nHi! I'm the **Best Lolly Shop Assistant** — here to help you find the perfect sweets!\n\n🎟️ Use code **SWEET10** at checkout for **10% OFF** your order!\n🚚 **FREE shipping** on NZ orders over **$50 NZD**!\n🏙️ **Hamilton** customers get FREE delivery on every order!\n\nWhat can I help you find today? 😊`,

  gummies: () =>
    `🍬 **Our Best-Selling Gummies & Chewy Sweets!**\n\n` +
    `⭐ **Sour Neon Worms** — Tangy rainbow-coated gummy worms, absolutely irresistible! Perfect for sour candy lovers.\n\n` +
    `⭐ **Mayceys Sour Peaches** — The gold standard of sour candy in NZ. Intensely sour, then sweet — addictive!\n\n` +
    `⭐ **Pascall Jet Planes** — A Kiwi classic! Firm chewy candy in fun aeroplane shapes, loved by all ages.\n\n` +
    `⭐ **Trolli Sour Brite Crawlers** — Fruity & sour worms in bright neon colours — a party favourite.\n\n` +
    `🛍️ Available in **100g, 250g, 500g & 1kg** bags. The **1kg bag is the best value!**\n\nWould you like to mix & match, or are you looking for a specific flavour? 😋`,

  chocolates: () =>
    `🍫 **Our Top Chocolate Picks!**\n\n` +
    `⭐ **Premium Dark Truffles** — Luxurious Belgian ganache centres in rich dark chocolate. Perfect for gifting!\n\n` +
    `⭐ **Cadbury Caramilk Bar** — Silky smooth golden caramel chocolate — impossibly moreish.\n\n` +
    `⭐ **Pascall Chocolate Fish** — A New Zealand icon! Marshmallow coated in creamy milk chocolate.\n\n` +
    `⭐ **Whittaker's Peanut Butter Cups** — Kiwi favourite. Velvety chocolate shell with peanut butter filling.\n\n` +
    `⭐ **Cadbury Roses Selection Box** — A gorgeous assorted chocolate box, ideal for gifts & events.\n\n` +
    `🎁 All chocolates are available as **gift boxes** with custom wrapping!\n\nAny specific chocolate preference — dark, milk, or white? 🍫`,

  party: () =>
    `🎉 **Party & Event Candy Solutions!**\n\n` +
    `We LOVE helping make your events extra special! Here's what we offer:\n\n` +
    `🎂 **Birthday Parties** — Custom pick-and-mix bulk bags, lolly bags for every guest!\n` +
    `👶 **Baby Showers** — Pastel-coloured sweets, personalised lolly favours in matching themes.\n` +
    `💒 **Weddings & Engagements** — Elegant candy buffets, personalised lollies with your names & date.\n` +
    `🏢 **Corporate Events** — Logo-printed candy, branded confectionery, bulk promotional packs.\n` +
    `🎃 **Halloween / Christmas / Easter** — Seasonal themed treats & gift packs.\n\n` +
    `📦 **Bulk Bags:** 100g, 250g, 500g & 1kg options available.\n` +
    `🎨 **Custom Printing:** We print logos & messages on lollies and packaging!\n\n` +
    `How many guests are you expecting, and what's your budget? I'll tailor the perfect sweet package for you! 🎁`,

  shipping: () =>
    `🚚 **Shipping & Delivery Information**\n\n` +
    `🏙️ **Hamilton, NZ** — **FREE delivery** automatically applied at checkout! No code needed.\n\n` +
    `🇳🇿 **Rest of New Zealand:**\n` +
    `✅ Orders **over $50 NZD** → **FREE express shipping!**\n` +
    `📦 Orders **under $50 NZD** → Flat rate of **$5 NZD**\n\n` +
    `⏱️ **Delivery Time:** 3–5 business days (NZ-wide)\n` +
    `📍 We currently ship within **New Zealand only**\n\n` +
    `📦 **Order Tracking:** Once your order is dispatched, you'll receive an email with your tracking number.\n\n` +
    `💡 **Tip:** Add more items to hit $50 and get FREE shipping! Need help finding something to top up your order? 😊`,

  discount: () =>
    `🎟️ **Current Deals & Discount Codes!**\n\n` +
    `💥 **SWEET10** — Use at checkout for **10% OFF** your ENTIRE order! Valid for all products.\n\n` +
    `🚚 **Free Shipping Deal** — Spend **$50 NZD or more** and get **FREE express shipping** automatically!\n\n` +
    `🏙️ **Hamilton Free Delivery** — Live in Hamilton, NZ? You automatically get **FREE delivery** on every order!\n\n` +
    `🛍️ **Bulk Buy Savings** — The bigger the bag, the better the value:\n` +
    `• 100g → Great for trying new flavours\n` +
    `• 1kg → Best value per gram — save more, eat more! 🍬\n\n` +
    `📧 **Newsletter Subscribers** get exclusive early access to sales and new arrivals!\n\nReady to start shopping? 🛒`,

  dietary: () =>
    `🌿 **Dietary & Allergy Options at Best Lolly Shop**\n\n` +
    `We have delicious options for everyone! Here's what's available:\n\n` +
    `✅ **Gluten-Free:** Many of our lollies are naturally gluten-free. Check the dietary badge on each product page.\n\n` +
    `✅ **Gelatin-Free / Vegan-Friendly:** Options include:\n` +
    `• **Mayceys Sour Peaches** — Gelatin-free & vegan!\n` +
    `• **Spaceman Candy Sticks** — Gelatin-free & vegan!\n` +
    `• **Sour Rainbow Belts** — No gelatin, great for vegans.\n\n` +
    `✅ **Nut-Free Options:** Many of our gummy sweets are produced in nut-free facilities. Please check individual labels.\n\n` +
    `⚠️ **Allergen Information:** Full ingredient lists and allergen info are listed on every product page.\n\n` +
    `❓ Have a specific allergy or dietary need? Tell me and I'll point you to the right products! 💚`,

  shipping_fallback: () =>
    `🚚 **We offer FREE delivery in Hamilton, New Zealand!** 🎉\n\nFor other NZ locations:\n✅ Orders over **$50 NZD** → FREE express shipping!\n📦 Orders under $50 → Flat rate **$5 NZD**\n⏱️ Standard delivery: **3–5 business days**\n\nCan I help you find some sweets? 😊`,

  discount_fallback: () =>
    `🎟️ Use coupon code **SWEET10** at checkout to get **10% OFF** your entire order!\n\nPlus, we offer **FREE shipping** on NZ orders over **$50**. Ready to grab some treats? 🛒`,

  bulk: () =>
    `📦 **Bulk Candy Orders**\n\nWe LOVE bulk orders! Here's what we offer:\n\n🛍️ **Bag Sizes:**\n• **100g** — Perfect for trying new flavours\n• **250g** — Great personal treat\n• **500g** — Ideal for sharing / small events\n• **1kg** — **Best value!** Recommended for parties & large groups\n\n🎨 **Custom Printing:** Add your logo or message to lollies & packaging!\n🎁 **Gift Boxes:** Custom-wrapped candy boxes available.\n\n📧 For large or custom bulk orders, email us: **BestLollyShop@gmail.com**\n\nHow many people are you shopping for? 😊`,

  payment: () =>
    `💳 **Payment Methods Accepted**\n\nWe support a wide range of payment options for your convenience:\n\n✅ Credit Card (Visa, Mastercard)\n✅ Debit Card\n✅ Google Pay\n✅ Apple Pay\n✅ Shop Pay\n✅ PayPal\n✅ Bank Transfer\n\nAll transactions are **100% secure** and encrypted. 🔐\n\nReady to complete your order? Head to the **Checkout** page! 🛒`,

  recommend: () =>
    `🍭 I'd love to recommend the perfect sweets for you!\n\nTo help me find the best match, could you tell me:\n\n1️⃣ **What's the occasion?** (personal treat, gift, birthday, party, wedding, corporate)\n2️⃣ **How many people** are you buying for?\n3️⃣ **Flavour preference?** (sour, sweet, chocolate, fruity, caramel, mixed)\n4️⃣ **Any dietary needs?** (vegan, gluten-free, halal, nut-free)\n5️⃣ **Budget?** (rough guide helps me find the best value!)\n\nOnce I know, I'll pick the perfect sweets! 😊`,

  default: () =>
    `🍭 I'm here to help! Could you tell me a bit more about what you're looking for?\n\nFor example:\n• A specific flavour or product type?\n• Shopping for a special occasion?\n• Need help with an order or account?\n\nOr tap one of the quick options below! 😊`,
};

const getLocalFallback = (query, timeGreeting) => {
  const lower = String(query || '').toLowerCase();

  if (lower.match(/hello|\bhi\b|\bhey\b|howdy|good morning|good afternoon|good evening|\byo\b/)) {
    return TRAINED_RESPONSES.greeting(timeGreeting);
  }
  if (lower.match(/bye|goodbye|see you|cheers|thanks|thank you/)) {
    return `Thank you for visiting **Best Lolly Shop**! 🍭 Have a wonderfully sweet day!\n\nCome back anytime — don't forget code **SWEET10** for 10% off your next order! 🎟️`;
  }
  if (lower.match(/gumm|worm|peach|sour|jet plane|chew|jelly|lolly|lollies|gummy|fruity|neon/)) {
    return TRAINED_RESPONSES.gummies();
  }
  if (lower.match(/choc|truffle|caramel|caramilk|chocolate fish|cadbury|whittaker|cocoa/)) {
    return TRAINED_RESPONSES.chocolates();
  }
  if (lower.match(/party|kid|pick.and.mix|gift box|wedding|birthday|baby shower|corporate|christmas|easter|halloween|valentin|event|favour|favor|school|movie night/)) {
    return TRAINED_RESPONSES.party();
  }
  if (lower.match(/ship|deliver|postage|freight|dispatch|arrival|courier/)) {
    return TRAINED_RESPONSES.shipping();
  }
  if (lower.match(/discount|coupon|promo|code|sale|offer|deal|saving/)) {
    return TRAINED_RESPONSES.discount();
  }
  if (lower.match(/vegan|vegetarian|halal|gelatin|gluten|allerg|dietary|nut.free|dairy.free|ingredient|sugar.free/)) {
    return TRAINED_RESPONSES.dietary();
  }
  if (lower.match(/bulk|wholesale|large order|big order|how many|quantity|100g|250g|500g|1kg/)) {
    return TRAINED_RESPONSES.bulk();
  }
  if (lower.match(/pay|payment|credit card|debit|paypal|apple pay|google pay|shop pay|bank transfer/)) {
    return TRAINED_RESPONSES.payment();
  }
  if (lower.match(/best|popular|top|recommend|favourite|favorite|trending|what should|help me choose|suggest|not sure|don.t know/)) {
    return TRAINED_RESPONSES.recommend();
  }
  if (lower.match(/return|refund|damaged|wrong order|complaint|broken|missing|incorrect/)) {
    return `😟 I'm sorry to hear that! We want every order to be perfect.\n\n**Our Return & Refund Policy:**\n• Opened packs cannot be returned (food safety regulations).\n• Damaged, incorrect, or missing items — **We WILL fix it!**\n\n📧 **Contact us:** BestLollyShop@gmail.com\nPlease include your **order number** and a photo if possible.\n\nYour satisfaction is our priority! 💪`;
  }
  if (lower.match(/contact|email|phone|support|help|talk to|speak to|human/)) {
    return `📞 **Contact Best Lolly Shop**\n\n📧 **Email:** BestLollyShop@gmail.com\n🌐 **Contact Form:** https://www.bestlollyshop.co.nz/contact\n\n⏱️ We reply within **24 hours** on business days.\n\nIs there anything else I can help you with? 😊`;
  }
  if (lower.match(/price|cost|how much|afford|budget/)) {
    return `💰 **Pricing & Best Value**\n\nPrices vary by bag size:\n• **100g** — Sample a new flavour\n• **250g** — Personal treat\n• **500g** — Perfect for sharing\n• **1kg** — **Best value!** Great for parties\n\n🎟️ Use **SWEET10** for **10% OFF**!\n🚚 Free shipping on orders **$50 NZD+**\n\nWant me to recommend the best value option? 🍬`;
  }
  if (lower.match(/track|order status|where is my order|when will|cancel|edit my order/)) {
    return `📦 **Order Help**\n\nOnce dispatched, you'll receive a **tracking email** with your tracking number.\n\n⏱️ Standard delivery: **3–5 business days** NZ-wide.\n\nFor order status, cancellations or edits — please contact us quickly:\n📧 **BestLollyShop@gmail.com** with your order number. 😊`;
  }
  if (lower.match(/account|login|password|sign in|sign up|register|forgot/)) {
    return `🔐 **Account & Login Help**\n\n**Forgot Password?**\n1. Go to the **Login page**\n2. Click **Forgot Password?**\n3. Enter your email → Check inbox for reset link\n\n**Can't sign in?** Check email, Caps Lock, try incognito mode.\n\nStill stuck? Email: **BestLollyShop@gmail.com** 📧`;
  }
  if (lower.match(/international|overseas|australia|uk|usa|worldwide/)) {
    return `🌏 **International Shipping**\n\nCurrently, we ship within **New Zealand only**.\n\nWe don't offer international shipping at this time.\n\nFor updates on international shipping, subscribe to our newsletter or contact us:\n📧 **BestLollyShop@gmail.com** 😊`;
  }
  return TRAINED_RESPONSES.default();
};

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const getInitialGreeting = () => {
    const clientHour = new Date().getHours();
    let timeGreeting = 'Hello';
    if (clientHour >= 5 && clientHour < 12) timeGreeting = 'Good morning';
    else if (clientHour >= 12 && clientHour < 17) timeGreeting = 'Good afternoon';
    else if (clientHour >= 17) timeGreeting = 'Good evening';
    return TRAINED_RESPONSES.greeting(timeGreeting);
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

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
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

    const clientHour = new Date().getHours();
    let timeGreeting = 'Good day';
    if (clientHour >= 5 && clientHour < 12) timeGreeting = 'Good morning';
    else if (clientHour >= 12 && clientHour < 17) timeGreeting = 'Good afternoon';
    else if (clientHour >= 17) timeGreeting = 'Good evening';

    try {
      const conversationHistory = [...messages, userMsg].slice(-12).map(m => ({
        role: m.sender === 'bot' ? 'assistant' : 'user',
        content: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          clientHour
        })
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply || getLocalFallback(trimmed, timeGreeting),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      // Rich local fallback when server is unreachable
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: getLocalFallback(trimmed, timeGreeting),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Each suggestion has a unique `query` that matches a specific trained response
  const suggestions = [
    { label: '🍬 Gummies & Sour',    query: 'Show me your best gummy lollies and sour sweets' },
    { label: '🍫 Chocolates',        query: 'What are your top chocolate products I should try?' },
    { label: '🎉 Party & Events',    query: 'I need candy for a birthday party event and gifts' },
    { label: '🚚 Shipping Info',     query: 'Tell me about your shipping and delivery options' },
    { label: '🎟️ Discounts',        query: 'Do you have any discount codes or special deals?' },
    { label: '🌿 Dietary Options',   query: 'Do you have vegan gluten-free or halal lolly options?' },
    { label: '📦 Bulk Orders',       query: 'I want to buy bulk candy for a large group or event' },
    { label: '🍭 Recommend Me',      query: 'Help me choose the best sweets I am not sure what to get' },
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
                <h3>Best Lolly Shop Assistant 🍭</h3>
                <span className="bot-status">
                  <span className="status-dot"></span>
                  Online — here to help! ✨
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
            🔐 Best Lolly Shop · BestLollyShop.co.nz
          </div>
        </div>
      )}
    </div>
  );
};
