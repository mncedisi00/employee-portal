import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeRegistration = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    image: '',
    position: '',
    id: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5001/employees')
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      axios.put(`http://localhost:5001/employees/${editId}`, form)
        .then(response => {
          setEmployees(employees.map(emp => (emp.id === editId ? response.data : emp)));
          resetForm();
        })
        .catch(error => console.error('Error updating employee:', error));
    } else {
      axios.post('http://localhost:5001/employees', form)
        .then(response => {
          setEmployees([...employees, response.data]);
          resetForm();
        })
        .catch(error => console.error('Error adding employee:', error));
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5001/employees/${id}`)
      .then(() => setEmployees(employees.filter(employee => employee.id !== id)))
      .catch(error => console.error('Error deleting employee:', error));
  };

  const handleEdit = (employee) => {
    setForm(employee);
    setIsEditing(true);
    setEditId(employee.id);
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      image: '',
      position: '',
      id: ''
    });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div>
      <h1>Employee Registration</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" required />
        <input name="position" value={form.position} onChange={handleChange} placeholder="Position" required />
        <input name="id" value={form.id} onChange={handleChange} placeholder="ID" required />
        <button type="submit">{isEditing ? 'Update Employee' : 'Add Employee'}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>
      <ul>
        {employees.map(employee => (
          <li key={employee.id}>
            {employee.name} ({employee.position})
            <button onClick={() => handleEdit(employee)}>Edit</button>
            <button onClick={() => handleDelete(employee.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeRegistration;
