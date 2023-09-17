import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import Image from "next/image";

type DesignProps = {
  products: any;
};

const Design: React.FC<DesignProps> = ({ products }) => {
  return (
    <Box>
      <Grid container>
        <Grid xs={3}>
          <Grid container gap={1} py={2}>
            {products.map((product: any) => (
              <Grid key={product?.id}>
                <Card>
                  <CardContent>
                    <Grid container>
                      <Grid xs={4}>
                        <Image src={product?.thumbnail} alt={product?.id} width={62} height={62} />
                      </Grid>
                      <Grid xs={8}>
                        <Typography variant="subtitle2">{product?.name}</Typography>
                        <Typography variant="subtitle2">{product?.description}</Typography>
                        <Box>
                          <Grid container py={1} gap={"5px"}>
                            {product.attributes.colors.options.map((color: any) => {
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
        <Grid xs={10}></Grid>
      </Grid>
    </Box>
  );
};

export default Design;
