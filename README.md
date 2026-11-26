# Итоговый проект DevOps

    GET / возвращает название проекта, /health показывает состояние приложения, /metrics экспортирует метрики. Счётчик http_requests_total группирует запросы по маршруту. Неизвестные пути попадают в группу other.

    Запуск в Docker: `docker compose up -d --build`. Приложение доступно на http://localhost:3000, Prometheus на http://localhost:9090, Grafana на http://localhost:3001. В Grafana источник Prometheus создаётся автоматически. Запрос PromQL `up{job="app"}` должен вернуть 1.

    Для установки на Debian или Ubuntu запустите `ansible-playbook -i localhost, deploy.yml --ask-become-pass`. Плейбук собирает проект в /opt/devops-final. Перед этим остановите экземпляр Compose, если те же порты заняты другим учебным стеком. На повторном запуске без изменений ожидается changed=0.


    Используется Node.js 20. Для локальной проверки выполните `npm ci`, `npm run lint`, `npm test`. Для интеграционного теста задайте PGHOST, PGPORT, PGDATABASE, PGUSER и PGPASSWORD. Без PGHOST запускаются только тесты HTTP-обработчиков.

    Workflow проверяет push и pull_request для main и develop. Job test выполняет SQL-запрос к PostgreSQL. После успешных проверок push в main публикует ghcr.io/<владелец>/<репозиторий> с тегами latest и полным SHA коммита.

    Для размещения на GitHub нужно создать одноимённый репозиторий, отправить main и develop, включить для main обязательные проверки lint и test и требование pull request. В локальной копии Git правила платформы и публикация Packages не применяются.
