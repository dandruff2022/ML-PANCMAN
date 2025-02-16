import React, { useState, useEffect } from "react";
import {
  Box,
  Toolbar,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material/";
import {
  imgSrcArrAtom,
  truncatedMobileNetAtom,
  modelAtom,
} from "../GlobalState";
import { predict } from "../model"; // Your predict function
import { loadLayersModel } from "@tensorflow/tfjs";
import { loadTruncatedMobileNet, base64ToTensor } from "../model";
import { useAtom } from "jotai";

const DIRECTIONS = {
  up: <ArrowUpward />,
  down: <ArrowDownward />,
  left: <ArrowBack />,
  right: <ArrowForward />,
};

async function SortImgSrcArr(
  directionKey,
  imgSrcArr,
  truncatedMobileNet,
  model
) {
  if (!truncatedMobileNet || !model) return [];
  let results = [];
  await Promise.all(
    imgSrcArr
      .filter((d) => d.label === directionKey)
      .map(async (imgSrc) => {
        const imgTensor = await base64ToTensor(imgSrc.src);
        const res = await predict(truncatedMobileNet, model, imgTensor, true);
        results.push({ src: imgSrc, uncertainty: res.uncertainty });
      })
  );
  results.sort((a, b) => b.uncertainty - a.uncertainty);
  return results;
}

export default function DataManagement() {
  const [imgSrcArr, setImgSrcArr] = useAtom(imgSrcArrAtom);
  const [truncatedMobileNet, setTruncatedMobileNet] = useAtom(
    truncatedMobileNetAtom
  );
  const [model, setModel] = useAtom(modelAtom);

  // Load both models asynchronously
  useEffect(() => {
    async function loadModels() {
      try {
        const tm = await loadTruncatedMobileNet();
        setTruncatedMobileNet(tm);
      } catch (error) {
        console.error("Failed to load truncatedMobileNet", error);
      }
      try {
        const loadedModel = await loadLayersModel("indexeddb://my-model");
        setModel(loadedModel);
        console.log("Model loaded");
      } catch (error) {
        console.error("Failed to load model", error);
      }
    }
    loadModels();
  }, [setTruncatedMobileNet, setModel]);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) => theme.palette.grey[800],
        flexGrow: 1,
        height: "100vh",
        width: "100vw",
        overflow: "auto",
        padding: 3,
      }}
    >
      <Toolbar />
      <Container sx={{ paddingTop: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h4" fontWeight="bold">
                Click to delete the data
              </Typography>
            </Paper>

            {Object.keys(DIRECTIONS).map((directionKey) => (
              <Paper
                key={directionKey}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: 3,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Data of direction {DIRECTIONS[directionKey]}
                </Typography>
                {truncatedMobileNet && model ? (
                  <OneDirection
                    directionKey={directionKey}
                    imgSrcArr={imgSrcArr}
                    setImgSrcArr={setImgSrcArr}
                    truncatedMobileNet={truncatedMobileNet}
                    model={model}
                  />
                ) : (
                  <Typography variant="subtitle1">model loading...</Typography>
                )}
              </Paper>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const OneDirection = ({
  directionKey,
  imgSrcArr,
  setImgSrcArr,
  truncatedMobileNet,
  model,
}) => {
  const [imgSortArr, setImgSortArr] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!truncatedMobileNet || !model) return;
      const results = await SortImgSrcArr(
        directionKey,
        imgSrcArr,
        truncatedMobileNet,
        model
      );
      setImgSortArr(results);
    }
    fetchData();
  }, [directionKey, imgSrcArr, truncatedMobileNet, model]);

  const handleDelete = (item) => {
    setImgSrcArr((prev) => prev.filter((d) => d !== item.src));
    setImgSortArr((prev) => prev.filter((d) => d !== item));
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      {imgSortArr.map((item, index) => {
        const { src, uncertainty } = item;
        return (
          <Box
            key={index}
            sx={{
              width: "100px",
              height: "120px",
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { opacity: 0.7 },
            }}
            onClick={() => handleDelete(item)}
          >
            <img
              src={src.src}
              style={{ width: "100px", height: "100px", padding: "2px" }}
            />
            <Typography variant="caption" display="block">
              Uncertainty: {uncertainty.toFixed(2)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};
