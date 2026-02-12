# Backend для Japan Travel Map

## Описание

Node.js + Express + SQLite бэкенд для сохранения посещённых городов.

## Установка

```bash
cd backend
npm install
```

## Запуск

### Разработка
```bash
npm run dev
```

### Продакшен
```bash
npm start
```

## API Endpoints

- `GET /api/visits` - Получить все посещённые города
- `POST /api/visits` - Добавить посещение (body: { cityId, notes })
- `DELETE /api/visits/:cityId` - Удалить посещение
- `GET /api/visits/:cityId` - Проверить посещён ли город
- `GET /api/health` - Проверка работоспособности

## База данных

SQLite хранится в `data/visits.db`

## Структура таблицы

```sql
CREATE TABLE visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  city_id TEXT NOT NULL UNIQUE,
  visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);
```
