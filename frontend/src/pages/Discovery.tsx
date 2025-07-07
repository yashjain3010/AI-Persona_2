import React, { useState, useMemo } from "react";
import { Container, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/discover/Header";
import SearchBar from "../components/discover/SearchBar";
import FilterChips from "../components/discover/FilterChips";
import PersonaGrid from "../components/PersonaGrid";
import Pagination from "../components/Pagination";
import { mockPersonas, mockFilters } from "../data/mockData";
import type { Persona, FilterOption } from "../types";

interface DiscoveryProps {
  onStartChat: (persona: Persona) => void;
}

const SEARCH_AREA_WIDTH = { xs: "100%", sm: 900, md: 1100, lg: 1200 };

// Define department order for consistent sorting
const DEPARTMENT_ORDER = ["Tech", "Marketing", "Sales"];

const Discovery: React.FC<DiscoveryProps> = ({ onStartChat }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize filters with all set to inactive (false) so "All" appears selected
  const [filters, setFilters] = useState<FilterOption[]>(
    mockFilters.map((filter) => ({
      ...filter,
      active: false, // Set all filters to inactive by default
    }))
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Get currently selected departments
  const selectedDepartments = useMemo(() => {
    return filters.filter((f) => f.active).map((f) => f.value);
  }, [filters]);

  // Enhanced filter and sort logic
  const filteredAndSortedPersonas = useMemo(() => {
    let filtered = mockPersonas;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (persona) =>
          persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          persona.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply department filters - only filter if specific departments are selected
    // If no departments are selected (All is selected), show all personas
    if (selectedDepartments.length > 0) {
      filtered = filtered.filter((persona) =>
        selectedDepartments.includes(persona.department)
      );
    }

    // Sort by department order, then by name
    const sorted = [...filtered].sort((a, b) => {
      const aDeptIndex = DEPARTMENT_ORDER.indexOf(a.department);
      const bDeptIndex = DEPARTMENT_ORDER.indexOf(b.department);

      if (aDeptIndex !== bDeptIndex) {
        return aDeptIndex - bDeptIndex;
      }
      return a.name.localeCompare(b.name);
    });

    return sorted;
  }, [searchTerm, selectedDepartments]);

  // Pagination logic
  const totalPersonas = filteredAndSortedPersonas.length;
  const totalPages = Math.ceil(totalPersonas / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPersonas = filteredAndSortedPersonas.slice(
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

  // Handle view persona navigation
  const handleViewPersona = (persona: Persona) => {
    navigate(`/view-persona/${persona.id}`);
  };

  // Check if "All" is selected (no specific departments selected)
  const isAllSelected = selectedDepartments.length === 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        overflowX: "hidden",
        position: "relative",
      }}
    >
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
        {/* Search Section */}
        <Box
          sx={{
            width: "100%",
            maxWidth: SEARCH_AREA_WIDTH,
            mb: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              maxWidth="100%"
              fullWidth={true}
            />
          </Box>
        </Box>

        {/* Enhanced Filter Chips */}
        <Box
          sx={{
            width: "100%",
            maxWidth: SEARCH_AREA_WIDTH,
            mb: 3,
          }}
        >
          <FilterChips
            filters={filters}
            onFilterChange={handleFilterChange}
            showSelectedIndicator={true}
            showClearAll={true}
            title="Filter by Department"
          />
        </Box>

        {/* Results Summary with better messaging */}
        <Box
          sx={{
            width: "100%",
            maxWidth: SEARCH_AREA_WIDTH,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        ></Box>

        {/* Personas Grid */}
        <Box
          sx={{
            width: "100%",
            maxWidth: SEARCH_AREA_WIDTH,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {totalPersonas > 0 ? (
            <PersonaGrid
              personas={paginatedPersonas}
              onStartChat={onStartChat}
              onViewPersona={handleViewPersona}
            />
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 2,
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#666",
                  mb: 1,
                }}
              >
                No personas found
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#999",
                }}
              >
                Try adjusting your search or filters
              </Typography>
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { xs: 3, sm: 4 },
              mb: { xs: 2, sm: 3 },
            }}
          >
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
