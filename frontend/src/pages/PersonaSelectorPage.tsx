import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import PersonaSelectorHeader from "../components/personaSelector/PersonaSelectorHeader";
import SearchBar from "../components/SearchBar";
import PersonaSelectorGrid from "../components/personaSelector/PersonaSelectorGrid";
import { mockPersonas } from "../data/mockData";
import type { Persona } from "../types";
import { useNavigate } from "react-router-dom";
import ChatInputBar from "../components/ChatInputBar";

const PersonaSelectorPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filteredPersonas = mockPersonas
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.role.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 6); // Only show first six personas

  const handleSelect = (persona: Persona) => {
    navigate(`/chat/${persona.id}`);
  };

  const handleViewPersona = (persona: Persona) => {
    navigate(`/view-persona/${persona.id}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff", display: 'flex', flexDirection: 'column' }}>
      <Header />
      <PersonaSelectorHeader />
      <Box sx={{ width: '100%', maxWidth: 1300, mx: "auto", mb: 3 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search" maxWidth={840} fullWidth />
      </Box>
      <PersonaSelectorGrid personas={filteredPersonas} onSelect={handleSelect} onViewPersona={handleViewPersona} />
      <Box sx={{ height: 32 }} />
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', pb: 4, px: 3, mt: 6 }}>
        <ChatInputBar />
      </Box>
    </Box>
  );
};

export default PersonaSelectorPage; 