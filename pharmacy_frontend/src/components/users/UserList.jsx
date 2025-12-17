import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosConfig'; // Correct import: use 'api' instead of 'axios'

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching users from /api/users');
        const token = localStorage.getItem('token') || '';
        console.log('Token sent:', token);
        const response = await api.get('/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Users response:', response.data);
        setUsers(Array.isArray(response.data) ? response.data : []);
        setError('');
      } catch (err) {
        console.error('Error fetching users:', err);
        console.error('Response:', err.response);
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token') || '';
        await api.delete(`/api/users/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
        console.error('Response:', err.response);
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">User List</h2>
        <Link to="/users/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add User
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-sm font-semibold text-gray-700">ID</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Username</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Email</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Role</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Full Name</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Phone</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Active</th>
                <th className="p-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-300">
                  <td className="p-3 text-sm">{user.id}</td>
                  <td className="p-3 text-sm">{user.username}</td>
                  <td className="p-3 text-sm">{user.email}</td>
                  <td className="p-3 text-sm">{user.roles?.[0]?.name || 'N/A'}</td>
                  <td className="p-3 text-sm">{user.fullName}</td>
                  <td className="p-3 text-sm">{user.phoneNumber}</td>
                  <td className="p-3 text-sm">{user.active ? 'Yes' : 'No'}</td>
                  <td className="p-3 text-sm">
                    <Link to={`/users/update/${user.id}`} className="text-blue-600 hover:underline mr-2">Edit</Link>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;