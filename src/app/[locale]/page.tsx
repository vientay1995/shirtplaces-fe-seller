"use client";
import Script from "next/script";
import Design from "@/components/Design";
import styles from "@/styles/page.module.scss";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import Image from "next/image";
import { useMemo, useState } from "react";
import templates from "@/resources/templates.json";
import { Product } from "@/modules";

export default function Home() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectProducts, setSelectProducts] = useState<Product[]>([]);

  const renderTitle = useMemo(() => {
    return {
      1: {
        title: "Select product types (2 selected)",
        description:
          "To get started on creating your new product, please select the product type from the list below that best matches the type of product you want to create.",
      },
      2: {
        title: "Design your products",
        description: "Experiment with different layouts and designs",
      },
    }[activeStep];
  }, [activeStep]);

  const nextStep = async () => {
    setActiveStep((prev) => prev + 1);
  };

  const backStep = async () => {
    setActiveStep((prev) => prev - 1);
  };

  const chooseProducts = async (item: Product) => {
    if (
      selectProducts.findIndex((product: Product) => product.id === item.id) >=
      0
    ) {
      setSelectProducts(() =>
        selectProducts.filter((product) => product.id !== item.id)
      );
    } else {
      setSelectProducts((prev) => prev.concat(item));
    }
  };

  return (
    <main className={styles.main}>
      <Container maxWidth="xl">
        <Box p="20px 0">
          <Typography variant="h6">
            Streamline Your Product Creation Process with Our User-Friendly
            Wizard
          </Typography>
        </Box>
        <Card variant="outlined">
          <CardContent>
            <Grid container py={2}>
              <Grid
                item
                xs={1}
                style={{ maxWidth: 70, alignItems: "center" }}
                display="flex"
              >
                <Avatar sx={{ bgcolor: deepOrange[100] }}>
                  {activeStep >= 10 ? activeStep : `0${activeStep}`}
                </Avatar>
              </Grid>
              <Grid item xs={11}>
                <Box>
                  <Typography>{renderTitle?.title}</Typography>
                  <Typography color={"#74788d"}>
                    {renderTitle?.description}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider />
            {(activeStep === 1 && (
              <Grid container py={3} gap={2}>
                {templates.map((item: any) => {
                  const activeProduct =
                    selectProducts.findIndex(
                      (product) => product.id === item.id
                    ) >= 0;
                  return (
                    <Grid item xs={3} key={item.id}>
                      <Card
                        onClick={() => chooseProducts(item)}
                        style={{
                          borderColor: activeProduct ? "blue" : "transparent",
                        }}
                        variant={"outlined"}
                      >
                        <CardContent style={{ textAlign: "center" }}>
                          <Typography variant="subtitle1">
                            {item.name}
                          </Typography>
                          <Typography>{item.description}</Typography>
                          <Image
                            src={item.thumbnail}
                            alt={item.name}
                            width={350}
                            height={350}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )) || <Design products={selectProducts} />}
            {(activeStep === 1 && (
              <Box display={"flex"} justifyContent={"flex-end"}>
                <Button
                  variant="contained"
                  onClick={nextStep}
                  disabled={!selectProducts?.length}
                >
                  Continue
                </Button>
              </Box>
            )) || (
              <Box display={"flex"} justifyContent={"flex-start"}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={backStep}
                >
                  Back
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
