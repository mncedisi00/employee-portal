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

  useEffect(() => {
    axios.get('http://localhost:5000/employees')
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/employees', form)
      .then(response => setEmployees([...employees, response.data]))
      .catch(error => console.error('Error adding employee:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/employees/${id}`)
      .then(() => setEmployees(employees.filter(employee => employee.id !== id)))
      .catch(error => console.error('Error deleting employee:', error));
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
        <button type="submit">Add Employee</button>
      </form>
      <ul>
        {employees.map(employee => (
          <li key={employee.id}>
            {employee.name} ({employee.position})
            <button onClick={() => handleDelete(employee.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeRegistration;
