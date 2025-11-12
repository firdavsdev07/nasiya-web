import type { TableRowProps } from "@mui/material/TableRow";

import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

type TableNoDataProps = TableRowProps & {
  searchQuery: string;
  columns: number;
};

export function TableNoData({
  searchQuery,
  columns,
  ...other
}: TableNoDataProps) {
  return (
    <TableRow {...other}>
      <TableCell align="center" colSpan={columns + 1}>
        <Box sx={{ py: 15, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Topilmadi
          </Typography>

          <Typography variant="body2">
            <strong>&quot;{searchQuery}&quot;</strong> uchun hech qanday natija
            topilmadi.
            <br /> Yozuv xatolarini tekshirib ko&apos;ring yoki to&apos;liq
            so&apos;zlardan foydalaning.
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
