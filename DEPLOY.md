# DEPLOY.md — Деплой на GitHub Pages

## Текущее состояние (проверено 31.08.2026)

| Параметр | Значение |
|---|---|
| Репозиторий | `https://github.com/Petrikin83/airbridge-landing` (public, default branch `main`) |
| Прод | `https://petrikin83.github.io/airbridge-landing/` — HTTP 200 |
| Источник публикации | ветка `main`, папка `/ (root)` |
| Синхронизация | прод-HTML идентичен локальному (`index.html`, 714 строк) |
| Не проверяется по API | `GET /repos/.../pages` без авторизации возвращает 404, поэтому статус сборки подтверждается прямым запросом к прод-URL |

## Предпосылки
- Локальный Git установлен.
- Аккаунт GitHub и репозиторий (например, `airbridge-landing`).
- Проект — статический (HTML/CSS/JS/медиа), сборки не требуется.

## 1. Инициализация репозитория (Этап 2)

```powershell
cd D:\Airbridge_NEW_DeepSeek
git init
git add .
git commit -m "feat: AirBridge premium landing page (stage 2)"
```

## 2. Подключение удалённого репозитория (выполнено)

```powershell
git remote -v
# origin  https://github.com/Petrikin83/airbridge-landing.git (fetch)
# origin  https://github.com/Petrikin83/airbridge-landing.git (push)
```

## 3. GitHub Pages (включено)

1. На GitHub откройте репозиторий → **Settings** → **Pages**.
2. В блоке **Build and deployment**:
   - Source: **Deploy from a branch**;
   - Branch: **main**, папка: **/ (root)**.
3. Нажмите **Save**. Через 1–2 минуты сайт доступен по адресу:
   `https://petrikin83.github.io/airbridge-landing/`.

Проверка после пуша (сравнивает прод с локальной версией):

```powershell
$local = Get-Content index.html -Raw
$prod  = (Invoke-WebRequest 'https://petrikin83.github.io/airbridge-landing/' -UseBasicParsing).Content
"local lines: $($local.Split("`n").Count) | prod lines: $($prod.Split("`n").Count)"
"ISO block on prod: $($prod -match 'ab-iso')"
```

## 4. Обновление сайта

```powershell
git add .
git commit -m "chore: update content"
git push
```

## Важные замечания

### Крупные медиафайлы
- `assets/videos/airbridge-motion-01.mp4` — 6.2 МБ, `assets/media/` — до 3.0 МБ на файл,
  изображения `assets/images/` — 8.5 МБ суммарно. Лимит GitHub Pages — 100 МБ на файл.
- Презентации клиента (PDF ~4.8 МБ, PPTX до ~20 МБ) в репозитории **не хранятся**: в
  `airbridge_materials/texts/` лежат только текстовые выжимки, сами файлы — в локальной папке
  `Materials from Galiya/` (в `.gitignore`).
- Для ускорения загрузки видео сжато и имеет `poster`, фото решений оптимизированы.
- При необходимости тяжёлые видео можно вынести на отдельный CDN/хостинг и сослаться на них.

### Абсолютные ссылки на cdc.company
- Все переходы на головной сайт — абсолютные: `https://cdc.company/...` (см. `TECH_SPEC.md`).

### Проверка перед пушем
```powershell
# локальный сервер
python -m http.server 8085
# статические проверки проекта
python scripts/check_site.py
python scripts/fact_index.py
node --check assets/js/main.js
# открыть http://localhost:8085 и проверить консоль на ошибки
```
