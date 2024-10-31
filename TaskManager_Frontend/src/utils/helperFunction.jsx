import {jwtDecode} from 'jwt-decode';

export const getWelcomeData = () => {
  const token = localStorage.getItem('token');
  let username = 'User'; 
  let email = ''; 
  
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      username = decodedToken.username || 'User'; 
      email = decodedToken.email || ''; 
    } catch (error) {
      console.error('Failed to decode token', error);
    }
  }
  const date = new Date();
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-GB', options);
  
  return { username, currentDate: formattedDate,email };
}

export const formatDateToDayMonth = (dateString) => {
  const [day, month, year] = dateString.split('/');
  const date = new Date(`${year}-${month}-${day}`); 
  
  return isNaN(date.getTime()) 
    ? 'Invalid Date' 
    : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export const  getInitials = (name) => {
  if (!name) return '';
  return name.slice(0, 2).toUpperCase();
}

export const  formatToDateObject = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return new Date(`${year}-${month}-${day}`);
}
export const parseDate = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};