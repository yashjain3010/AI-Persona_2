import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ChatHistoryTabs from "../components/chatHistory/ChatHistoryTabs";
import ChatHistoryList, { type Chat } from "../components/chatHistory/ChatHistoryList";

// Example mock chat data
const mockChats: Chat[] = [
  {
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Lee",
    message: "What features should we prioritize in the upcoming terminal update?",
    date: "10/10/2024",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    name: "Ethan Carter",
    message: "Can you benchmark MDR across different payment gateways?",
    date: "10/09/2024",
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Jessica Davis",
    message: "What's the impact of AI adoption on our core transaction infra?",
    date: "10/08/2024",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
    name: "Michael Brown",
    message: "How should we position the new merchant onboarding tool?",
    date: "10/07/2024",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/35.jpg",
    name: "Savy Chen",
    message: "How can we streamline operations across franchisee PoS rollouts?",
    date: "10/06/2024",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    name: "Devin jon",
    message: "Can you compare the pricing of Verifone vs Pine Labs vs MSwipe?",
    date: "10/05/2024",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
    name: "Michael Brown",
    message: "What competitor campaigns are resonating with Gen Z?",
    date: "10/04/2024",
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    name: "Marketing Budget Optimizer",
    message: "How can we optimize our marketing budget?",
    date: "10/03/2024",
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/46.jpg",
    name: "Digital Marketing Expert",
    message: "What are the latest trends in digital marketing?",
    date: "10/02/2024",
  },
];

const ChatHistoryPage: React.FC = () => {
  const [tab, setTab] = useState<'all' | 'archived'>('all');
  const [search, setSearch] = useState("");

  // Filter chats by search (simple case-insensitive match)
  const filteredChats = mockChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <Header />
      <Container sx={{ py: 4, maxWidth: 900 }}>
        <Box sx={{ width: '100%', mx: 'auto', mb: 2, px: 1 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search" fullWidth maxWidth={1200} />
        </Box>
        <Box sx={{ px: 1 }}>
          <ChatHistoryTabs tab={tab} onTabChange={setTab} />
        </Box>
        <ChatHistoryList chats={filteredChats} />
      </Container>
    </Box>
  );
};

export default ChatHistoryPage; 