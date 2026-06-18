import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { api } from '@/lib/api-client';

export const customAxiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = api({ ...config, cancelToken: source.token }).then(({ data }) => data);

  // eslint-disable-next-line
  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;
