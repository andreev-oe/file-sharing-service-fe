import { Link } from '@/components/ui/link';

export const MainErrorFallback = () => {
  return (
    <div role={'alert'}>
      <h2>Что-то пошло не так</h2>
      <Link to={'#'} onClick={() => window.location.assign(window.location.origin)}>
        Обновить страницу
      </Link>
    </div>
  );
};
