export const getUserFromStorage = () => {
  const userData = JSON.parse(localStorage.getItem("userInfo") || null);
  //return token only
  return userData?.token;
};
