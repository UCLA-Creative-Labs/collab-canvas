import { useState, useEffect } from 'react';

// Adapted from https://usehooks.com/useWindowSize/
export function useWindowSize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return null;
    }

    function handleResize() {
      setWindowSize(getSize());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export async function callApi(){
  const response = await fetch('http://129.146.146.29:3000/users');
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  console.log(body)
  return body;
};
