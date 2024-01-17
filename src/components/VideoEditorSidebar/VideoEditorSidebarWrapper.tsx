import { Box, Drawer } from "@mui/material";
import React from "react";

import VideoEditorSidebar from "./components/VideoEditorSidebar";
import { DRAWER_WIDTH } from "../../constants";
import { useAppContext } from "../../hooks/useAppContext";

const VideoEditorSidebarWrapper: React.FC = () => {
  const { setIsSidebarClosing, isMobileSidebarOpen, mobileSidebarToggle } =
    useAppContext();

  const handleDrawerClose = () => {
    setIsSidebarClosing(true);
    mobileSidebarToggle(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsSidebarClosing(false);
  };

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <Drawer
        anchor="right"
        variant="temporary"
        open={isMobileSidebarOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
      >
        <VideoEditorSidebar />
      </Drawer>
      <Drawer
        anchor="right"
        variant="permanent"
        PaperProps={{ sx: { position: "absolute" } }}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
        open
      >
        <VideoEditorSidebar />
      </Drawer>
    </Box>
  );
};

export default VideoEditorSidebarWrapper;
