import React from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ViewPersonaHeaderProps {
  avatar: string;
  name: string;
  role: string;
  onStartChat: () => void;
}

const ViewPersonaHeader: React.FC<ViewPersonaHeaderProps> = ({ avatar, name, role, onStartChat }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: { xs: 'flex-start', sm: 'center' },
      gap: 4,
      mb: 1,
      mt: -1.5,
      flexWrap: { xs: 'wrap', sm: 'nowrap' },
    }}
  >
    <Avatar src={avatar} sx={{ width: 96, height: 96, mb: { xs: 0.5, sm: 0 }, mt: -0.5 }} />
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontWeight: 800, fontSize: 28, color: '#222', mb: 0.5 }}>{name}</Typography>
      <Typography sx={{ color: '#219653', fontWeight: 500, fontSize: 18, mb: 1 }}>{role}</Typography>
    </Box>
    <Box sx={{ flex: 1 }} />
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: { xs: 2, sm: 0 } }}>
      <Button
        variant="contained"
        sx={{ bgcolor: '#059134', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 2, px: 3, py: 0.7, minHeight: 36, boxShadow: 'none', textTransform: 'none', '&:hover': { bgcolor: '#047a2b' } }}
        onClick={onStartChat}
      >
        Start Chat
      </Button>
      <IconButton sx={{ ml: 1 }}>
        <MoreVertIcon sx={{ fontSize: 28, color: '#222' }} />
      </IconButton>
    </Box>
  </Box>
);

export default ViewPersonaHeader; 