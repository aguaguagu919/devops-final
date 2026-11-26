# DevOps Final Project

Сервис на Node.js 20 принимает HTTP-запросы на порту 3000. Prometheus опрашивает его каждые пять секунд, а Grafana получает метрики из Prometheus.

| Маршрут | Ответ |
| --- | --- |
| `GET /` | `DevOps Final Project` |
| `GET /health` | `{"status":"ok"}` |
| `GET /metrics` | Стандартные метрики Node.js и счётчик `http_requests_total` с меткой `route` |

## Запуск и проверка

```sh
docker compose up -d --build
docker compose ps
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/metrics
```

В Prometheus на http://localhost:9090/targets цель `app` должна получить статус `UP`. В Grafana на http://localhost:3001 источник Prometheus создаётся автоматически из `datasource.yml`. Запрос `up{job="app"}` возвращает 1 при успешном опросе.

## Развёртывание через Ansible

На Debian или Ubuntu запустите из корня репозитория:

```sh
ansible-playbook -i localhost, deploy.yml --ask-become-pass
```

Плейбук проверяет Docker и Compose, устанавливает недостающие компоненты, копирует приложение и конфигурацию в `/opt/devops-final` и запускает стек. Если порты заняты экземпляром из другого каталога, сначала остановите тот экземпляр командой `docker compose down` из его каталога. На проверенном стенде первый запуск завершился с `changed=5`, второй — с `changed=0`. Оба завершились с `failed=0`.

## CI/CD

Workflow запускается при push и pull request в `develop` и `main`. Сначала ESLint проверяет код, затем Jest проверяет маршруты, экспорт метрик и SQL-запрос к PostgreSQL 16. Ветка `main` требует прохождения `lint` и `test` перед слиянием. При push в `main` успешные проверки открывают публикацию образа с тегами `latest` и полным SHA коммита.

[Workflow](.github/workflows/ci-cd.yml) · [Запуски GitHub Actions](https://github.com/aguaguagu919/devops-final/actions/workflows/ci-cd.yml) · [Образ в GHCR](https://github.com/users/aguaguagu919/packages/container/package/devops-final)

## Скриншоты проверок

| Проверка | Результат |
| --- | --- |
| [Compose и три HTTP-маршрута](evidence/http.png) | Запущены app, prometheus и grafana. Приложение отвечает на все три маршрута. |
| [Цель в Prometheus](evidence/browser.png) | Для app:3000 отображается 1 / 1 up. |
| [Связь Grafana с Prometheus](evidence/monitor.png) | API Grafana на порту 3001 подтверждает успешный запрос к Prometheus. |
| [ESLint и Jest](evidence/tests.png) | Все четыре теста прошли, включая SQL-запрос. |
| [Первый запуск Ansible](evidence/first.png) | Плейбук развернул стек. |
| [Повторный запуск Ansible](evidence/again.png) | `changed=0`, `failed=0`. |
