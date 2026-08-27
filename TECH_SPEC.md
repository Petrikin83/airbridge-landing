# TECH_SPEC.md — Техническое задание: премиальный лендинг AirBridge®

## 1. Обзор проекта
Одностраничный премиальный лендинг (маркетинговая воронка) для технологии **AirBridge®**
компании **CDC — Cableway Development Company** (Bolzano, South Tyrol, Italy).

**Главная бизнес-цель:** эффектно презентовать AirBridge®, вызвать максимальное доверие
потенциальных B2B-заказчиков и провести их по воронке к целевому действию.

**Целевые действия (конверсия):**
1. Переход на головной сайт **https://cdc.company/** (основной CTA).
2. Отправка заявки на расчёт проекта (форма + fallback `info@cdc.company`).

**Аудитория:** B2B-заказчики — девелоперы luxury-недвижимости (Discovery Land Company),
операторы гига-проектов (Red Sea Global, NEOM, PIF-экосистема KSA), горные курорты,
промышленность/логистика, инфраструктурные операторы.

## 2. Технологический стек
- **HTML5 + CSS3 + vanilla JS** (без сборщика, без фреймворков) — быстрый деплой на GitHub Pages.
- Дизайн-токены CDC в `assets/css/cdc-tokens.css` (CSS-переменные).
- Локальные шрифты (Lato + Goodly) и иконки (Font Awesome 6.5.2) из `./assets/`.
- Локальные изображения/видео из `./assets/`.
- Отсутствие внешних CDN/трекеров/счётчиков.

## 3. Дизайн-система (на основе UI-кита CDC)
- **Акцент / CTA:** `#ff751f` (оранжевый).
- **Текст:** `#2e2e2e`; **фон светлый:** `#f3f4f5`; **тёмный акцент:** `#1e293b`.
- **Шрифты:** заголовки — `Goodly` (акцидентный); текст — `Lato` (400/500/700/900).
- **Кнопки:** оранжевый фон, белый текст, скругление 4px, паддинг ~0.85em 2.1em, стрелка-иконка
  после текста (стиль Divi `.et_pb_button`).
- **Логотип шапки:** `assets/images/cdc-logo-orange-full.png` → ссылка на `https://cdc.company/`.
- **Фавикон:** `assets/images/cdc-favicon-192.png` (+ 32/180).

## 4. Архитектура воронки (секции index.html)

Секции идут в следующем порядке (mobile-first, семантическая разметка):

1. **Header** — фиксированная шапка: логотип CDC (ссылка на cdc.company), навигация-якоря,
   CTA-кнопка «Get a quote / Request calculation».
2. **Hero** — премиальный заголовок «A new way to experience the view», подзаголовок про
   AirBridge®, фоновое видео `cdc-hero-video.mp4` (с poster + fallback-изображением), главная
   CTA «Discover AirBridge®» (на cdc.company/innovation) + вторичная «Request project calculation».
3. **Trust bar / Почему CDC** — блок креденшалов: +500% рост за 3 года, 200+ проектов, Top-3
   Европы (FT & Statista), Leader della Crescita 2026, >4000 м высота, $50M+ выручка 2025.
4. **Технология AirBridge®** — «Инновационность, безопасность, экономика, скорость монтажа»:
   - описание self-propelled технологии, патент WO2017064014, 52 инновации;
   - сетка параметров: длина — без лимита, угол — до 90°, нагрузка — до 40 т, пролёт — до 3 км,
     скорость — до 10 м/с;
   - 4 карточки-преимущества: CAPEX до −3×, OPEX до −70%, до 100% утилизация мощности,
     ускоренный ROI;
   - партнёрство Neology — 100% zero-emission автономия на аммиаке;
   - zero-footprint монтаж (вертолёты, без временных дорог).
5. **Применение технологии (Solutions)** — **строго 3 карточки:**
   1. **Passenger Ropeways** (пассажирские канатные дороги);
   2. **Material Ropeways** (грузовые канатные дороги);
   3. **Cable Cranes** (кабельные / канатные краны).
   Каждая карточка: изображение, заголовок, описание, 4–5 ключевых преимуществ, ссылка
   «Learn more →» на соответствующий раздел cdc.company.
6. **Интерактивная медиа-галерея** — демонстрация видео (airbridge-demo-1/2, cdc-hero-video)
   + просмотр PDF-презентаций (`airbridge_materials/presentations/*.pdf`), лайтбокс.
7. **Воронка конверсии** — форма «Расчёт проекта» (имя, компания, email, страна/тип объекта,
   сообщение) + кнопки «Перейти на головной сайт CDC» (на `https://cdc.company/`).
8. **Footer** — официальный подвал CDC: логотип, контакты (`info@cdc.company`,
   `39040 Neustatt 6, Aldein (BZ), Italy`), ссылки на cdc.company (Company, Innovation,
   Solutions, Contacts), соцсети.

## 5. CTA-стратегия и переходы на cdc.company
| CTA | Место | Действие |
|-----|-------|----------|
| «Discover AirBridge®» | Hero | Переход `https://cdc.company/innovation/` (новое окно) |
| «Request project calculation» | Hero / секция конверсии | Прокрутка к форме |
| «Go to CDC website» | Конверсия | `https://cdc.company/` (новое окно) |
| «Learn more» (3 карточки) | Solutions | `https://cdc.company/passenger-ropeways/`, `/material-ropeways/`, `/cable-cranes/` |
| Логотип шапки | Header | `https://cdc.company/` |
| Форма | Конверсия | Локальная валидация + mailto:`info@cdc.company` (fallback) |

Все внешние ссылки — `target="_blank" rel="noopener"`. JS-обработчик делает переходы
«бесшовными» (плавный, без рывка; при необходимости — предзагрузка не требуется).

## 6. Контентная база (источники фактов)
- `airbridge_materials/texts/CDC Red Sea Global- V5.txt` — УТП, экономика, креденшалы, KSA.
- `airbridge_materials/texts/Discovery Land Company V5.txt` — luxury-мобильность, slow luxury,
  ammonia/zero-emission, Chameleon-концепт.
- `airbridge_materials/texts/cdc-innovation.txt` — описание AirBridge® и параметры системы.
- `airbridge_materials/texts/cdc-{passenger-ropeways,material-ropeways,cable-cranes}.txt` —
  контент трёх карточек решений.

## 7. Адаптивность
- Mobile-first. Брейкпоинты: `480px`, `768px`, `980px`, `1280px`.
- Hero-заголовок — `clamp(40px, 7vw, 84px)`.
- Сетка карточек: 1 колонка (mobile) → 2 (tablet) → 3 (desktop).
- Header на mobile — компактный логотип + бургер-меню (нативный JS, `aria-expanded`).
- Фоновое видео на mobile — замена на статичный poster (экономия трафика).

## 8. Доступность и SEO
- Семантические заголовки h1 (Hero) → h2 (секции) → h3 (карточки).
- `alt`-тексты для изображений, `aria-label` для кнопок/иконок, `aria-live` для формы.
- Контраст текста ≥ WCAG AA; видимый `:focus-visible`.
- Мета-теги: `title`, `description`, `og:title`, `og:description`, `og:image`,
  `twitter:card`, canonical на `https://cdc.company/` (или на сам лендинг).
- `lang="en"` (контент англоязычный, под B2B-аудиторию CDC).
- JSON-LD `Organization` (CDC) со ссылкой на `https://cdc.company/`.

## 9. Структура файлов лендинга
```
D:\Airbridge_NEW_DeepSeek\
├─ index.html                  # лендинг (создаётся на Этапе 2)
├─ assets/
│  ├─ css/                     # cdc-tokens.css + custom landing.css (Этап 2)
│  ├─ js/                      # main.js (Этап 2) + эталонные скрипты CDC
│  ├─ fonts/                   # Lato, Goodly, Font Awesome
│  ├─ images/                  # логотипы, hero, обложки решений
│  └─ media/                   # видео (hero + demo)
├─ airbridge_materials/
│  ├─ texts/                   # извлечённые тексты (PDF + страницы CDC)
│  ├─ presentations/           # PDF клиента
│  └─ videos/                  # видео клиента
├─ scripts/                    # утилиты извлечения
├─ docs/                       # резерв/заметки
└─ *.md                        # PROJECT_RULES, MEMORY, TECH_SPEC, README, DEPLOY
```

## 10. Критерии готовности (Definition of Done)
- [ ] `index.html` свёрстан полностью (все 8 секций), без заглушек.
- [ ] Стили — чистые, на токенах CDC; нет неиспользуемых правил.
- [ ] JS — нативный, без ошибок в консоли; формы валидируются.
- [ ] Все ссылки на cdc.company корректны и открываются в новом окне.
- [ ] Адаптив проверен на 360/768/1024/1440 px.
- [ ] Локальный сервер на `http://localhost:8085` работает.
- [ ] `git init` выполнен, сделан первый коммит.

