// src/pages/Faq.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  TablePagination,
  Snackbar,
  Tooltip,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const BASE_URL = 'http://135.181.42.5:214';

const Faq = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formData, setFormData] = useState({
    id: null,
    questionAZ: '',
    answerAZ: '',
    questionEN: '',
    answerEN: '',
    questionRU: '',
    answerRU: '',
  });

  const getFaqs = async () => {
    const response = await axios.get(`${BASE_URL}/faqs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const addFaq = async (data) => {
    const response = await axios.post(`${BASE_URL}/faqs`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const updateFaq = async (data) => {
    const response = await axios.put(`${BASE_URL}/faqs`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const deleteFaq = async (id) => {
    const response = await axios.delete(`${BASE_URL}/faqs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['faqs'],
    queryFn: getFaqs,
  });

  const addMutation = useMutation({
    mutationFn: addFaq,
    onSuccess: () => {
      queryClient.invalidateQueries(['faqs']);
      handleClose();
      setOpenSnackbar(true);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateFaq,
    onSuccess: () => {
      queryClient.invalidateQueries(['faqs']);
      handleClose();
      setOpenSnackbar(true);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries(['faqs']);
      setOpenSnackbar(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      updateMutation.mutate(formData);
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleEdit = (faq) => {
    setFormData(faq);
    setOpen(true);
  };

  const handleAddNew = () => {
    setFormData({
      id: null,
      questionAZ: '',
      answerAZ: '',
      questionEN: '',
      answerEN: '',
      questionRU: '',
      answerRU: '',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      id: null,
      questionAZ: '',
      answerAZ: '',
      questionEN: '',
      answerEN: '',
      questionRU: '',
      answerRU: '',
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <CircularProgress sx={{ m: 3 }} />;
  if (isError) return <Typography color="error">FAQ yüklənə bilmədi.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        FAQ CRUD
      </Typography>

      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleAddNew}>
        Əlavə et
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Sual (AZ)</TableCell>
              <TableCell>Cavab (AZ)</TableCell>
              <TableCell>Sual (EN)</TableCell>
              <TableCell>Cavab (EN)</TableCell>
              <TableCell>Sual (RU)</TableCell>
              <TableCell>Cavab (RU)</TableCell>
              <TableCell>Əməliyyatlar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((faq, index) => (
              <TableRow
                key={faq.id}
                hover
                sx={{
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                  transition: '0.3s',
                  '&:hover': { backgroundColor: '#e3f2fd' },
                }}
              >
                <TableCell>{faq.id}</TableCell>
                <TableCell>{faq.questionAZ}</TableCell>
                <TableCell>{faq.answerAZ}</TableCell>
                <TableCell>{faq.questionEN}</TableCell>
                <TableCell>{faq.answerEN}</TableCell>
                <TableCell>{faq.questionRU}</TableCell>
                <TableCell>{faq.answerRU}</TableCell>
                <TableCell>
                  <Tooltip title="Yenilə">
                    <IconButton onClick={() => handleEdit(faq)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton onClick={() => deleteMutation.mutate(faq.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '20px', color: '#3f51b5' }}>
          {formData.id ? 'FAQ Yenilə' : 'Yeni FAQ əlavə et'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {['AZ', 'EN', 'RU'].map((lang) => (
                <React.Fragment key={lang}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label={`Sual (${lang})`}
                      value={formData[`question${lang}`] || ''}
                      onChange={(e) => setFormData({ ...formData, [`question${lang}`]: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label={`Cavab (${lang})`}
                      value={formData[`answer${lang}`] || ''}
                      onChange={(e) => setFormData({ ...formData, [`answer${lang}`]: e.target.value })}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={handleClose}>Ləğv et</Button>
              <Button type="submit" variant="contained">
                {formData.id ? 'Yenilə' : 'Əlavə et'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Əməliyyat uğurla tamamlandı"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Faq;