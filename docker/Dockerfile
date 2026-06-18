FROM node:22 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY packages ./packages
RUN yarn install --frozen-lockfile

COPY ./public ./public
COPY ./src ./src
COPY ./.eslintrc.cjs ./
COPY ./.prettierignore ./
COPY ./.prettierrc ./
COPY ./index.html ./
COPY ./orval.config.ts ./
COPY ./tsconfig.json ./
COPY ./vite.config.ts ./

ARG VITE_APP_API_URL
ENV VITE_APP_API_URL=$VITE_APP_API_URL

RUN yarn build

FROM nginx:1.25

RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
