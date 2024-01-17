import { Box, CssBaseline, GlobalStyles } from "@mui/material";

import VideoEditorWrapper from "./components/VideoEditorWrapper";
import AppContextProvider from "./context/AppContext";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <AppContextProvider>
      <CssBaseline />
      <Box sx={{ width: "100%", height: "100dvh" }}>
        <GlobalStyles
          styles={{
            "html, body": {
              minHeight: "100%",
              backgroundColor: "#ebebeb",
              padding: "0 !important",
            },
          }}
        />
        <ErrorBoundary>
          <VideoEditorWrapper />
        </ErrorBoundary>
      </Box>
    </AppContextProvider>
  );
}

export default App;
