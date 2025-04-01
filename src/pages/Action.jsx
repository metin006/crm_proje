import React, { useState } from "react";
import {
  useGetActions,
  useCreateAction,
  useDeleteAction,
  useUpdateAction,
} from "../api/action";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Pagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const Action = () => {
  const { data = [], isLoading } = useGetActions();
  const createAction = useCreateAction();
  const deleteAction = useDeleteAction();
  const updateAction = useUpdateAction();

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    titleAZ: "",
    titleEN: "",
    titleRU: "",
    detailAZ: "",
    detailEN: "",
    detailRU: "",
    startDate: "",
    endDate: "",
    file: null,
  });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const handleOpen = (data = null) => {
    setEditData(data);
    setFormData(
      data || {
        titleAZ: "",
        titleEN: "",
        titleRU: "",
        detailAZ: "",
        detailEN: "",
        detailRU: "",
        startDate: "",
        endDate: "",
        file: null,
      }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }

    if (editData) {
      await updateAction.mutateAsync({ id: editData.id, data: payload });
    } else {
      await createAction.mutateAsync(payload);
    }

    handleClose();
  };

  const handleDelete = async (id) => {
    await deleteAction.mutateAsync(id);
  };

  const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div style={{ padding: 20 }}>
      <h2>Action CRUD</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        style={{ marginBottom: 20 }}
      >
        ƏLAVƏ ET
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Başlıq (AZ)</TableCell>
              <TableCell>Başlıq (EN)</TableCell>
              <TableCell>Başlıq (RU)</TableCell>
              <TableCell>Ətraflı (AZ)</TableCell>
              <TableCell>Ətraflı (EN)</TableCell>
              <TableCell>Ətraflı (RU)</TableCell>
              <TableCell>Başlama</TableCell>
              <TableCell>Bitmə</TableCell>
              <TableCell>Fayl</TableCell>
              <TableCell>Əməliyyatlar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.titleAZ}</TableCell>
                <TableCell>{item.titleEN}</TableCell>
                <TableCell>{item.titleRU}</TableCell>
                <TableCell>{item.detailAZ}</TableCell>
                <TableCell>{item.detailEN}</TableCell>
                <TableCell>{item.detailRU}</TableCell>
                <TableCell>{item.startDate}</TableCell>
                <TableCell>{item.endDate}</TableCell>
                <TableCell>{item.file}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(item.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <span style={{ marginRight: 10 }}>Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(parseInt(e.target.value));
            setPage(1);
          }}
        >
          {[5, 10, 25].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <Pagination
          count={Math.ceil(data.length / rowsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </div>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{editData ? "Action Yenilə" : "Yeni Action əlavə et"}</DialogTitle>
        <DialogContent style={{ display: "flex", flexWrap: "wrap", gap: 15 }}>
          {[
            { name: "titleAZ", label: "Başlıq (AZ)" },
            { name: "titleEN", label: "Başlıq (EN)" },
            { name: "titleRU", label: "Başlıq (RU)" },
            { name: "detailAZ", label: "Ətraflı (AZ)" },
            { name: "detailEN", label: "Ətraflı (EN)" },
            { name: "detailRU", label: "Ətraflı (RU)" },
            { name: "startDate", label: "Başlama Tarixi", type: "date" },
            { name: "endDate", label: "Bitmə Tarixi", type: "date" },
          ].map(({ name, label, type }) => (
            <TextField
              key={name}
              label={label}
              name={name}
              type={type || "text"}
              fullWidth
              value={formData[name]}
              onChange={handleChange}
              InputLabelProps={type === "date" ? { shrink: true } : {}}
            />
          ))}

          <input type="file" name="file" onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>LƏĞV ET</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editData ? "YENİLƏ" : "ƏLAVƏ ET"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Action;
