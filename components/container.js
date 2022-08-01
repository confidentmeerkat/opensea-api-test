import { Grid, Hidden, Paper } from "@mui/material";

export default function Container({ children }) {
  return (
    <Grid mt={8} container justifyContent="center" alignItems="center">
      <Grid item md={6} sm={8} xs={12}>
        <Hidden smDown>
          <Paper square elevation={4}>
            {children}
          </Paper>
        </Hidden>

        <Hidden smUp>{children}</Hidden>
      </Grid>
    </Grid>
  );
}
