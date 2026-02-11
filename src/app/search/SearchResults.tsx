"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, Chip, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { SearchBar } from "@/components/SearchBar";
import { SearchResult } from "@/helpers/SearchHelper";

interface Props {
  initialQuery: string;
}

export function SearchResults({ initialQuery }: Props) {
  const _router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTime, setSearchTime] = useState<number | null>(null);

  const query = searchParams.get("q") || initialQuery;

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=50`);
      const data = await response.json();

      if (data.error) {
        setError(data.message || data.error);
        setResults([]);
      } else {
        setResults(data.results || []);
        setSearchTime(data.elapsed);
      }
    } catch (_err) {
      setError("Failed to perform search. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  const getResultLink = (result: SearchResult) => {
    if (result.type === "program") {
      return `/${result.programSlug}`;
    }
    if (result.type === "lesson") {
      return `/${result.programSlug}/${result.studySlug}/${result.lessonSlug}`;
    }
    return `/${result.programSlug}/${result.studySlug}`;
  };

  return (
    <Box>
      {/* Search input */}
      <Box sx={{ mb: 4, maxWidth: 600 }}>
        <SearchBar placeholder="Search for topics, themes, age groups..." autoFocus={!query} />
      </Box>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Results */}
      {!loading && !error && results.length > 0 && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Found {results.length} result{results.length !== 1 ? "s" : ""}
            {searchTime !== null && ` in ${searchTime}ms`}
          </Typography>

          <Grid container spacing={3}>
            {results.map(result => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={result.id}>
                <Link href={getResultLink(result)} style={{ textDecoration: "none" }}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      backgroundColor: "#fff",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4
                      },
                      "& h2, & h6, & p, & .MuiTypography-root": {
                        color: "#333 !important",
                        textShadow: "none !important"
                      }
                    }}>
                    {result.image && (
                      <Box sx={{ position: "relative", width: "100%", paddingTop: "56.25%", backgroundColor: "grey.200", overflow: "hidden" }}>
                        <Image
                          src={result.image}
                          alt={result.name}
                          fill
                          style={{ objectFit: "cover", position: "absolute", top: 0, left: 0 }}
                        />
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Chip
                          label={result.type}
                          size="small"
                          color={result.type === "program" ? "primary" : result.type === "study" ? "secondary" : "info"}
                          sx={{ textTransform: "capitalize" }}
                        />
                        {result.age && <Chip label={result.age} size="small" variant="outlined" />}
                      </Stack>

                      <Typography variant="h6" component="h2" gutterBottom>
                        {result.name}
                      </Typography>

                      {result.type === "study" && result.programName && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                          {result.programName}
                        </Typography>
                      )}

                      {result.type === "lesson" && (result.studyName || result.programName) && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                          {result.studyName && result.programName ? `${result.programName} › ${result.studyName}` : result.studyName || result.programName}
                        </Typography>
                      )}

                      {result.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical"
                          }}>
                          {result.description.replace(/<[^>]*>/g, "")}
                        </Typography>
                      )}

                      {result.categories && (
                        <Box sx={{ mt: 1 }}>
                          {result.categories.split(", ").map(cat => (
                            <Chip key={cat} label={cat} size="small" variant="outlined" sx={{ mr: 0.5, mt: 0.5, fontSize: "0.7rem" }} />
                          ))}
                        </Box>
                      )}

                      {result.lessonCount !== undefined && result.lessonCount > 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                          {result.lessonCount} lesson
                          {result.lessonCount !== 1 ? "s" : ""}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* No results */}
      {!loading && !error && query && results.length === 0 && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" gutterBottom>
            No results found
          </Typography>
          <Typography color="text.secondary">Try different keywords or check your spelling.</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Semantic search understands concepts - try searching for themes like &quot;hope&quot;, &quot;family&quot;, or &quot;faith&quot;.
          </Typography>
        </Box>
      )}

      {/* Empty state */}
      {!loading && !error && !query && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" gutterBottom>
            Search for Curriculum
          </Typography>
          <Typography color="text.secondary">Enter a topic, theme, or keyword to find relevant curriculum.</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Our semantic search understands meaning - searching for &quot;peace&quot; will also find content about &quot;serenity&quot; and &quot;calm&quot;.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
