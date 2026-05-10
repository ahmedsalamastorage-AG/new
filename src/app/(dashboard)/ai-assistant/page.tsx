'use client';

import React, { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const QUICK_ACTIONS = [
  { label: '📊 Inventory Summary', prompt: 'Give me a summary of our current inventory status.' },
  { label: '✍️ Write Product Description', prompt: 'Write a professional product description for a Dell PowerEdge R740 refurbished server.' },
  { label: '📧 Draft Email to Customer', prompt: 'Draft a professional follow-up email to a customer who requested a quote for 10 Cisco switches.' },
  { label: '📈 Sales Strategy Ideas', prompt: 'Suggest marketing strategies for selling used datacenter equipment in Egypt.' },
  { label: '🌍 Market Research Egypt', prompt: 'What are the current trends in the used datacenter equipment market in Egypt and the Middle East?' },
  { label: '💡 Pricing Recommendation', prompt: 'How should I price a refurbished HP ProLiant DL380 Gen10 with 64GB RAM?' },
];

// Simple local AI simulation — in production, connect to OpenAI / Gemini API
function generateAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('inventory') || msg.includes('stock')) {
    return `📦 **Inventory Insights**\n\nBased on the Dr.IT system data, here are some recommendations:\n\n• **Review low-stock items** — Check servers and switches with quantity < 5 and consider restocking.\n• **Top movers** — Dell PowerEdge and Cisco Catalyst series tend to sell fastest.\n• **Slow inventory** — Items sitting for 90+ days should be discounted by 10-15%.\n\n💡 *Tip: Use the Inventory page to filter by category and condition for detailed views.*`;
  }
  
  if (msg.includes('product description') || msg.includes('write') && msg.includes('description')) {
    return `✍️ **Product Description**\n\n**Dell PowerEdge R740 — Enterprise-Grade Refurbished Server**\n\nUnlock enterprise performance at a fraction of the cost. This professionally refurbished Dell PowerEdge R740 delivers the reliability and processing power demanded by modern workloads.\n\n**Key Features:**\n• Dual Intel Xeon Scalable processors\n• Up to 3TB DDR4 memory capacity\n• 16x 2.5" SAS/SATA/NVMe drive bays\n• Redundant power supplies\n• iDRAC9 Enterprise remote management\n\n**Condition:** Fully tested, cleaned, and certified. 1-year warranty included.\n\n*Contact Dr.IT for bulk pricing and custom configurations.*`;
  }

  if (msg.includes('email') || msg.includes('draft') || msg.includes('follow')) {
    return `📧 **Draft Email**\n\n---\n\n**Subject:** Your Cisco Switch Quote — Ready for Review\n\nDear [Customer Name],\n\nThank you for your interest in our Cisco networking equipment. Following our recent conversation, I'm pleased to share the quotation for 10x Cisco Catalyst switches as discussed.\n\nPlease find the detailed quote attached. Key highlights:\n\n• **Competitive pricing** — 40% below new retail\n• **Full warranty** — 1-year comprehensive coverage\n• **Fast delivery** — Ships within 3 business days\n• **Technical support** — Free setup consultation included\n\nI'd be happy to answer any questions or adjust the configuration to better suit your needs.\n\nBest regards,\n**Dr.IT Team**\n\n---\n\n*Feel free to customize the customer name and specific model numbers before sending.*`;
  }

  if (msg.includes('strategy') || msg.includes('marketing')) {
    return `📈 **Marketing Strategy Recommendations for Dr.IT**\n\n**1. LinkedIn B2B Outreach**\n• Target IT managers and procurement teams at Egyptian companies\n• Share case studies of successful deployments\n\n**2. Facebook Marketplace & Groups**\n• Post in Egyptian IT buy/sell groups\n• Use bilingual content (Arabic + English)\n• Include professional product photos\n\n**3. Google Ads (Local)**\n• Target keywords: "used servers Egypt", "datacenter equipment Cairo"\n• Budget: Start with $200/month\n\n**4. Partnerships**\n• Partner with local system integrators\n• Offer reseller discounts for volume purchases\n\n**5. Content Marketing**\n• Blog posts: "Why Refurbished Servers Make Business Sense"\n• Video: Equipment testing & certification process\n\n💡 *Priority: Start with Facebook groups and LinkedIn — lowest cost, highest ROI for B2B equipment sales in Egypt.*`;
  }

  if (msg.includes('market') && (msg.includes('egypt') || msg.includes('middle east') || msg.includes('research'))) {
    return `🌍 **Egypt Datacenter Equipment Market Overview**\n\n**Market Size & Growth:**\n• Egypt's data center market is growing at ~12% CAGR\n• Government digitization initiatives are driving demand\n• New smart city projects (New Administrative Capital) creating opportunities\n\n**Key Trends:**\n• 📈 Rising demand for cloud infrastructure\n• 💰 Budget-conscious buyers prefer refurbished over new\n• 🏢 SMEs are the fastest-growing segment\n• 🌐 Regional hub potential — Egypt serves North Africa\n\n**Competitive Landscape:**\n• Few specialized used datacenter equipment dealers\n• Major opportunity to establish market leadership\n• Price sensitivity is high — 30-50% discount on new drives decisions\n\n**Recommendations for Dr.IT:**\n• Focus on Dell, HP, and Cisco — highest regional demand\n• Offer Arabic-language documentation and support\n• Build warranty/service reputation as key differentiator`;
  }

  if (msg.includes('price') || msg.includes('pricing')) {
    return `💰 **Pricing Recommendation**\n\n**HP ProLiant DL380 Gen10 — 64GB RAM**\n\nBased on current market conditions:\n\n| Condition | Suggested Price (USD) | Market Range |\n|-----------|----------------------|---------------|\n| Excellent | $1,800 - $2,200 | $1,500 - $2,500 |\n| Good | $1,400 - $1,800 | $1,200 - $2,000 |\n| Fair | $900 - $1,300 | $800 - $1,500 |\n\n**Factors to consider:**\n• CPU generation and core count\n• Storage included (SSDs vs HDDs)\n• Network cards and add-on features\n• Local market demand in Egypt\n• Bulk discount for 5+ units: 8-12% off\n\n💡 *Tip: Add a 1-year warranty to justify premium pricing. Customers pay 15-20% more for guaranteed equipment.*`;
  }

  return `🤖 **Dr.IT AI Assistant**\n\nI can help you with:\n\n• **Inventory** — Stock summaries, reorder suggestions\n• **Product descriptions** — Professional listings for your equipment\n• **Email drafts** — Customer communications and follow-ups\n• **Marketing strategies** — Ideas tailored to the Egyptian market\n• **Market research** — Trends and competitive analysis\n• **Pricing** — Recommendations based on market data\n\nTry asking me something specific, or use the quick actions below! 👇`;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 **Welcome to the Dr.IT AI Assistant!**\n\nI'm here to help you with:\n• Writing product descriptions & marketing content\n• Drafting customer emails\n• Sales and marketing strategy suggestions\n• Market research for Egypt & Middle East\n• Pricing recommendations\n\nHow can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text?: string) {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

    const aiResponse = generateAIResponse(messageText);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Simple markdown-like rendering for bold and line breaks
  function renderContent(content: string) {
    const parts = content.split('\n').map((line, i) => {
      // Bold
      const boldRendered = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic
      const italicRendered = boldRendered.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: italicRendered }} />
          {i < content.split('\n').length - 1 && <br />}
        </span>
      );
    });
    return parts;
  }

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="animate-fade-in">🤖 AI Assistant</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Your intelligent business companion for Dr.IT.</p>
        </div>
        <button
          onClick={() => setMessages([{
            id: '1',
            role: 'assistant',
            content: `👋 **Welcome to the Dr.IT AI Assistant!**\n\nI'm here to help you with:\n• Writing product descriptions & marketing content\n• Drafting customer emails\n• Sales and marketing strategy suggestions\n• Market research for Egypt & Middle East\n• Pricing recommendations\n\nHow can I help you today?`,
            timestamp: new Date(),
          }])}
          className="btn btn-secondary animate-fade-in"
        >
          🔄 New Chat
        </button>
      </header>

      {/* Quick Actions */}
      <section className="animate-fade-in" style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', animationDelay: '0.05s' }}>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => handleSend(action.prompt)}
            disabled={isTyping}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              cursor: isTyping ? 'not-allowed' : 'pointer',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s ease',
              opacity: isTyping ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isTyping) {
                (e.target as HTMLElement).style.backgroundColor = 'var(--border-color)';
                (e.target as HTMLElement).style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'var(--bg-tertiary)';
              (e.target as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            {action.label}
          </button>
        ))}
      </section>

      {/* Chat Area */}
      <section
        className="glass-panel animate-fade-in"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          animationDelay: '0.1s',
          minHeight: '500px',
        }}
      >
        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animationName: 'fadeIn',
                animationDuration: '0.3s',
                animationFillMode: 'forwards',
              }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  padding: '1rem 1.25rem',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  backgroundColor: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  boxShadow: msg.role === 'user'
                    ? '0 2px 12px var(--accent-glow)'
                    : '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {renderContent(msg.content)}
                <div style={{
                  fontSize: '0.7rem',
                  color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)',
                  marginTop: '0.5rem',
                  textAlign: 'right',
                }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '16px 16px 16px 4px',
                  backgroundColor: 'var(--bg-tertiary)',
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center',
                }}
              >
                <span className="typing-dot" style={{ animationDelay: '0s' }} />
                <span className="typing-dot" style={{ animationDelay: '0.15s' }} />
                <span className="typing-dot" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            padding: '1rem 1.5rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-end',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the AI assistant anything..."
            rows={1}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              resize: 'none',
              outline: 'none',
              minHeight: '44px',
              maxHeight: '120px',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.25rem',
              opacity: !input.trim() || isTyping ? 0.5 : 1,
              cursor: !input.trim() || isTyping ? 'not-allowed' : 'pointer',
              minWidth: '80px',
            }}
          >
            {isTyping ? '...' : 'Send ➤'}
          </button>
        </div>
      </section>

      {/* Inline styles for typing animation */}
      <style>{`
        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--text-muted);
          animation: typingBounce 1s ease-in-out infinite;
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
