import React from "react";
import { Box, Chip, IconButton, Menu, MenuItem } from "@mui/material";
import { FilterList as FilterIcon } from "@mui/icons-material";
import type { FilterOption } from "../types";

interface FilterChipsProps {
  filters: FilterOption[];
  onFilterChange: (filterId: string) => void;
}

const menuOptions = [
  'Marketing',
  'Technology',
  'Sales',
];

const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onFilterChange,
}) => {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={{ mb: { xs: 2, sm: 3 }, width: '100%' }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          flexWrap: "wrap",
        }}
      >
        {/* Filter Chips */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1 },
            flexWrap: "wrap",
            justifyContent: { xs: "flex-start", sm: "flex-start" },
            width: { xs: "auto", sm: "auto" },
            flex: 1,
          }}
        >
          {filters.map((filter) => (
            <Chip
              key={filter.value}
              label={filter.label}
              onClick={() => onFilterChange(filter.value)}
              variant={filter.active ? "filled" : "outlined"}
              sx={{
                backgroundColor: "#E8F2ED",
                color: "#000",
                borderColor: filter.active ? "#2e7d32" : "#e0e0e0",
                fontWeight: 500,
                borderRadius: 2,
                fontSize: { xs: "13px", sm: "14px" },
                height: { xs: 32, sm: 36 },
                "&:hover": {
                  backgroundColor: "#d4e8d4",
                  borderColor: "#2e7d32",
                },
                "& .MuiChip-label": {
                  px: { xs: 1, sm: 1.5 },
                },
              }}
            />
          ))}
        </Box>
        {/* Filter Icon on the right */}
        <IconButton
          sx={{
            color: "#2e7d32",
            ml: { xs: 0.5, sm: 1 },
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
            width: { xs: 40, sm: 36 },
            height: { xs: 40, sm: 36 },
          }}
          onClick={handleMenuClick}
          aria-controls={open ? 'filter-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <FilterIcon sx={{ fontSize: { xs: 22, sm: 20 } }} />
        </IconButton>
        {/* Filter menu (dropdown) */}
        <Menu
          id="filter-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 70,
              maxWidth: 70,
              borderRadius: 3,
              boxShadow: '0 4px 24px rgba(44,62,80,0.13)',
              maxHeight: 320,
              overflowY: 'auto',
              p: 0.2,
            },
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {menuOptions.map((option, idx) => (
            <MenuItem
              key={idx}
              onClick={handleMenuClose}
              sx={{
                fontSize: 12,
                py: 0.25,
                px: 0.5,
                borderRadius: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 60,
                minWidth: 0,
                textAlign: 'center',
              }}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default FilterChips;
