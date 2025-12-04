"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Chip, CircularProgress, ClickAwayListener, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { SearchResult } from "@/helpers/SearchHelper";

interface Props {
  placeholder?: string;
  autoFocus?: boolean;
  fullWidth?: boolean;
  onSearch?: (query: string) => void;
  variant?: "outlined" | "filled" | "standard";
  size?: "small" | "medium";
  expandable?: boolean;
}

export function SearchBar({ placeholder = "Search curriculum (e.g., 'peace', 'advent', 'preschool')...", autoFocus = false, fullWidth = true, variant = "outlined", size = "medium", expandable = false }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
      const data = await response.json();
      if (data.results) {
        setResults(data.results);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(true);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    setShowDropdown(false);
    setQuery("");

    if (result.type === "program") {
      router.push(`/${result.programSlug}`);
    } else if (result.type === "lesson") {
      router.push(`/${result.programSlug}/${result.studySlug}/${result.lessonSlug}`);
    } else {
      router.push(`/${result.programSlug}/${result.studySlug}`);
    }
  };

  // Handle clear
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    if (expandable) {
      setExpanded(false);
    } else {
      inputRef.current?.focus();
    }
  };

  // Handle click away - collapse if expandable
  const handleClickAway = () => {
    setShowDropdown(false);
    if (expandable && !query) {
      setExpanded(false);
    }
  };

  // Handle expand
  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Expandable mode - show compact search bar when collapsed
  if (expandable && !expanded) {
    return (
      <Box
        onClick={handleExpand}
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderRadius: 2,
          px: 1.5,
          height: 40,
          cursor: "pointer",
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.25)"
          }
        }}>
        <SearchIcon sx={{ color: "inherit", mr: 1, fontSize: 20 }} />
        <Typography variant="body2" sx={{ color: "inherit", opacity: 0.9 }}>
          Search...
        </Typography>
      </Box>
    );
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        sx={{
          position: "relative",
          width: expandable ? 300 : fullWidth ? "100%" : "auto",
          transition: "width 0.2s ease-in-out",
          "& .MuiOutlinedInput-root": expandable ? { height: 40 } : {}
        }}>
        <form onSubmit={handleSubmit}>
          <TextField
            inputRef={inputRef}
            fullWidth
            variant={variant}
            size={size}
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
            onFocus={() => query && setShowDropdown(true)}
            autoFocus={autoFocus || expandable}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : query ? (
                      <IconButton size="small" onClick={handleClear}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ) : null}
                  </InputAdornment>
                )
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "white"
                },
                "&.Mui-focused": {
                  backgroundColor: "white"
                }
              }
            }}
          />
        </form>

        {/* Dropdown results */}
        {showDropdown && (query || results.length > 0) && (
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              mt: 0.5,
              maxHeight: 400,
              overflow: "auto",
              zIndex: 1300,
              borderRadius: 2,
              backgroundColor: "#fff",
              color: "#000",
              textShadow: "none",
              "& *": {
                textShadow: "none !important"
              },
              "& p, & span, & .MuiTypography-root": {
                color: "#333 !important",
                textShadow: "none !important"
              }
            }}>
            {results.length > 0 ? (
              <>
                <List dense>
                  {results.map(result => (
                    <ListItem
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "action.hover"
                        }
                      }}>
                      <ListItemAvatar sx={{ mr: 2 }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 45,
                            position: "relative",
                            borderRadius: 1,
                            overflow: "hidden",
                            backgroundColor: "grey.200"
                          }}>
                          {result.image ? (
                            <img
                              src={result.image}
                              alt={result.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "grey.500" }}>
                              {result.name?.charAt(0)}
                            </Box>
                          )}
                        </Box>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1
                            }}>
                            <Typography variant="body1" fontWeight="medium" color="text.primary">
                              {result.name}
                            </Typography>
                            <Chip label={result.type} size="small" variant="outlined" sx={{ fontSize: "0.65rem", height: 20 }} />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary" component="span" sx={{ textShadow: "none" }}>
                            {result.type === "study" && result.programName && <>{result.programName} • </>}
                            {result.age && <>{result.age} • </>}
                            {result.categories && <>{result.categories}</>}
                            {result.lessonCount ? ` • ${result.lessonCount} lessons` : ""}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Box
                  sx={{
                    p: 1,
                    borderTop: 1,
                    borderColor: "divider",
                    textAlign: "center"
                  }}>
                  <Typography variant="caption" color="primary" sx={{ cursor: "pointer" }} onClick={handleSubmit}>
                    View all results for &quot;{query}&quot;
                  </Typography>
                </Box>
              </>
            ) : loading ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <CircularProgress size={24} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Searching...
                </Typography>
              </Box>
            ) : query.length >= 2 ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No results found for &quot;{query}&quot;
                </Typography>
              </Box>
            ) : query.length > 0 ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Type at least 2 characters to search
                </Typography>
              </Box>
            ) : null}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
