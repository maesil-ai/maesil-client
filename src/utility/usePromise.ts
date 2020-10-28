import { raiseError } from 'actions';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function usePromise<Type>(promiseCreator: () => Promise<Type>, deps: React.DependencyList = []) {
  const [loading, setLoading] = useState<boolean>(true);
  const [content, setContent] = useState<Type>(null);
  const dispatch = useDispatch();

  const process = async () => {
    try {
      const result = await promiseCreator();
      setContent(result);
    } catch (error) {
      dispatch(raiseError(`페이지를 불러오면서 오류가 발생했습니다: ${error}`));
      console.log('While getting promise: ', promiseCreator);
      console.log('We got an error: ', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    process();
  }, deps);

  return [loading, content] as [boolean, Type];
}