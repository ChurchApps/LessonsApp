"use client";

import { Container } from "@mui/material";
import { LogoutPage } from "@churchapps/apphelper";
import { Layout } from "@/components";

export default function Logout() {
  return (
    <Layout>
      <div style={{ minHeight: 500 }}>
        <Container fixed>
          <h1>Logging out</h1>
        </Container>
        <LogoutPage />
      </div>
    </Layout>
  );
}
