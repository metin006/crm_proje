import React, { useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, TablePagination,
  Switch, FormControlLabel, Avatar
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/category';

const initialForm = {
  id: '',
  nameAZ: '',
  nameEN: '',
  nameRU: '',
  image: null,
  active: true,
  productType: '',
};

const Category = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setForm(initialForm);
    setEditMode(false);
  };

  const handleEdit = (row) => {
    setForm({ ...row, image: null });
    setEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    if (editMode) {
      updateMutation.mutate({ id: form.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Category CRUD</h2>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleOpen}
      >
        Əlavə et
      </Button>

      <Table style={{ marginTop: '20px' }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Ad (AZ)</TableCell>
            <TableCell>Ad (EN)</TableCell>
            <TableCell>Ad (RU)</TableCell>
            <TableCell>Product Tipi</TableCell>
            <TableCell>Şəkil</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Əməliyyatlar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.id}</TableCell>
                <TableCell>{cat.nameAZ}</TableCell>
                <TableCell>{cat.nameEN}</TableCell>
                <TableCell>{cat.nameRU}</TableCell>
                <TableCell>{cat.productType}</TableCell>
                <TableCell>
                  {cat.image ? <Avatar src={cat.image} alt="img" /> : '—'}
                </TableCell>
                <TableCell>{cat.active ? 'Aktiv' : 'Passiv'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(cat)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => deleteMutation.mutate(cat.id)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={categories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? 'Redaktə et' : 'Yeni Category əlavə et'}</DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          <TextField label="Ad (AZ)" name="nameAZ" value={form.nameAZ} onChange={handleChange} fullWidth />
          <TextField label="Ad (EN)" name="nameEN" value={form.nameEN} onChange={handleChange} fullWidth />
          <TextField label="Ad (RU)" name="nameRU" value={form.nameRU} onChange={handleChange} fullWidth />
          <TextField label="Product Tipi" name="productType" value={form.productType} onChange={handleChange} fullWidth />
          <FormControlLabel
            control={<Switch checked={form.active} onChange={handleChange} name="active" />}
            label="Aktiv"
          />
          <TextField type="file" name="image" onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ləğv et</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Yenilə' : 'Əlavə et'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Category;