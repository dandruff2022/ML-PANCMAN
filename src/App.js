import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PacMan from "./components/PacMan";
import MLTrain from "./components/MLTrain";
import DataCollection from "./components/DataCollection";
import DataManagement from "./components/DataManagement";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
} from "@mui/material";

function Main() {
  const webcamRef = React.useRef(null);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) => theme.palette.grey[800],
        flexGrow: 1,
        height: "100vh",
        width: "100vw",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <Container sx={{ paddingTop: 3 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={6} lg={6}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                marginBottom: 3,
              }}
            >
              {/* part 1 where we collect training data */}
              <DataCollection webcamRef={webcamRef} />
            </Paper>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 340,
              }}
            >
              <MLTrain webcamRef={webcamRef} />
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={6} lg={6}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <PacMan />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute">
          <Toolbar sx={{ pl: "24px" }}>
            <Typography component="h1" variant="h3" color="inherit" noWrap>
              Control PAC MAN via the camera!
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Routes>
        <Route path="/ML-PANCMAN" element={<Main />} />
        <Route path="/edit" element={<DataManagement />} />
      </Routes>
    </BrowserRouter>
  );
}
