import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import { createPayrole, getPayroleStaff } from 'api';
import { format } from 'date-fns';

const StaffPayrole = () => {
  const [payroles, setPayroles] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedPayrole, setSelectedPayrole] = useState(null);
  const [formData, setFormData] = useState({
    pid: '',
    countOfDays: '',
    amount: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayroles();
  }, []);

  const fetchPayroles = async () => {
    try {
      const data = await getPayroleStaff();
      console.log(data);
      setPayroles(data);
    } catch (error) {
      console.error('Error fetching payroles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModalOpen = () => {
    setOpenCreateModal(true);
  };

  const handleCreateModalClose = () => {
    setOpenCreateModal(false);
    setFormData({
      pid: '',
      countOfDays: '',
      amount: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleViewModalOpen = (payrole) => {
    setSelectedPayrole(payrole);
    setOpenViewModal(true);
  };

  const handleViewModalClose = () => {
    setOpenViewModal(false);
    setSelectedPayrole(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPayrole(formData);
      handleCreateModalClose();
      fetchPayroles();
    } catch (error) {
      console.error('Error creating payrole:', error);
    }
  };

  return (
    <MainCard title="Payrole Management">
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateModalOpen}
        >
          Add New Payrole
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project ID</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payroles.map((payrole) => (
              <TableRow
                key={payrole._id}
                hover
                onClick={() => handleViewModalOpen(payrole)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{payrole.pid.name}</TableCell>
                <TableCell>{payrole.countOfDays}</TableCell>
                <TableCell>₹{payrole.amount}</TableCell>
                <TableCell>{format(new Date(payrole.startDate), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{format(new Date(payrole.endDate), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{payrole.isVerified ? 'Verified' : 'Pending'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Payrole Modal */}
      <Dialog open={openCreateModal} onClose={handleCreateModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Payrole</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Project ID"
                name="pid"
                value={formData.pid}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                label="Number of Days"
                name="countOfDays"
                type="number"
                value={formData.countOfDays}
                onChange={handleInputChange}
                required
                fullWidth
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                required
                fullWidth
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreateModalClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Payrole Modal */}
      <Dialog open={openViewModal} onClose={handleViewModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>Payrole Details</DialogTitle>
        <DialogContent>
          {selectedPayrole && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography>
                <strong>Project:</strong> {selectedPayrole.pid.name}
              </Typography>
              <Typography>
                <strong>Number of Days:</strong> {selectedPayrole.countOfDays}
              </Typography>
              <Typography>
                <strong>Amount:</strong> ₹{selectedPayrole.amount}
              </Typography>
              <Typography>
                <strong>Start Date:</strong>{' '}
                {format(new Date(selectedPayrole.startDate), 'dd/MM/yyyy')}
              </Typography>
              <Typography>
                <strong>End Date:</strong>{' '}
                {format(new Date(selectedPayrole.endDate), 'dd/MM/yyyy')}
              </Typography>
              <Typography>
                <strong>Status:</strong>{' '}
                {selectedPayrole.isVerified ? 'Verified' : 'Pending'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewModalClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default StaffPayrole;
