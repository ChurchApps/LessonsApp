"use client";

import { Container, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div id="footer">
      <Container fixed>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <img src="/images/logo-dark.png" alt="Free church curriculum" className="img-fluid" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} style={{ textAlign: "center" }}>
            <p style={{ paddingTop: 8 }}>
              <Link href="/faq" style={{ color: "#FFF", marginRight: 16 }}>FAQ</Link>
              <Link href="/compare/answers-in-genesis" style={{ color: "#FFF", marginRight: 16 }}>Comparisons</Link>
              <a href="https://support.churchapps.org/" target="_blank" rel="noopener noreferrer" style={{ color: "#FFF" }}>Help Center</a>
            </p>
            <p style={{ paddingTop: 4 }}>
              Phone:{" "}
              <a href="tel:9189942638" style={{ color: "#FFF" }}>
                918-994-2638
              </a>{" "}
              &nbsp; | &nbsp; Email: <a href="mailto:support@churchapps.org">support@churchapps.org</a>
            </p>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} style={{ textAlign: "right" }}>
            <p style={{ paddingTop: 8 }}>
              <a href="https://b1.church" target="_blank" rel="noopener noreferrer" style={{ color: "#FFF", marginRight: 16 }}>B1.church</a>
              <a href="https://freeshow.app" target="_blank" rel="noopener noreferrer" style={{ color: "#FFF" }}>FreeShow</a>
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
