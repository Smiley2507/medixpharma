// src/utils/auth.js
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const isStaff = () => {
  const user = getCurrentUser();
  console.log('isStaff check - user:', user);
  return user && user.role === 'staff';
};

export const isPharmacist = () => {
  const user = getCurrentUser();
  console.log('isPharmacist check - user:', user);
  return user && user.role === 'pharmacist';
};