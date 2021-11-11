import { useState } from 'react';

export function useLogin(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
] {
  const [isLogin, setLogin] = useState<boolean>(
    document.cookie.includes('isLogin'),
  );

  return [isLogin, setLogin];
}
