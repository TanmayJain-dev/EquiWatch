import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, ShieldCheck, Database, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { AIChatResponse } from '../types';

export const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; citations?: any[] }>>([
    {
      role: 'assistant',
      content: "Hello! I am your **EquiWatch AI Analyst**. I explain verified analytical signals and provide evidence-grounded decision support.\n\nHow can I help you analyze NovaWorks workforce data today?",
      citations: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "Why is Sales showing a review signal?",
    "Where is the largest workload difference?",
    "What should HR investigate first?",
    "Compare Sales and Finance",
    "Explain the difference between raw and controlled pay in Finance"
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: 'user' as const, content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatWithAnalyst({
        message: textToSend,
        history: messages,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.response,
          citations: res.cited_metrics,
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I encountered an issue fetching live statistics. Please try asking again or check department dashboards directly.",
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">EquiWatch AI Decision-Support Analyst</h2>
            <p className="text-[11px] text-slate-500 font-medium">Interprets verified numbers only • No data hallucinations • Privacy compliant</p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Analytics Grounded
        </span>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
              m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'
            }`}>
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`p-4 rounded-xl text-xs leading-relaxed ${
              m.role === 'user'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 text-slate-800 border border-slate-200 shadow-sm'
            }`}>
              <div className="whitespace-pre-wrap font-sans">
                {m.content}
              </div>

              {/* Citations Box */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                    <Database className="w-3 h-3 text-indigo-500" />
                    Verified Analytical Citations
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {m.citations.map((c, i) => (
                      <div key={i} className="p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-700">
                        <span className="font-semibold text-slate-900">{c.department} - {c.metric}:</span> {c.value}
                        <span className="block text-[10px] text-slate-400 mt-0.5">Source: {c.source}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></div>
              <span>Querying verified statistical models...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-6 py-2 border-t border-slate-100 bg-slate-50/70 overflow-x-auto flex items-center gap-2 whitespace-nowrap">
        <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" /> Suggestions:
        </span>
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-full px-3 py-1 transition-colors flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about workforce equity data, signals, or investigation recommendations..."
          className="flex-1 px-4 py-2.5 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
