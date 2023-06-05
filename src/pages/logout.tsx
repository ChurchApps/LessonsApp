import { Layout, LogoutPage } from "@/components";
import { Container } from "@mui/material";

export default function Logout() {
  return (
    <Layout>
      <div style={{minHeight:500}}>
        <Container fixed>
          <h1>Logging out</h1>
        </Container>
        <LogoutPage />
      </div>
    </Layout>
  );
}
