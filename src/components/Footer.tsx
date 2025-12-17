"use client";

import { Container, Grid } from "@mui/material";
import { useState, useEffect } from "react";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div id="footer">
      <Container fixed>
        <Grid container spacing={3}>
          <Grid size={{ xs: 3 }}>
            <img src="/images/logo-dark.png" alt="Free church curriculum" className="img-fluid" />
          </Grid>
          <Grid size={{ xs: 9 }} style={{ textAlign: "center" }}>
            <p style={{ paddingTop: 8 }}>
              Phone:{" "}
              <a href="tex:9189942638" style={{ color: "#FFF" }}>
                918-994-2638
              </a>{" "}
              &nbsp; | &nbsp; Email: <a href="mailto:support@churchapps.org">support@churchapps.org</a>
            </p>
          </Grid>
        </Grid>
        <p className="copyright">
          {year} © <span style={{ color: "#FFF" }}>Live Church Solutions</span>. All rights
          reserved.
        </p>
      </Container>
    </div>
  );
}
