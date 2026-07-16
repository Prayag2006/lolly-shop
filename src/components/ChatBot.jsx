import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Home } from 'lucide-react';
import './ChatBot.css';

// Render **bold** and line breaks in bot messages
const renderBotText = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, lineIdx, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={lineIdx}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return <span key={i}>{part}</span>;
        })}
        {lineIdx < arr.length - 1 && <br />}
      </span>
    );
  });
};

// ── LOCAL TRAINED RESPONSES ───────────────────────────────────────
const TRAINED_RESPONSES = {
  greeting: (timeGreeting) =>
    `${timeGreeting}! 🍭\n\nWelcome to **Best Lolly Shop** — your home for premium New Zealand sweets!\n\n🚚 **FREE shipping** on NZ orders over **$50 NZD!**\n🏙️ **Hamilton** customers get FREE delivery on every order!\n\nHow can I help you today?`,

  gummies: () =>
    `🍬 **Our Best-Selling Gummies & Chewy Sweets!**\n\n` +
    `⭐ **Sour Neon Worms** — Tangy rainbow-coated gummy worms, absolutely irresistible!\n\n` +
    `⭐ **Mayceys Sour Peaches** — The gold standard of sour candy in NZ. Intensely sour, then sweet!\n\n` +
    `⭐ **Pascall Jet Planes** — A Kiwi classic! Firm chewy candy in fun aeroplane shapes.\n\n` +
    `⭐ **Trolli Sour Brite Crawlers** — Fruity & sour worms in bright neon colours.\n\n` +
    `🛍️ Available in **100g, 250g, 500g & 1kg** bags. The **1kg bag is the best value!**\n\nWould you like to mix & match, or are you looking for a specific flavour? 😋`,

  chocolates: () =>
    `🍫 **Our Top Chocolate Picks!**\n\n` +
    `⭐ **Premium Dark Truffles** — Luxurious Belgian ganache centres in rich dark chocolate.\n\n` +
    `⭐ **Cadbury Caramilk Bar** — Silky smooth golden caramel chocolate — impossibly moreish.\n\n` +
    `⭐ **Pascall Chocolate Fish** — A New Zealand icon! Marshmallow coated in creamy milk chocolate.\n\n` +
    `⭐ **Whittaker's Peanut Butter Cups** — Velvety chocolate shell with peanut butter filling.\n\n` +
    `⭐ **Cadbury Roses Selection Box** — Gorgeous assorted chocolates, ideal for gifts & events.\n\n` +
    `🎁 All chocolates available as **gift boxes** with custom wrapping!\n\nDark, milk, or white chocolate preference? 🍫`,

  party: () =>
    `🎉 **Party & Event Candy Solutions!**\n\n` +
    `We LOVE helping make your events extra special!\n\n` +
    `🎂 **Birthday Parties** — Custom pick-and-mix bulk bags, lolly bags for every guest!\n` +
    `👶 **Baby Showers** — Pastel sweets, personalised lolly favours in matching themes.\n` +
    `💒 **Weddings & Engagements** — Elegant candy buffets, personalised lollies with your names & date.\n` +
    `🏢 **Corporate Events** — Logo-printed candy, branded confectionery, bulk promotional packs.\n\n` +
    `📦 **Bulk Bags:** 100g, 250g, 500g & 1kg options available.\n` +
    `🎨 **Custom Printing:** We print logos & messages on lollies and packaging!\n\n` +
    `How many guests are you expecting, and what's your budget? I'll tailor the perfect sweet package! 🎁`,

  shipping: () =>
    `🚚 **Shipping & Delivery Information**\n\n` +
    `🏙️ **Hamilton, NZ** — **FREE delivery** automatically applied at checkout!\n\n` +
    `🇳🇿 **Rest of New Zealand:**\n` +
    `✅ Orders **over $50 NZD** → **FREE express shipping!**\n` +
    `📦 Orders **under $50 NZD** → Flat rate of **$5 NZD**\n\n` +
    `⏱️ **Delivery Time:** 3–5 business days (NZ-wide)\n` +
    `📍 We currently ship within **New Zealand only**\n\n` +
    `📦 **Order Tracking:** Once dispatched, you'll receive an email with your tracking number.\n\n` +
    `💡 **Tip:** Add more items to hit $50 and get FREE shipping! 😊`,

  dietary: () =>
    `🌿 **Dietary & Allergy Options**\n\n` +
    `We have delicious options for everyone!\n\n` +
    `✅ **Gluten-Free:** Many lollies are naturally gluten-free. Check the dietary badge on each product page.\n\n` +
    `✅ **Gelatin-Free / Vegan-Friendly:**\n` +
    `• **Mayceys Sour Peaches** — Gelatin-free & vegan!\n` +
    `• **Spaceman Candy Sticks** — Gelatin-free & vegan!\n` +
    `• **Sour Rainbow Belts** — No gelatin, great for vegans.\n\n` +
    `✅ **Nut-Free Options:** Many gummy sweets are produced in nut-free facilities.\n\n` +
    `⚠️ **Allergen Info:** Full ingredient lists are listed on every product page.\n\n` +
    `Have a specific dietary need? Tell me and I'll point you to the right products! 💚`,

  bulk: () =>
    `📦 **Bulk Candy Orders**\n\nWe LOVE bulk orders!\n\n🛍️ **Bag Sizes:**\n• **100g** — Perfect for trying new flavours\n• **250g** — Great personal treat\n• **500g** — Ideal for sharing / small events\n• **1kg** — **Best value!** Recommended for parties & large groups\n\n🎨 **Custom Printing:** Add your logo or message to lollies & packaging!\n🎁 **Gift Boxes:** Custom-wrapped candy boxes available.\n\n📧 For large or custom bulk orders, email: **BestLollyShop@gmail.com**\n\nHow many people are you shopping for? 😊`,

  payment: () =>
    `💳 **Payment Methods Accepted**\n\nWe support a wide range of payment options:\n\n✅ Credit Card (Visa, Mastercard)\n✅ Debit Card\n✅ Google Pay\n✅ Apple Pay\n✅ Shop Pay\n✅ PayPal\n✅ Bank Transfer\n\nAll transactions are **100% secure** and encrypted. 🔐\n\nReady to complete your order? Head to the **Checkout** page! 🛒`,

  recommend: () =>
    `🍭 I'd love to recommend the perfect sweets for you!\n\nTo help me find the best match, could you tell me:\n\n1️⃣ **What's the occasion?** (personal treat, gift, birthday, party, wedding, corporate)\n2️⃣ **How many people** are you buying for?\n3️⃣ **Flavour preference?** (sour, sweet, chocolate, fruity, caramel, mixed)\n4️⃣ **Any dietary needs?** (vegan, gluten-free, halal, nut-free)\n5️⃣ **Budget?** (rough guide helps me find the best value!)\n\nOnce I know, I'll pick the perfect sweets! 😊`,

  default: () =>
    `🍭 I'm here to help! Could you tell me a bit more about what you're looking for?\n\nFor example:\n• A specific flavour or product type?\n• Shopping for a special occasion?\n• Need help with an order or account?\n\nOr tap one of the menu options below! 😊`,
};

const getLocalFallback = (query, timeGreeting) => {
  const lower = String(query || '').toLowerCase();
  if (lower.match(/hello|\bhi\b|\bhey\b|howdy|good morning|good afternoon|good evening|\byo\b/)) return TRAINED_RESPONSES.greeting(timeGreeting);
  if (lower.match(/bye|goodbye|see you|cheers|thanks|thank you/)) return `Thank you for visiting **Best Lolly Shop**! 🍭 Have a wonderfully sweet day!\n\nCome back anytime — we're always here to help! 😊`;
  if (lower.match(/gumm|worm|peach|sour|jet plane|chew|jelly|lolly|lollies|gummy|fruity|neon/)) return TRAINED_RESPONSES.gummies();
  if (lower.match(/choc|truffle|caramel|caramilk|chocolate fish|cadbury|whittaker|cocoa/)) return TRAINED_RESPONSES.chocolates();
  if (lower.match(/party|kid|pick.and.mix|gift box|wedding|birthday|baby shower|corporate|christmas|easter|halloween|valentin|event|favour|favor|school|movie night/)) return TRAINED_RESPONSES.party();
  if (lower.match(/ship|deliver|postage|freight|dispatch|arrival|courier/)) return TRAINED_RESPONSES.shipping();
  if (lower.match(/discount|coupon|promo|code|sale|offer|deal|saving/)) return `🎟️ **Current Deals & Savings!**\n\n🚚 **Free Shipping** — Spend **$50 NZD+** and shipping is FREE automatically!\n🏙️ **Hamilton** — Always FREE delivery, no minimum spend!\n\n🛍️ **Best Value Tip:** The bigger the bag, the better the value — the 1kg is our best deal! 🍬\n\n📧 **Newsletter Subscribers** get exclusive early access to sales and new arrivals!`;
  if (lower.match(/vegan|vegetarian|halal|gelatin|gluten|allerg|dietary|nut.free|dairy.free|ingredient|sugar.free/)) return TRAINED_RESPONSES.dietary();
  if (lower.match(/bulk|wholesale|large order|big order|how many|quantity|100g|250g|500g|1kg/)) return TRAINED_RESPONSES.bulk();
  if (lower.match(/pay|payment|credit card|debit|paypal|apple pay|google pay|shop pay|bank transfer/)) return TRAINED_RESPONSES.payment();
  if (lower.match(/best|popular|top|recommend|favourite|favorite|trending|what should|help me choose|suggest|not sure|don.t know/)) return TRAINED_RESPONSES.recommend();
  if (lower.match(/return|refund|damaged|wrong order|complaint|broken|missing|incorrect/)) return `😟 I'm sorry to hear that! We want every order to be perfect.\n\n**Our Return & Refund Policy:**\n• Opened packs cannot be returned (food safety regulations).\n• Damaged, incorrect, or missing items — **We WILL fix it!**\n\n📧 **Contact us:** BestLollyShop@gmail.com\nPlease include your **order number** and a photo if possible.\n\nYour satisfaction is our priority! 💪`;
  if (lower.match(/contact|email|phone|support|help|talk to|speak to|human/)) return `📞 **Contact Best Lolly Shop**\n\n📧 **Email:** BestLollyShop@gmail.com\n🌐 **Contact Form:** /contact\n\n⏱️ We reply within **24 hours** on business days.\n\nIs there anything else I can help you with? 😊`;
  if (lower.match(/price|cost|how much|afford|budget/)) return `💰 **Pricing & Best Value**\n\nPrices vary by bag size:\n• **100g** — Sample a new flavour\n• **250g** — Personal treat\n• **500g** — Perfect for sharing\n• **1kg** — **Best value!** Great for parties\n\n🚚 Free shipping on orders **$50 NZD+**\n\nWant me to recommend the best value option for your needs? 🍬`;
  if (lower.match(/track|order status|where is my order|when will|cancel|edit my order/)) return `📦 **Order Help**\n\nOnce dispatched, you'll receive a **tracking email** with your tracking number.\n\n⏱️ Standard delivery: **3–5 business days** NZ-wide.\n\nFor order status, cancellations or edits — please contact us quickly:\n📧 **BestLollyShop@gmail.com** with your order number. 😊`;
  if (lower.match(/account|login|password|sign in|sign up|register|forgot/)) return `🔐 **Account & Login Help**\n\n**Forgot Password?**\n1. Go to the **Login page**\n2. Click **Forgot Password?**\n3. Enter your email → Check inbox for reset link\n\n**Can't sign in?** Check email, Caps Lock, try incognito mode.\n\nStill stuck? Email: **BestLollyShop@gmail.com** 📧`;
  if (lower.match(/international|overseas|australia|uk|usa|worldwide/)) return `🌏 **International Shipping**\n\nCurrently, we ship within **New Zealand only**.\n\nWe don't offer international shipping at this time.\n\nFor updates, subscribe to our newsletter or contact us:\n📧 **BestLollyShop@gmail.com** 😊`;
  return TRAINED_RESPONSES.default();
};

// ── MENU STRUCTURE (Dyson-style) ──────────────────────────────────
const MAIN_MENU_ITEMS = [
  { id: 'products',  icon: '🍬', label: 'Products & Flavours', hasSub: true },
  { id: 'shipping',  icon: '🚚', label: 'Shipping & Delivery',  query: 'Tell me about your shipping and delivery options' },
  { id: 'events',    icon: '🎉', label: 'Events & Bulk Orders', query: 'I need candy for events and bulk orders' },
  { id: 'orders',    icon: '📦', label: 'Order Help',           hasSub: true },
  { id: 'dietary',   icon: '🌿', label: 'Dietary Options',      query: 'What vegan gluten-free halal dietary options do you have?' },
  { id: 'recommend', icon: '🍭', label: 'Help Me Choose',       query: 'Help me choose the best sweets I am not sure what to get' },
  { id: 'payment',   icon: '💳', label: 'Payments',             query: 'What payment methods do you accept?' },
  { id: 'contact',   icon: '💬', label: 'Talk to Us',           isContact: true },
];

const SUB_MENUS = {
  products: {
    prompt: '🍬 What are you looking for?',
    items: [
      { label: '🍬 Gummies & Sour',  query: 'Show me your best gummy lollies and sour sweets' },
      { label: '🍫 Chocolates',       query: 'What are your top chocolate products I should try?' },
      { label: '🎉 Party Candy',      query: 'I need candy for a birthday party event and gifts' },
      { label: '🏆 Best Sellers',     query: 'What are your most popular best selling lollies?' },
    ],
  },
  orders: {
    prompt: '📦 What do you need help with?',
    items: [
      { label: '📍 Track My Order',       query: 'How do I track my order or check its status?' },
      { label: '↩️ Returns & Refunds',    query: 'What is your returns and refund policy for damaged or wrong orders?' },
      { label: '✏️ Edit or Cancel Order', query: 'Can I cancel or edit my order after placing it?' },
      { label: '🔐 Account & Login',      query: 'I need help with my account login or forgot password' },
    ],
  },
};

// ── COMPONENT ─────────────────────────────────────────────────────
export const ChatBot = () => {
  const [isOpen, setIsOpen]         = useState(false);
  const [hasStarted, setHasStarted] = useState(false);   // true once user interacts
  const [isTyping, setIsTyping]     = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5  && h < 12) return 'Good morning';
    if (h >= 12 && h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const makeWelcomeMessages = () => [
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      text: TRAINED_RESPONSES.greeting(getTimeGreeting()),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: 2,
      sender: 'bot',
      type: 'menu',
      items: MAIN_MENU_ITEMS,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const [messages, setMessages] = useState(makeWelcomeMessages);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  // ── Helpers ──────────────────────────────────────────────────────
  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const appendMessages = (...newMsgs) =>
    setMessages(prev => [...prev, ...newMsgs]);

  const goToMainMenu = () => {
    appendMessages(
      { id: Date.now(),     sender: 'bot', type: 'text', text: 'Is there anything else I can help you with? 😊', time: now() },
      { id: Date.now() + 1, sender: 'bot', type: 'menu', items: MAIN_MENU_ITEMS, time: now() },
    );
  };

  // ── Bot query (calls API or local fallback) ───────────────────────
  const sendBotQuery = async (query) => {
    setIsTyping(true);
    const timeGreeting = getTimeGreeting();

    try {
      // Exclude navigation bubbles (isNav) and the initial welcome greeting (id===1)
      // so Gemini only sees real Q&A exchanges — not UI navigation clicks.
      const conversationHistory = messages
        .filter(m => m.type === 'text' && !m.isNav && m.id !== 1)
        .slice(-8)
        .map(m => ({ role: m.sender === 'bot' ? 'assistant' : 'user', content: m.text || '' }));
      conversationHistory.push({ role: 'user', content: query });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory, clientHour: new Date().getHours() }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      appendMessages(
        { id: Date.now() + 1, sender: 'bot', type: 'text',        text: data.reply || getLocalFallback(query, timeGreeting), time: now() },
        { id: Date.now() + 2, sender: 'bot', type: 'post-answer', time: now() },
      );
    } catch {
      appendMessages(
        { id: Date.now() + 1, sender: 'bot', type: 'text',        text: getLocalFallback(query, timeGreeting), time: now() },
        { id: Date.now() + 2, sender: 'bot', type: 'post-answer', time: now() },
      );
    } finally {
      setIsTyping(false);
    }
  };

  // ── Menu interactions ─────────────────────────────────────────────
  const handleMenuClick = (item) => {
    if (isTyping) return;
    setHasStarted(true);

    // isNav: true — menu-navigation clicks should not be sent to the AI as real user questions
    const userBubble = { id: Date.now(), sender: 'user', type: 'text', isNav: true, text: `${item.icon} ${item.label}`, time: now() };

    if (item.isContact) {
      appendMessages(
        userBubble,
        { id: Date.now() + 1, sender: 'bot', type: 'contact', time: now() },
      );
      return;
    }

    if (item.hasSub && SUB_MENUS[item.id]) {
      const sub = SUB_MENUS[item.id];
      appendMessages(
        userBubble,
        { id: Date.now() + 1, sender: 'bot', type: 'text', isNav: true, text: sub.prompt, time: now() },
        { id: Date.now() + 2, sender: 'bot', type: 'submenu', items: sub.items, time: now() },
      );
      return;
    }

    if (item.query) {
      appendMessages(userBubble);
      sendBotQuery(item.query);
    }
  };

  const handleSubMenuClick = (subItem) => {
    if (isTyping) return;
    // isNav: true — sub-menu label click is UI navigation, not a freeform user question
    appendMessages({ id: Date.now(), sender: 'user', type: 'text', isNav: true, text: subItem.label, time: now() });
    sendBotQuery(subItem.query);
  };

  const handleContactClick = () => {
    if (isTyping) return;
    setHasStarted(true);
    appendMessages(
      { id: Date.now(),     sender: 'user', type: 'text',    text: '💬 Talk to Us', time: now() },
      { id: Date.now() + 1, sender: 'bot',  type: 'contact', time: now() },
    );
  };

  // ── Free-text input ───────────────────────────────────────────────
  const handleSendMessage = async (textToSend) => {
    const trimmed = String(textToSend || '').trim();
    if (!trimmed) return;
    setHasStarted(true);
    setInputValue('');
    const timeGreeting = getTimeGreeting();

    const userBubble = { id: Date.now(), sender: 'user', type: 'text', text: trimmed, time: now() };
    appendMessages(userBubble);
    setIsTyping(true);

    try {
      // Same filter as sendBotQuery — exclude nav messages and initial greeting
      const conversationHistory = [...messages, userBubble]
        .filter(m => m.type === 'text' && !m.isNav && m.id !== 1)
        .slice(-8)
        .map(m => ({ role: m.sender === 'bot' ? 'assistant' : 'user', content: m.text || '' }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory, clientHour: new Date().getHours() }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      appendMessages(
        { id: Date.now() + 1, sender: 'bot', type: 'text',        text: data.reply || getLocalFallback(trimmed, timeGreeting), time: now() },
        { id: Date.now() + 2, sender: 'bot', type: 'post-answer', time: now() },
      );
    } catch {
      appendMessages(
        { id: Date.now() + 1, sender: 'bot', type: 'text',        text: getLocalFallback(trimmed, timeGreeting), time: now() },
        { id: Date.now() + 2, sender: 'bot', type: 'post-answer', time: now() },
      );
    } finally {
      setIsTyping(false);
    }
  };

  // ── Render individual message ─────────────────────────────────────
  const renderMessage = (msg) => {
    switch (msg.type) {

      // Main menu grid
      case 'menu':
        return (
          <div key={msg.id} className="chatbot-menu-grid">
            {msg.items.map(item => (
              <button
                key={item.id}
                className={`menu-card${item.isContact ? ' menu-card--contact' : ''}`}
                onClick={() => handleMenuClick(item)}
                disabled={isTyping}
              >
                <span className="menu-card-icon">{item.icon}</span>
                <span className="menu-card-label">{item.label}</span>
              </button>
            ))}
          </div>
        );

      // Sub-menu list
      case 'submenu':
        return (
          <div key={msg.id} className="chatbot-submenu-list">
            {msg.items.map((item, i) => (
              <button
                key={i}
                className="submenu-item"
                onClick={() => handleSubMenuClick(item)}
                disabled={isTyping}
              >
                <span>{item.label}</span>
                <span className="submenu-arrow">›</span>
              </button>
            ))}
            <button className="submenu-back-btn" onClick={goToMainMenu} disabled={isTyping}>
              ← Back to Main Menu
            </button>
          </div>
        );

      // Post-answer quick actions
      case 'post-answer':
        return (
          <div key={msg.id} className="post-answer-actions">
            <button className="post-action-btn post-action-menu" onClick={goToMainMenu} disabled={isTyping}>
              <Home size={12} /> Main Menu
            </button>
            <button className="post-action-btn post-action-contact" onClick={handleContactClick} disabled={isTyping}>
              💬 Talk to Us
            </button>
          </div>
        );

      // Contact card
      case 'contact':
        return (
          <div key={msg.id} className="message-bubble-wrapper msg-bot">
            <div className="msg-bot-icon">🍭</div>
            <div className="message-bubble contact-bubble">
              <p>
                {renderBotText(
                  `💬 **Talk to a Lolly Expert!**\n\nOur friendly team is ready to help you:\n\n📧 **Email:** BestLollyShop@gmail.com\n🌐 **Contact Form:** /contact\n\n⏱️ We reply within **24 hours** on business days.\n\nFor urgent help, use our contact form and we'll get back to you as soon as possible!`
                )}
              </p>
              <div className="contact-actions">
                <a href="mailto:BestLollyShop@gmail.com" className="contact-action-btn">📧 Email Us</a>
                <a href="/contact" className="contact-action-btn contact-action-btn--secondary">📝 Contact Form</a>
              </div>
              <span className="msg-time">{msg.time}</span>
            </div>
          </div>
        );

      // Regular text bubble (bot or user)
      default:
        return (
          <div key={msg.id} className={`message-bubble-wrapper ${msg.sender === 'user' ? 'msg-user' : 'msg-bot'}`}>
            {msg.sender === 'bot' && <div className="msg-bot-icon">🍭</div>}
            <div className="message-bubble">
              <p>{msg.sender === 'bot' ? renderBotText(msg.text) : msg.text}</p>
              <span className="msg-time">{msg.time}</span>
            </div>
          </div>
        );
    }
  };

  // ── Render ────────────────────────────────────────────────────────
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

      {/* Chat Panel */}
      {isOpen && (
        <div className="chatbot-panel" role="dialog" aria-label="Best Lolly Shop AI Assistant">

          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div className="bot-avatar">
                <span className="bot-avatar-emoji">🍭</span>
                <span className="bot-avatar-pulse" />
              </div>
              <div>
                <h3>Lolly Shop Assistant 🍭</h3>
                <span className="bot-status">
                  <span className="status-dot" />
                  Online — here to help! ✨
                </span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              {hasStarted && (
                <button className="header-icon-btn" onClick={goToMainMenu} title="Back to main menu" disabled={isTyping}>
                  <Home size={15} />
                </button>
              )}
              <button className="header-icon-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages" id="chatbot-messages-area">
            {messages.map(msg => renderMessage(msg))}

            {isTyping && (
              <div className="message-bubble-wrapper msg-bot">
                <div className="msg-bot-icon">🍭</div>
                <div className="message-bubble typing-bubble">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>


        </div>
      )}
    </div>
  );
};
