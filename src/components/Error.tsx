"use client";

//todo remove
import { NextPageContext } from "next";
import React from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  Stack,
  Typography
} from "@mui/material";
import { Layout } from "@/components";

interface Props {
  statusCode?: number;
  message: string;
}
function Error({ message, statusCode: _statusCode }: Props) {
  const [showError, setShowError] = React.useState(false);
  const [year, setYear] = React.useState<number | null>(null);
  const onClose = () => setShowError(!showError);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const Footer = () => (
    <div id="footer">
      <Box sx={{ textAlign: "center", padding: "0 16px" }}>
        <img src="/images/logo-dark.png" alt="Free church curriculum" style={{ maxWidth: "100%" }} />
        <Grid container justifyContent="center" sx={{ marginTop: 4 }}>
          <Grid size="auto">
            <Stack direction="row" alignItems="center" sx={{ flexWrap: "wrap" }} mb={2}>
              <b>
                <Stack direction="row" alignItems="center" mr="5px">
                  <Icon sx={{ marginRight: "5px" }}>mail</Icon> Email:
                </Stack>
              </b>{" "}
              <a href={"mailto:support@livecs.org"}>support@livecs.org</a>
            </Stack>
            <Stack direction="row" alignItems="center" sx={{ flexWrap: "wrap" }} mb={2}>
              <b>
                <Stack direction="row" alignItems="center" mr="5px">
                  <Icon sx={{ marginRight: "5px" }}>phone_iphone</Icon> Phone:
                </Stack>
              </b>{" "}
              <a href="tel:+19189942638">+1 (918) 994-2638</a>
            </Stack>
            <Stack direction="row" alignItems="center" sx={{ flexWrap: "wrap" }} mb={2}>
              <b>
                <Stack direction="row" alignItems="center" mr="5px">
                  <Icon sx={{ marginRight: "5px" }}>forum</Icon> Messenger:
                </Stack>
              </b>{" "}
              <a href="https://m.me/livecsolutions" target="_new">
                https://m.me/livecsolutions
              </a>
            </Stack>
            <Stack direction="row" alignItems="center" sx={{ flexWrap: "wrap" }}>
              <b>
                <Stack direction="row" alignItems="center" mr="5px">
                  <Icon sx={{ marginRight: "5px" }}>info</Icon> Knowledge Base:
                </Stack>
              </b>{" "}
              <a href="https://support.churchapps.org" target="_new">
                https://support.churchapps.org
              </a>
            </Stack>
            <p>{year} © Live Church Solutions. All rights reserved.</p>
          </Grid>
        </Grid>
      </Box>
    </div>
  );

  return (
    <Layout withoutFooter={true}>
      <div style={{ margin: "70px 0" }}>
        <Container fixed>
          <Grid container justifyContent="center">
            <Grid size={{ md: 9, sm: 12 }} sx={{ textAlign: "center" }}>
              <Typography
                component="h1"
                sx={{ fontSize: "42px", fontWeight: 600, margin: "0 0 8px 0", border: "none" }}>
                An error has occurred
              </Typography>
              <img src="/images/maintenance.png" alt="maintenance.png" style={{ width: 200 }} />
              <div>
                <span style={{ color: "#1976d2", cursor: "pointer" }} onClick={onClose}>
                  See error details
                </span>
              </div>
              <Button type="button" fullWidth variant="contained" href="/" style={{ width: 200, marginTop: "10px" }}>
                Go to Home
              </Button>
            </Grid>
          </Grid>
        </Container>
      </div>
      <Footer />
      <Dialog open={showError} onClose={onClose}>
        <DialogTitle>See error details</DialogTitle>
        <DialogContent>
          <Stack direction="row" alignItems="center" sx={{ flexWrap: "wrap" }} mb={2}>
            {message}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ paddingX: "16px", paddingBottom: "12px" }}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  res.setHeader("Cache-Control", "no-store, must-revalidate");
  res.setHeader("CDN-Cache-Control", "public, s-maxage=0, must-revalidate");
  res.setHeader("Vercel-CDN-Cache-Control", "public, s-maxage=0, must-revalidate");
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = statusCode === 404 ? "This page does't exist" : "The server encountered an internal error. Please try again";
  return { statusCode, message };
};

export default Error;
