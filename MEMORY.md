# MEMORY.md — Оперативный лог (AirBridge Landing)

> Назначение: фиксировать каждый шаг, найденные CSS-классы, шрифты, структуру и принятые
> решения, чтобы работа была воспроизводимой и понятной при возврате к проекту.

## Хронология работы

### [Этап 1] 2026-08-27 — Организация, аудит, извлечение UI-кита

1. **Разведка структуры.**
   - Рабочая папка `D:\Airbridge_NEW_DeepSeek` содержала только `Materials from Galiya`.
   - `D:\Clone_CDC` — автономная статическая копия сайта `https://cdc.company/`
     (WordPress + тема Divi 4.27.6). Веб-корень — `D:\Clone_CDC\site\`.
   - README CDC подтверждает: 13 страниц, все CSS/JS/шрифты скачаны, шрифт Lato офлайн.

2. **Материалы клиента отсортированы** в `./airbridge_materials/`:
   - `presentations/` — 2 PDF (CDC Red Sea Global V5, Discovery Land Company V5).
   - `videos/` — 2 видео WhatsApp (переименованы в `airbridge-demo-1.mp4`, `airbridge-demo-2.mp4`).
   - `texts/` — извлечённый текст PDF (`*.txt`) и текст страниц CDC (`cdc-*.txt`).

3. **Извлечён дизайн-язык CDC (ключевые токены).**
   - Акцент / CTA: `#ff751f` (оранжевый) — ссылки, рамка меню, активный фильтр.
   - Текст/заголовки: `#2e2e2e`.
   - Светлый фон: `#f3f4f5` (body, header).
   - Доп. тёмный акцент: `#1e293b` (активный фильтр галереи PFG).
   - Шрифты: **Lato** (текст, веса 100–900 + italic) и **Goodly** (акцидентный/заголовочный,
     `Goodly-Regular.otf`), иконки **ETmodules** + **Font Awesome 6.5.2**.
   - Логотип шапки: `wp-content/uploads/2026/03/cdc-logo-orange-full.png` (1465×377).
   - Hero-рендер: `002CDC-render-new-logo-1.png`; фоновое видео: `CDC-Video-Homepage.mp4`.

4. **Скопированы активы UI-кита** в `./assets/` (см. карту ниже).

5. **Ключевые CSS-классы Divi (для понимания структуры):**
   - Сетка: `.et_pb_section`, `.et_pb_row`, `.et_pb_column`, `.et_pb_column_1_3` и т.п.
   - Контент: `.et_pb_text`, `.et_pb_image`, `.et_pb_module`.
   - Кнопка: `.et_pb_button` (+ `.et_pb_button_module_wrapper`, `.et_pb_button_alignment_*`,
     атрибут `data-icon` для стрелки).
   - Типографика: `body{font-size:16px; line-height:1.5em; color:#2e2e2e}`.

6. **Созданы системные документы:** `PROJECT_RULES.md`, `TECH_SPEC.md`, `MEMORY.md`,
   `.gitignore`, `README.md`, `DEPLOY.md`; токены — `assets/css/cdc-tokens.css`.

### [Этап 2] 2026-08-27 — Вёрстка и сборка

7. **Проверка окружения:** git 2.45.1, Python 3.14.4, Node 24.15.0, порт 8085 свободен.
8. **Исправлены пути Font Awesome:** `../webfonts/` → `../fonts/` в `font-awesome-all.min.css`
   (шрифты FA лежат в `assets/fonts/`).
9. **Создан `assets/css/fonts.css`** — локальные @font-face: Lato (300/400/700/900 + italic 400)
   и Goodly (`Goodly-Regular.otf`).
10. **Создан `assets/css/landing.css`** (~24 КБ) — премиум-стили на токенах CDC: header, hero,
    trust-bar, technology, solutions (3 карточки), gallery, conversion/form, footer, modal,
    reveal-анимации, адаптив (1100/980/768/560), `prefers-reduced-motion`.
11. **Создан `assets/js/main.js`** — нативный JS: скролл-состояние шапки, бургер-меню,
    reveal (IntersectionObserver), play/pause видео галереи, валидация формы + mailto fallback +
    модалка успеха.
12. **Свёрстан `index.html`** — секции: Header, Hero (фоновое видео), Trust, Technology,
    Solutions (**строго 3 карточки**: Passenger Ropeways, Material Ropeways, Cable Cranes),
    Media gallery, Conversion (форма), Footer, модалка успеха. Outdoor Lift **исключён**.
13. **Валидация:** HTML парсится (1 h1, 6 section, 3 article, 1 form, 2 video), JS — `node --check`
    без ошибок, CSS-скобки сбалансированы (196/196), все referenced-ассеты на месте.
14. **Git:** `git init`, ветка переименована в `main`, первый коммит `1374896`.
15. **Сервер:** `python -m http.server 8085` (фоновый процесс) → `http://localhost:8085`
    (HTTP 200; CSS/JS/шрифты/изображения/видео отдаются со статусом 200).

### [Правки] 2026-08-27 — Hero + Solutions (стратегические)

16. **Hero:** фон заменён на `airbridge-demo-1.mp4` (1280×720, 10с — самый качественный
    демо-ролик; poster извлечён из него в `hero-poster.jpg`). H1 перестроен: бренд
    «AirBridge®» крупно (Goodly) + таглайн «Next-Generation Cableway Technology».
    CTA1 «Explore AirBridge Solutions» → `#solutions`; CTA2 «Go to Main Website (cdc.company)»
    → `https://cdc.company/` (new tab).
17. **Solutions:** в 3 карточках — мини-слайдеры по 4 фото (auto-fade 4с + точки-индикаторы);
    «Learn more» → кнопка, открывающая модалку с характеристиками, видео и галереей (4 фото).
    Outdoor Lift по-прежнему исключён.
18. **Докачаны фото:** passenger-3.jpeg, material-2.jpg/4.jpeg, cablecrane-2/15/16.png.

## Карта выкачанных активов (из D:\Clone_CDC → D:\Airbridge_NEW_DeepSeek\assets)

### CSS (assets/css/)
| Файл | Источник |
|------|----------|
| `et-core-unified-9.min.css` | `site/wp-content/et-cache/9/` (ядро Divi, главная страница) |
| `et-core-unified-tb-335605-deferred-9.min.css` | `site/wp-content/et-cache/9/` (отложенные стили) |
| `et-divi-dynamic-tb-335605-9.css` | `site/wp-content/et-cache/9/` (динамические стили темы) |
| `font-awesome-all.min.css` | `site/_external/cdnjs.../font-awesome/6.5.2/css/all.min.css` |
| `font-awesome-v4-shims.min.css` | `site/_external/cdnjs.../font-awesome/6.5.2/css/v4-shims.min.css` |
| `fonts-google-lato.css` | `site/_external/fonts.googleapis.com/font-666bb0e746.css` |
| `fonts-google-lato-400.css` | `site/_external/fonts.googleapis.com/font-1c58e616f3.css` |
| `pfg-gallery.css`, `pfg-hover.css`, `pfg-lightbox.css` | `site/wp-content/plugins/portfolio-filter-gallery/public/css/` |
| `image-map-hotspots-common.css` | `site/wp-content/plugins/image-map-hotspots/output-common-css.css` |
| `cdc-tokens.css` | Создан вручную — сводка дизайн-токенов CDC |

### JS (assets/js/)
| Файл | Источник |
|------|----------|
| `divi-scripts.min.js` | `site/wp-content/themes/Divi/js/scripts.min.js` |
| `jquery.min.js`, `jquery-migrate.min.js` | `site/wp-includes/js/jquery/` |
| `mediaelement-and-player.min.js`, `mediaelement-migrate.min.js`, `wp-mediaelement.min.js` | `site/wp-includes/js/mediaelement/` |
| `pfg-gallery.js`, `pfg-lightbox.js` | плагин portfolio-filter-gallery |
| `imh-main-output-file-pro.js`, `zoom-in-out-drag.js` | плагин image-map-hotspots |
| `jquery.fitvids.js`, `motion-effects.js` | `site/wp-content/themes/Divi/includes/builder/feature/dynamic-assets/assets/js/` |

### Fonts (assets/fonts/)
- `Goodly-Regular.otf` — акцидентный шрифт CDC.
- `lato-S6u*.woff2` (18 файлов) — Lato 100/300/400/700/900 normal+italic (latin/latin-ext).
- `fa-brands-400`, `fa-regular-400`, `fa-solid-900`, `fa-v4compatibility` (ttf + woff2) — Font Awesome 6.5.2.

### Images (assets/images/)
`cdc-logo-orange-full.png` (логотип шапки), `cdc-favicon-*.png` (32/180/192),
`cdc-logo-leader-crescita.png` (бейдж Leader della Crescita), `cdc-hero-render.png`
(render с логотипом), `cdc-airbridge-technology.png`, `cdc-innovation-airbridge.jpeg`,
`cdc-passenger-ropeways-cover.jpg`, `cdc-material-ropeways.jpg`, `cdc-cable-cranes.jpeg`,
`cdc-passenger-ropeways.png`, `cdc-passenger-ropeways-tech.png`,
`cdc-material-ropeways-tech.jpg`, `cdc-cables-v4.png`.

### Media (assets/media/)
- `cdc-hero-video.mp4` — фоновое видео главной страницы CDC (13.5 МБ).
- `airbridge-demo-1.mp4`, `airbridge-demo-2.mp4` — видео клиента.

## Ключевые факты / УТП (извлечены из материалов)

**Технические параметры AirBridge® (источник — сайт CDC, раздел Innovation):**
- Длина системы: без фиксированного лимита.
- Макс. угол подъёма: **до 90°** (в PDF клиента — до 60°, см. расхождение ниже).
- Полезная нагрузка: **до 40 тонн**.
- Пролёт между опорами: **до 3 км**.
- Рабочая скорость: **до 10 м/с** (в PDF клиента — до 8 м/с).
- Защищено патентом **WO2017064014** + **52 технических инновации**.

**Экономика (общее в PDF и на сайте):**
- До **100%** утилизации мощности (традиционные канатки — <10% средней загрузки).
- До **3×** ниже CAPEX.
- До **70%** ниже OPEX.
- Ускоренный ROI.

**Креденшалы CDC:**
- 20+ лет экспертизы, **200+ проектов**, **$50M+ выручки в 2025**.
- **+500%** рост за 3 года.
- Top-3 самых быстрорастущих компаний Европы (Financial Times & Statista, март 2026).
- Самая быстрорастущая компания Италии (Leader della Crescita 2026, Il Sole 24 Ore & Statista).
- Проекты на высотах **> 4000 м**.
- Первый и единственный международный ropeway-подрядчик в гига-проектах KSA (NEOM Trojena).
- Zero-footprint монтаж: аэральная установка вертолётами, без временных дорог.
- Партнёрство с **Neology** (Швейцария): 100% zero-emission автономия на **аммиаке**.

## Расхождения в данных (важно!)
- **Макс. угол подъёма:** сайт CDC → «до 90°», PDF Red Sea Global V5 → «до 60°».
  → На лендинге использовать значение с сайта CDC (90°) как официальное; при необходимости
  уточнить у клиента.
- **Скорость:** сайт CDC → «до 10 м/с», PDF → «до 8 м/с».
  → Использовать 10 м/с (сайт), уточнить у клиента.

## Принятые решения
1. Лендинг — **vanilla HTML/CSS/JS** без сборщика (быстрый деплой на GitHub Pages).
2. Использовать **дизайн-токены CDC** (оранжевый/тёмный/светлый, Lato + Goodly), но вёрстка
   самостоятельная, не копирует разметку Divi (лёгкая и чистая).
3. Все медиа и шрифты — локально в `./assets/` (без внешних CDN).
4. Три карточки решений (строго): Passenger Ropeways, Material Ropeways, Cable Cranes.
5. CTA-действия: «Перейти на cdc.company» (внешняя ссылка) + форма «Расчёт проекта»
   (в Этапе 2 — локальная обработка + mailto/info@cdc.company как fallback).

## Статус
- [x] Этап 1: материалы отсортированы и изучены.
- [x] Этап 1: UI-кит CDC извлечён в `./assets/`.
- [x] Этап 1: системные документы созданы.
- [x] Этап 2: `index.html` свёрстан, CSS/JS подключены (vanilla).
- [x] Этап 2: `git init` + коммит `1374896` (ветка `main`).
- [x] Этап 2: локальный сервер запущен — http://localhost:8085
- [ ] (опционально) деплой на GitHub Pages — см. `DEPLOY.md`.


