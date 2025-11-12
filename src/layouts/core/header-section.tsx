import type { RootState } from "src/store";
import type { Breakpoint } from "@mui/material/styles";
import type { TypedUseSelectorHook } from "react-redux";
import type { AppBarProps } from "@mui/material/AppBar";
import type { ToolbarProps } from "@mui/material/Toolbar";
import type { ContainerProps } from "@mui/material/Container";

import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import { ListItem, ListItemButton } from "@mui/material";

import { usePathname } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { bgBlur, varAlpha } from "src/theme/styles";

import { layoutClasses } from "../classes";
import { navData } from "../config-nav-dashboard";

// ----------------------------------------------------------------------

export type HeaderSectionProps = AppBarProps & {
  layoutQuery: Breakpoint;
  slots?: {
    leftArea?: React.ReactNode;
    rightArea?: React.ReactNode;
    topArea?: React.ReactNode;
    centerArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  slotProps?: {
    toolbar?: ToolbarProps;
    container?: ContainerProps;
  };
};

type DataType = {
  path: string;
  title: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export function HeaderSection({
  sx,
  slots,
  slotProps,
  layoutQuery = "md",
  ...other
}: HeaderSectionProps) {
  const theme = useTheme();
  const { profile } = useTypedSelector((state) => state.auth);
  const roleNavItems = profile?.role ? navData[profile?.role] : [];
  const toolbarStyles = {
    default: {
      ...bgBlur({
        color: varAlpha(theme.vars.palette.background.defaultChannel, 0.8),
      }),
      minHeight: "auto",
      height: "var(--layout-header-mobile-height)",
      transition: theme.transitions.create(["height", "background-color"], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
      }),
      [theme.breakpoints.up("sm")]: {
        minHeight: "auto",
      },
      [theme.breakpoints.up(layoutQuery)]: {
        height: "var(--layout-header-desktop-height)",
      },
    },
  };

  const pathname = usePathname();
  return (
    <AppBar
      position="sticky"
      color="transparent"
      className={layoutClasses.header}
      sx={{
        boxShadow: "none",
        zIndex: "var(--layout-header-zIndex)",
        ...sx,
      }}
      {...other}
    >
      {slots?.topArea}

      <Toolbar
        disableGutters
        {...slotProps?.toolbar}
        sx={{
          ...toolbarStyles.default,
          ...slotProps?.toolbar?.sx,
        }}
      >
        <Container
          {...slotProps?.container}
          sx={{
            height: 1,
            display: "flex",
            alignItems: "center",
            ...slotProps?.container?.sx,
          }}
        >
          {slots?.leftArea}

          <Box
            sx={{
              display: "flex",
              flex: "1 1 auto",
              justifyContent: "center",
            }}
          >
            <Box sx={{ display: { xs: "none", md: "flex" }, flex: "1 auto" }}>
              {roleNavItems.map((item: DataType) => {
                const isActived = item.path === pathname;

                return (
                  <ListItem disableGutters disablePadding key={item.title}>
                    <ListItemButton
                      disableGutters
                      component={RouterLink}
                      href={item.path}
                      sx={{
                        pl: 2,
                        py: 1,
                        gap: 2,
                        pr: 1.5,
                        borderRadius: 0.75,
                        typography: "body2",
                        fontWeight: "fontWeightMedium",
                        color: "var(--layout-nav-item-color)",
                        minHeight: "var(--layout-nav-item-height)",
                        ...(isActived && {
                          fontWeight: "fontWeightSemiBold",
                          bgcolor: "var(--layout-nav-item-active-bg)",
                          color: "var(--layout-nav-item-active-color)",
                          "&:hover": {
                            bgcolor: "var(--layout-nav-item-hover-bg)",
                          },
                        }),
                      }}
                    >
                      <Box component="span" sx={{ width: 24, height: 24 }}>
                        {item.icon}
                      </Box>

                      <Box component="span" flexGrow={1}>
                        {item.title}
                      </Box>

                      {item.info && item.info}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </Box>
            {slots?.centerArea}
          </Box>

          {slots?.rightArea}
        </Container>
      </Toolbar>

      {slots?.bottomArea}
    </AppBar>
  );
}
