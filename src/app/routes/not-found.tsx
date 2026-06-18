import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';

export const NotFoundRoute = () => {
  return (
    <div>
      <h1>Страница не найдена</h1>
      <p>Запрошенная страница не существует.</p>
      <Link to={paths.home.getHref()} replace>
        Вернуться на главную
      </Link>
    </div>
  );
};
