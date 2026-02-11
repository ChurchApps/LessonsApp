"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Build as BuildIcon } from "@mui/icons-material";
import { Box, Paper } from "@mui/material";
import { Wrapper } from "@/components/Wrapper";
import { PageHeader } from "@churchapps/apphelper";

const OlfInner = dynamic(() => import("./components/OlfInner"), { loading: () => <div>Loading lesson builder...</div> });

export default function CP() {
  return (
    <Wrapper>
      <Box sx={{ p: 0 }}>
        <PageHeader
          icon={<BuildIcon />}
          title="Open Lesson Format Builder"
          subtitle="Create and manage custom lesson formats"
        />

        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: "0 0 8px 8px",
            minHeight: "calc(100vh - 200px)"
          }}>
          <Suspense>
            <OlfInner />
          </Suspense>
        </Paper>
      </Box>
    </Wrapper>
  );
}
