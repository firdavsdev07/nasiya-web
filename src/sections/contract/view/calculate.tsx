import type { IContract } from "src/types/contract";

import { Paper } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import RenderContractFields from "src/components/render-contract-fields/renderContractFields";

const Calculate = ({ contract }: { contract: IContract }) => (
  <Paper
    elevation={3}
    sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}
  >
    <Grid container spacing={1}>
      <RenderContractFields contract={contract} showName />
    </Grid>
  </Paper>
);

export default Calculate;
