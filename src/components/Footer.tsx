import { Box } from "@mui/material";

export function Footer() {
  return (
    <div id="footer">
      <Box sx={{textAlign: "center", padding: "0 16px"}}>
        <img src="/images/logo-dark.png" alt="Free church curriculum"/>
        <p>Phone: 918-994-2638 &nbsp; | &nbsp; support@churchapps.org</p>
        <p>{new Date().getFullYear()} © Live Church Solutions. All rights reserved.</p>
      </Box>
    </div>
  );
}
