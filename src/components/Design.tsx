import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Image from "next/image";

type DesignProps = {
  products: any;
};

const Design: React.FC<DesignProps> = ({ products }) => {
  return (
    <Box>
      <Grid container py={2} spacing={3}>
        <Grid item xs={3}>
          <Grid container>
            {products.map((product: any) => (
              <Grid key={product?.id}>
                <Card>
                  <CardContent>
                    <Grid container>
                      <Grid xs={4}>
                        <Image
                          src={product?.thumbnail}
                          alt={product?.id}
                          width={62}
                          height={62}
                        />
                      </Grid>
                      <Grid xs={8}>
                        <Typography variant="subtitle2">
                          {product?.name}
                        </Typography>
                        <Typography variant="subtitle2">
                          {product?.description}
                        </Typography>
                        <Box>
                          <Grid container py={1} gap={"5px"}>
                            {product.attributes.colors.options.map(
                              (color: any) => {
                                return (
                                  <Grid key={color.value}>
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
                                  </Grid>
                                );
                              }
                            )}
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
          <Button color="info" variant="contained">
            Front
          </Button>
          <Button color="info" style={{ marginLeft: 5 }} variant="contained">
            Back
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Design;
