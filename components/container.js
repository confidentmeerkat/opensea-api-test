import { Grid, Hidden, Paper } from "@mui/material";
import { Box } from "@mui/system";

export default function Container({ children }) {
  return (
    <Grid mt={8} container justifyContent="center" alignItems="center">
      <Grid item md={4} sm={8} xs={12}>
        <Hidden smDown>
          <Paper>
            <Box px={4} py={3}>
              {children}
            </Box>
          </Paper>
        </Hidden>

        <Hidden smUp>{children}</Hidden>
      </Grid>
    </Grid>
  );
}
