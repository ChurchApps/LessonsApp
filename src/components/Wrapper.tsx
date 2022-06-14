import React from "react";
import UserContext from "../utils/UserContext";
import { Box, createTheme, CssBaseline, List, ThemeProvider } from "@mui/material";
import { SiteWrapper, NavItem } from "../appBase/components";
import { UserHelper, Permissions } from "@/utils";
import { useRouter } from "next/router"

interface Props { pageTitle?: string, children: React.ReactNode }

export const Wrapper: React.FC<Props> = props => {
  const context = React.useContext(UserContext);
  const tabs = []
  const router = useRouter();

  tabs.push(<NavItem url="/" label="Home" icon="home" router={router} />);
  if (UserHelper.checkAccess(Permissions.lessonsApi.lessons.edit)) tabs.push(<NavItem url="/admin" label="Admin" icon="admin_panel_settings" router={router} />);
  if (UserHelper.checkAccess(Permissions.lessonsApi.lessons.editSchedules)) tabs.push(<NavItem url="/cp" label="Schedules" icon="calendar_month" router={router} />);

  const navContent = <><List component="nav">{tabs}</List></>

  const mdTheme = createTheme({
    palette: {
      secondary: {
        main: "#444444"
      }
    },
    components: {
      MuiTextField: { defaultProps: { margin: "normal" } },
      MuiFormControl: { defaultProps: { margin: "normal" } }
    }
  });

  return <ThemeProvider theme={mdTheme}>
    <CssBaseline />
    <Box sx={{ display: "flex", backgroundColor: "#EEE" }}>
      <SiteWrapper navContent={navContent} context={context}>{props.children}</SiteWrapper>
    </Box>
  </ThemeProvider>

};
