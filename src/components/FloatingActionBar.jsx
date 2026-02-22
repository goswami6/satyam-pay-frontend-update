import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

const FloatingActionBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-8 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
              <h3 className="font-bold text-lg">Ask RAY</h3>
              <p className="text-sm text-blue-100">Our AI Assistant</p>
            </div>

            {/* Chat Body */}
            <div className="h-64 bg-gray-50 p-4 overflow-y-auto space-y-4">
              {/* Bot Message */}
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-xs text-sm text-gray-700">
                  Hello! 👋 I'm RAY, your AI assistant. How can I help you today?
                </div>
              </div>

              {/* Sample messages */}
              <div className="text-xs text-gray-500 text-center py-2">
                Suggested questions:
              </div>

              <div className="space-y-2">
                {[
                  'How to integrate payments?',
                  'Pricing details',
                  'Documentation',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left text-xs bg-white border border-gray-200 rounded-lg p-2 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    onClick={() => setMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && message.trim()) {
                      setMessage('');
                    }
                  }}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingActionBar;
