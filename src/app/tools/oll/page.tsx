"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { FormatListBulleted as ListIcon } from "@mui/icons-material";
import { Box, Paper } from "@mui/material";
import { Wrapper } from "@/components/Wrapper";
import { PageHeader } from "@churchapps/apphelper";

const OllInner = dynamic(() => import("./components/OllInner"), { loading: () => <div>Loading lesson builder...</div> });

export default function CP() {
  return (
    <Wrapper>
      <Box sx={{ p: 0 }}>
        <PageHeader
          icon={<ListIcon />}
          title="Open Lesson List Builder"
          subtitle="Create and manage lesson curriculum lists"
        />

        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: "0 0 8px 8px",
            minHeight: "calc(100vh - 200px)"
          }}>
          <Suspense>
            <OllInner />
          </Suspense>
        </Paper>
      </Box>
    </Wrapper>
  );
}
