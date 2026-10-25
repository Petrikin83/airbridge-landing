# DEPLOY.md — Деплой на GitHub Pages

## Текущее состояние (проверено 25.10.2026)

| Параметр | Значение |
|---|---|
| Репозиторий | `https://github.com/Petrikin83/airbridge-landing` (public, default branch `main`) |
| Прод | `https://petrikin83.github.io/airbridge-landing/` — HTTP 200 |
| Источник публикации | ветка `main`, папка `/ (root)`, `build_type: legacy` |
| Статус Pages API | `status: built`, `https_enforced: true` |
| Последняя сборка | определяется командой `gh api .../pages/builds/latest` (на 25.10.2026 — `cec6d19`) |
| Анонимный `/pages` | возвращает **404**: эндпоинт администрирования репозитория не отдаётся без токена (GitHub намеренно отвечает 404, а не 401) |

Авторизованная проверка (GitHub CLI уже настроен: аккаунт `Petrikin83`, токен в системном keyring,
scopes `repo`, `workflow`, `gist`, `read:org`):

```powershell
gh auth status
gh api repos/Petrikin83/airbridge-landing/pages --jq '{status, html_url, build_type, source, https_enforced}'
gh api repos/Petrikin83/airbridge-landing/pages/builds/latest --jq '{status, commit, created_at}'
```

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
- **Hero-видео:** десктоп `assets/media/hero-pendulum.mp4` (~1.9 МБ), мобильный вариант
  `hero-pendulum-mobile.mp4` (~0.4 МБ) подключается через `<source media="(max-width: 768px)">`.
- **Рендер модуля:** `airbridge-module-clean.webp` (72 КБ) через `<picture>` с PNG-fallback.
- **Фото решений:** 25 кадров (~6 МБ) в `assets/images/solutions/` — грузятся лениво
  (2 кадра на слайдер, остальные по мере показа).
- **Шрифты:** Goodly `woff2` (64 КБ, preload), Lato `woff2`, сабсет иконок
  `fa-solid-subset.woff2` (3 КБ) + `assets/css/icons.css`.
- **Первичная загрузка** на 390px без кэша — ~860 КБ (Lighthouse mobile: 100/100/100/100).
- Презентации клиента (PDF ~4.8 МБ, PPTX до ~20 МБ) в репозитории **не хранятся**: в
  `airbridge_materials/texts/` лежат только текстовые выжимки, сами файлы — в локальной папке
  `Materials from Galiya/` (в `.gitignore`).
- Пересобрать оптимизированные ассеты (WebP, WOFF2, сабсет иконок, мобильное видео):
  `python scripts/optimize_assets.py`.
- Проверить/вычистить лишние файлы: `python scripts/find_unused_assets.py` (с флагом `--delete`).
- Приёмка мобильной версии: `docs/MOBILE_QA.md`, фактические результаты — `docs/MOBILE_QA_REPORT.md`.
- Лимит GitHub Pages — 100 МБ на файл; текущие медиа укладываются с большим запасом.

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
