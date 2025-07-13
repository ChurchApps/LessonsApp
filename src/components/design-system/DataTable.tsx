import React from "react";
import { Box, IconButton, Stack, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";

interface TableColumn<T> {
  key: keyof T | string;
  label?: string;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string | number;
}

interface TableAction<T> {
  icon: React.ReactNode;
  onClick: (item: T) => void;
  title?: string;
  color?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
  keyField?: keyof T;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  onRowClick,
  loading = false,
  emptyState,
  keyField = "id" as keyof T
}: DataTableProps<T>) {
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      emptyState || (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">No data available</Typography>
        </Box>
      )
    );
  }

  const renderCellContent = (column: TableColumn<T>, item: T) => {
    if (column.render) return column.render(item);

    const value = item[column.key as keyof T];
    return value?.toString() || "";
  };

  return (
    <Table size="small">
      <TableBody>
        {data.map(item => (
          <TableRow
            key={item[keyField]?.toString() || Math.random()}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
                cursor: onRowClick ? "pointer" : "default"
              }
            }}
            onClick={onRowClick ? () => onRowClick(item) : undefined}>
            {columns.map((column, index) => (
              <TableCell key={index} align={column.align || "left"} sx={{ width: column.width }}>
                {renderCellContent(column, item)}
              </TableCell>
            ))}

            {actions.length > 0 && (
              <TableCell align="right" sx={{ width: "auto" }}>
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  {actions.map((action, index) => (
                    <IconButton
                      key={index}
                      size="small"
                      onClick={e => {
                        e.stopPropagation();
                        action.onClick(item);
                      }}
                      title={action.title}
                      sx={{
                        color: action.color || "action.active"
                      }}>
                      {action.icon}
                    </IconButton>
                  ))}
                </Stack>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
