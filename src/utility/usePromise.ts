import { raiseError } from 'actions';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function usePromise<Type>(promiseCreator: () => Promise<Type>, deps: React.DependencyList = [], ifError: 'abort' | 'ignore' = 'abort') {
  const [loading, setLoading] = useState<boolean>(true);
  const [content, setContent] = useState<Type>(null);
  const [error, setError] = useState<Error>(null);
  const dispatch = useDispatch();

  const process = async () => {
    try {
      const result = await promiseCreator();
      setContent(result);
    } catch (error) {
      if (ifError == 'abort')
        dispatch(raiseError(`페이지를 불러오면서 오류가 발생했습니다: ${error}`));
      setError(error);
      console.log('While getting promise: ', promiseCreator);
      console.log('We got an error: ', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    process();
  }, deps);

  return [loading, content, error] as [boolean, Type, Error];
}