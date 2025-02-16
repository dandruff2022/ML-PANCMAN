import React from "react";
import { Box, Toolbar, Container, Grid, Paper } from "@mui/material";
import { imgSrcArrAtom } from "../GlobalState";
import { useAtom } from "jotai";

export default function DataManagement() {
  const [imgSrcArr, setImgSrcArr] = useAtom(imgSrcArrAtom);

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
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                marginBottom: 3,
              }}
            >
              000
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const OneDirection = ({ directionIcon, onCapture, dirImgSrcArr, disabled }) => {
  return (
    <Grid item xs={3}>
      <Box textAlign="center">
        <Button
          variant="outlined"
          endIcon={directionIcon}
          onClick={onCapture}
          disabled={disabled}
        >
          {" "}
          Add to{" "}
        </Button>
      </Box>
      <Box textAlign="center" sx={{ width: "100%", height: "100px" }}>
        {dirImgSrcArr.length > 0 && (
          <img
            height={"100%"}
            src={dirImgSrcArr[dirImgSrcArr.length - 1].src}
            style={{ padding: "2px" }}
          />
        )}
      </Box>
    </Grid>
  );
};
