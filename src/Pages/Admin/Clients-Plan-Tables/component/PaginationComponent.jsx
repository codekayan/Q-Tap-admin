// components/PaginationComponent.js
import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function PaginationComponent({ currentPage, totalPages, onChange }) {
  return (
    <Stack spacing={2} alignItems="center" mt={4}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onChange(page)}
        color="primary"
        shape="rounded"
      />
    </Stack>
  );
}

export default PaginationComponent;
