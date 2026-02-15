export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const isToday = (dateString) => {
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
};

export const isOverdue = (dateString) => {
  if (!dateString) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateString < today;
};