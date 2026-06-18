*Проект основан на [bulletproof-react](https://github.com/alan2207/bulletproof-react).*

## Запуск проекта

1. Установить зависимости `yarn install`
2. Скопировать .env.example в .env
3. Сгенерировать или обновить `api` с помощью команды `api:update`
4. Сгенерировать или обновить типы для i18n с помощью команды `i18n:generate-types`.
5. Запустить `yarn dev`

## Именование коммитов / веток

Ветки создаются по ключу задачи из трекера.

Например: `feature/GFK-70`.

Коммиты именуются по [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

При создании мердж реквеста, в заголовке должен быть указан номер задачи из трекера, отмечена галка squash commits.

Например: `feat: add new feature #GFK-70`.

## Именование файлов и папок

Имена файлов и папок - `kebab-case`.

Именование файлов в папках types, utils, constants - с постфиксом папки.

Например, `format.utils.ts`, `api.types.ts`.

## Именование переменных и типов

Имена переменных - `camelCase`, имена типов - `PascalCase`.

Енамы префиксируются буквой `E` для удобства поиска.

Например, `EColor`.

## Работа с переводами i18n

Для каждого роута из папки `src/app/routes` и каждой фичи из папки `src/app/features` создается отдельное пространство имен в файлах переводов в папке `public/locales`.  
  
Все остальные переводы хранятся в файле `common.json`.  

Имена ключей в переводах i18n `kebab-case`.  

Например `common: { some-description: 'Example' }`.  

При добавлении новых переводов, необходимо заново сгенерировать типы скриптом `i18n:generate-types`.  

Для корректной работы типизации ключей необходимо в хук `useTranslation` передавать пространства имен в виде массива, например `useTranslation([ELocalizationNamespace.AUTH, ELocalizationNamespace.COMMON])` даже если передаем всего одно пространство имен. Имена брать из файла [localization-namespaces.enums.ts](src/enums/localization-namespaces.enums.ts)  

Для удобной навигации и поиска переводов рекомендуется использовать плагин `EasyI18n` для WebStorm или `i18n-ally` для VSCode.
