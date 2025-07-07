import React from "react";
import { Box } from "@mui/material";
import ChatHistoryItem from "./ChatHistoryItem";

export interface Chat {
  avatar: string;
  name: string;
  message: string;
  date: string;
}

interface ChatHistoryListProps {
  chats: Chat[];
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({ chats }) => (
  <Box ml={2}>
    {chats.map((chat, idx) => (
      <Box key={idx} sx={{ mb: 0.5 }}>
        <ChatHistoryItem {...chat} />
      </Box>
    ))}
  </Box>
);

export default ChatHistoryList; 