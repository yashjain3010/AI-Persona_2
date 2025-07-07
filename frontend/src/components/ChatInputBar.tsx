import React, { useRef } from "react";
import { Box, IconButton, Paper, InputBase } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import HistoryIcon from '@mui/icons-material/History';

const ChatInputBar: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {/* Mic button */}
      <IconButton
        sx={{
          width: 44,
          height: 44,
          minWidth: 44,
          minHeight: 44,
          borderRadius: '50%',
          backgroundColor: '#00875A',
          color: 'white',
          mr: 2,
          boxShadow: '0 2px 8px rgba(44,62,80,0.04)',
          '&:hover': { backgroundColor: '#1b5e20' },
        }}
      >
        <MicIcon />
      </IconButton>
      {/* Chat input bar */}
      <Paper
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: 1.3,
          borderRadius: 999,
          boxShadow: '0 2px 8px rgba(44,62,80,0.04)',
          bgcolor: '#F0F5F2',
          px: 2,
          py: 0.5,
        }}
        elevation={0}
      >
        {/* Upload/attachment icon */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <IconButton sx={{ color: '#9e9e9e', mr: 1 }} onClick={handleUploadClick}>
          <AttachFileIcon sx={{ fontSize: 22, transform: 'rotate(40deg)' }} />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: 16 }}
          placeholder="Send a message"
          inputProps={{ 'aria-label': 'send a message' }}
          disabled
        />
        {/* Clock icon in circular button */}
        <IconButton sx={{
          color: '#9e9e9e',
          mx: 1,
          p: 0,
        }}>
          <HistoryIcon sx={{ fontSize: 20 }} />
        </IconButton>
        {/* Circular send button */}
        <IconButton sx={{
          color: '#222',
          ml: 1,
          p: 0,
        }}>
          <SendRoundedIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatInputBar; 