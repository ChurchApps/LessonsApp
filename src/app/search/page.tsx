import { Metadata } from "next";
import { Box, Container, Typography } from "@mui/material";
import { Layout } from "@/components/Layout";
import { SearchResults } from "./SearchResults";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { q } = await props.searchParams;
  const query = q || "";

  return {
    title: query ? `Search: ${query} | Lessons.church` : "Search | Lessons.church",
    description: query ? `Search results for "${query}" - Find free church curriculum at Lessons.church` : "Search for free church curriculum at Lessons.church"
  };
}

export default async function SearchPage(props: Props) {
  const { q } = await props.searchParams;
  const query = q || "";

  return (
    <Layout>
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {query ? (
            <>
              Search results for &quot;<strong>{query}</strong>&quot;
            </>
          ) : (
            "Search Curriculum"
          )}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <SearchResults initialQuery={query} />
        </Box>
      </Container>
    </Layout>
  );
}
