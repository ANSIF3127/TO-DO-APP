export const priorityOptions = [
  { value: 'high', label: 'High', color: '#dc3545' },
  { value: 'medium', label: 'Medium', color: '#ffc107' },
  { value: 'low', label: 'Low', color: '#198754' },
];

export const getPriorityLabel = (value) => {
  const option = priorityOptions.find((opt) => opt.value === value);
  return option ? option.label : 'Medium';
};