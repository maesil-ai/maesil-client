import { useState, useEffect } from 'react';

export default function usePromise<Type>(promiseCreator: () => Promise<Type>, deps: React.DependencyList = []) {
  const [loading, setLoading] = useState<boolean>(true);
  const [content, setContent] = useState<Type>(null);
  const [error, setError] = useState<Error>(null);

  const process = async () => {
    try {
      const result = await promiseCreator();
      setContent(result);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    process();
  }, deps);

  return [loading, content, error] as [boolean, Type, Error];
}