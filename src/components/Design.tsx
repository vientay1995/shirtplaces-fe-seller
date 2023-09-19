"use client";

import { useMockup } from "@/hooks/useMockup";
import { type Product } from "@/modules";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { keys } from "lodash";
import Image from "next/image";
import CheckIcon from "@mui/icons-material/Check";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type DesignProps = {
  products: Product[];
};

const Design: React.FC<DesignProps> = ({ products }) => {
  const [
    _,
    {
      layerId,
      color: colorSelected,
      productSelected,
      activeDisplay,
      removeLayer,
      handleChangeColor,
      handleChangeProduct,
      handleSwitchDisplay,
      handleSelectImage,
      handleExport,
    },
  ] = useMockup(products);

  return (
    <Box>
      <Grid container py={2} spacing={3}>
        <Grid item xs={3}>
          <Grid container spacing={1}>
            {products.map((product) => (
              <Grid item key={product?.id}>
                <Card
                  onClick={() => handleChangeProduct(product)}
                  sx={{
                    borderColor:
                      productSelected.id === product.id
                        ? "info.main"
                        : "transparent",
                    cursor: "pointer",
                  }}
                  variant="outlined"
                >
                  <CardContent>
                    <Grid container>
                      <Grid item xs={4}>
                        <Image
                          src={product?.thumbnail}
                          alt={product?.id}
                          width={62}
                          height={62}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="subtitle2">
                          {product?.name}
                        </Typography>
                        <Typography variant="subtitle2">
                          {product?.description}
                        </Typography>
                        <Box>
                          <Grid container py={1} gap={"5px"}>
                            {product.attributes.colors.options.map((color) => {
                              return (
                                <Grid item key={color.value}>
                                  <IconButton
                                    sx={{ position: "relative" }}
                                    onClick={() => handleChangeColor(color)}
                                  >
                                    <i
                                      style={{
                                        display: "block",
                                        width: "20px",
                                        height: "20px",
                                        textIndent: "-9999px",
                                        whiteSpace: "nowrap",
                                        borderRadius: "10px",
                                        border: "1px solid #ccc",
                                        backgroundColor: color.hex,
                                      }}
                                    >
                                      {color.value}
                                    </i>
                                    {productSelected.id === product.id &&
                                      colorSelected.value === color.value && (
                                        <CheckIcon
                                          sx={{
                                            position: "absolute",
                                            width: 16,
                                          }}
                                        />
                                      )}
                                  </IconButton>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <Typography>Switch</Typography>
          {keys(productSelected.displays).map((key, index) => {
            const display =
              productSelected.displays[key as keyof Product["displays"]];

            return (
              <Button
                key={display.label}
                color="info"
                variant="contained"
                sx={{ ml: index >= 1 ? 1 : 0 }}
                disabled={activeDisplay === key}
                onClick={() => handleSwitchDisplay(key)}
              >
                {display.label}
              </Button>
            );
          })}

          <Box display="flex" alignItems="center" flexWrap="wrap">
            <div id="mock-up" style={{ width: "100%" }}></div>

            <Stack direction="row" spacing={2}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput type="file" onChange={handleSelectImage} />
              </Button>

              <Button variant="contained" onClick={handleExport}>
                Export
              </Button>

              <Button
                onClick={() => removeLayer()}
                disabled={!layerId}
                variant="outlined"
              >
                Remove selected
              </Button>
            </Stack>

            <Box id="mock-up-export"></Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default Design;
