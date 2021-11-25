import React from 'react';

const checkLogin = () => {
  return document.cookie.includes('isLogin');
};

interface ILoginContext {
  isLogin: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginContext = React.createContext<ILoginContext>({
  isLogin: checkLogin(),
  setLogin: () => {},
});
