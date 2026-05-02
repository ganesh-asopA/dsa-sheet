import api from './api';

export const fetchTopics = async () => {
  const { data } = await api.get('/dsa/topics');
  return data;
};

export const fetchProgress = async () => {
  const { data } = await api.get('/progress');
  return data.completedIds;
};

export const toggleProblem = async (problemId) => {
  const { data } = await api.post('/progress/toggle', { problemId });
  return data;
};
