import { createContext, useContext, useState } from 'react';

const SupportChatContext = createContext();

export const SupportChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openSupportChat = () => setIsChatOpen(true);
  const closeSupportChat = () => setIsChatOpen(false);
  const toggleSupportChat = () => setIsChatOpen(prev => !prev);

  return (
    <SupportChatContext.Provider value={{
      isChatOpen,
      openSupportChat,
      closeSupportChat,
      toggleSupportChat
    }}>
      {children}
    </SupportChatContext.Provider>
  );
};

export const useSupportChat = () => {
  const context = useContext(SupportChatContext);
  if (!context) {
    throw new Error('useSupportChat must be used within a SupportChatProvider');
  }
  return context;
};
