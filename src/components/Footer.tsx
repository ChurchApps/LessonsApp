import { Box } from "@mui/material";

export function Footer() {
  return (
    <div id="footer">
      <Box sx={{ textAlign: "center", padding: "0 16px" }}>
        <img src="/images/logo-dark.png" alt="Free church curriculum" />
        <p>Phone: <a href="tex:9189942638">918-994-2638</a> &nbsp; | &nbsp; <a href="mailto:support@churchapps.org">support@churchapps.org</a></p>
        <p>{new Date().getFullYear()} © Live Church Solutions. All rights reserved.</p>
      </Box>
    </div>
  );
}
