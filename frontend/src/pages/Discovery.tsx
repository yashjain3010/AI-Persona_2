import React, { useState, useMemo } from "react";
import {
  Container,
  Box,
} from "@mui/material";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import FilterChips from "../components/FilterChips";
import PersonaGrid from "../components/PersonaGrid";
import Pagination from "../components/Pagination";
import { mockPersonas, mockFilters } from "../data/mockData";
import type { Persona, FilterOption } from "../types";

interface DiscoveryProps {
  onStartChat: (persona: Persona) => void;
}

const SEARCH_AREA_WIDTH = { xs: '100%', sm: 900, md: 1100, lg: 1200 };

const Discovery: React.FC<DiscoveryProps> = ({ onStartChat }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOption[]>(mockFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter logic
  const filteredPersonas = useMemo(() => {
    let filtered = mockPersonas;
    if (searchTerm) {
      filtered = filtered.filter(
        (persona) =>
          persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          persona.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    const activeFilters = filters.filter((f) => f.active).map((f) => f.value);
    if (activeFilters.length > 0) {
      filtered = filtered.filter((persona) =>
        activeFilters.includes(persona.department)
      );
    }
    return filtered;
  }, [searchTerm, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPersonas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPersonas = filteredPersonas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Event handlers
  const handleFilterChange = (filterId: string) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.value === filterId
          ? { ...filter, active: !filter.active }
          : filter
      )
    );
    setCurrentPage(1);
  };
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#ffffff", overflowX: "hidden", position: 'relative' }}>
      <Header />
      <Container
        maxWidth={false}
        sx={{
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 3, md: 4 },
          maxWidth: { xs: "100%", sm: "900px", md: "1200px", lg: "1200px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Search and Filter Section (aligned area) */}
        <Box sx={{ width: '100%', maxWidth: SEARCH_AREA_WIDTH, mb: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: "flex", justifyContent: "center", width: '100%' }}>
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              maxWidth="100%"
              fullWidth={true}
            />
          </Box>
          <Box sx={{ width: '100%', mt: { xs: 1, sm: 1 }, display: 'flex', justifyContent: 'flex-start' }}>
            <FilterChips filters={filters} onFilterChange={handleFilterChange} />
          </Box>
        </Box>
        {/* Personas Grid - aligned with search bar */}
        <Box sx={{ width: '100%', maxWidth: SEARCH_AREA_WIDTH, display: 'flex', justifyContent: 'flex-start' }}>
          <PersonaGrid
            personas={paginatedPersonas}
            onStartChat={onStartChat}
          />
        </Box>
        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 3, sm: 4 }, mb: { xs: 2, sm: 3 } }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Discovery;
