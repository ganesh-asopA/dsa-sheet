import api from './api';

export const loginUser = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
  return data;
};

export const registerUser = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
