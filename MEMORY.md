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

### [Правки] 2026-08-27 — AirBridge® Visual Audit (критично)

19. **Проблема:** карточки содержали фото обычных канаток и 3D-рендеры — инженерно неверно.
    AirBridge® — самодвижущийся гусеничный модуль (tracked drive unit), едущий по НЕПОДВИЖНОМУ
    канату. Найден новый материал: `AirBridge by CDC - V7.pptx` (19.7 МБ).
20. **Извлечение:** скрипты `scripts/extract_airbridge_images.py` (PyMuPDF + zipfile + Pillow)
    и `scripts/map_pptx.py` (сопоставление картинок ↔ текст слайдов). Извлечено 89 изображений;
    по контексту слайдов отобраны **10 аутентичных** кадров гусеничного механизма →
    `scripts/_extract/` → `scripts/prepare_airbridge_images.py` (RGBA→белый) → `assets/images/`.
    - Passenger (3): `airbridge-passenger-1/2/3.jpg` (модуль + кабины).
    - Material (4): `airbridge-material-1/2/3.png` + `-4.jpg` (модуль + контейнеры/бадьи).
    - Cable Cranes (3): `airbridge-cable-1.png` (схема) + `-2/-3.jpg` (кран/тяжёлая техника).
21. **Видео:** `WhatsApp Video 2026-08-14 at 23.37.53 (1).mp4` → `assets/videos/airbridge-motion-galiya.mp4`
    (12.9 МБ); poster `airbridge-motion-poster.jpg`. Назначен основным в секции «See AirBridge in Motion».
    Hero-видео НЕ менялось.
22. **Результат:** в слайдерах/модалках 0 ссылок на старые фото канаток; слайдеры 3/4/3 кадра.
    Утилиты сохранены в `scripts/`, промежуточные кадры в `scripts/_extract/` (gitignored).

### [Правки] 2026-08-27 — Видео + фото + социальные доказательства

23. **Видео (точный тайминг):** ffmpeg freezedetect/scene-детект показал статичную паузу
    ~0.4–5.0 с; скрипт `scripts/trim_video.py` подрезал `airbridge-motion-galiya.mp4` со
    старта **5.0 с** (47.4 → 42.4 с, 6.2 МБ), poster пересобран. Из секции «See AirBridge in
    Motion» удалены дублирующие карточки «Project demo reel» и «Short demo» — остался плеер +
    2 PDF-презентации; сетка `.ab-gallery__side` переведена в 1 колонку (2 строки).
24. **Расширение фото:** набор дополнен кадрами image6/image15/image17 (urban, environmental,
    field). Слайдеры и модалки: Passenger **4** / Material **4** / Cable Cranes **5** кадров
    (всего 13 аутентичных кадров гусеничного модуля из `AirBridge by CDC - V7.pptx`).
25. **Соц.доказательства:** из Clone_CDC скопированы логотипы наград
    (`cdc-award-ft.png` — FT & Statista Top-3 Europe, `cdc-award-winner-2026.png`,
    `cdc-logo-leader-crescita.png`). Добавлена секция **«Proven Engineering & Recognition»**:
    3 карточки (Patented Tracked System / International Safety Compliance / Years of Engineering
    Excellence) + 4 метрики (+500%, $50M+, 200+, 52) + 3 баннера наград.

### [Правки] 2026-08-27 — Сортировка архива + стилистика

26. **Фото-архив:** созданы `assets/images/solutions/{passenger_ropeways, material_ropeways,
    cable_cranes}`. Скрипт `scripts/sort_photos.py` разложил **45 файлов**: 13 аутентичных
    кадров (airbridge-*) + CDC-оригиналы по паттернам. **СТОП-ТОЧКА** — папки для ручной
    курации (gitignored, не привязаны к слайдерам).
27. **Награды (единообразие):** карточка FT («Ranked 3rd in Europe») переведена с чёрного на
    белый фон; белый логотип FT конвертирован в тёмный монохром (`cdc-award-ft.png`); всем
    3 наградам добавлены подписи. Блок наград теперь единый светлый.
28. **Отступы:** сокращён «воздух» — `.ab-section` 56/8/110 → 44/6/78, `.ab-section-head`
    36/5/60 → 28/4/44, `.ab-features` 40/5/64 → 28/3.5/46, hero 130/90 → 120/70, trust-bar 40 → 30.

### [Правки] 2026-08-27 — Финальная привязка отобранных фото

29. **Финализация:** отобранные пользователем кадры из `solutions/` обработаны скриптом
    `scripts/finalize_photos.py` — нормализация имён + оптимизация (JPEG q82, макс. 1600px,
    RGBA→белый). **21 файл** разложен в `assets/images/` (суммарно ~4.5 МБ вместо ~30 МБ).
30. **Привязка:** слайдеры и модалки обновлены на финальный набор — Passenger **5**,
    Material **8**, Cable Cranes **8** кадров. Все 32 ссылки на изображения валидны (0 битых).
31. **Очистка:** удалены 22 осиротевших файла изображений (~18 МБ), не используемых нигде.

### [Правки] 2026-08-28 — Упрощение воронки: без форм и модалок

32. **Стратегия.** Лендинг переведён с локальной формы заявки на прямую воронку B2B-трафика
    на cdc.company: форма расчёта, модалка успеха и модалки «Learn more» удалены.
33. **index.html.** Шапка: CTA «Get a quote» → «Visit CDC Website» (external); в nav добавлен
    пункт «Recognition», удалён «Contact». Conversion/form заменён финальным блоком `.ab-cta`
    (#visit) со списком преимуществ и кнопкой на cdc.company. Удалены SUCCESS MODAL и
    SOLUTION MODAL, кнопки «Learn more» в карточках решений.
34. **main.js.** Удалены валидация формы + mailto-фолбэк, модалка успеха, данные и логика
    solution-модалок. Остались: скролл-шапка, бургер, reveal, play/pause видео, слайдеры.
35. **landing.css.** Добавлены стили `.ab-cta` и `.ab-btn--cta`; удалены мёртвые стили
    `.ab-convert`, `.ab-form`, `.ab-modal`, `.ab-smodal`, `.ab-solution__link` и их media-ветки.
    Скобки сбалансированы (198/198).
36. **Изображение.** `cdc-airbridge-technology.png` → `airbridge-module-clean.png`
    (flood-fill белого фона из `cdc-airbridge-technology.jpeg`, `scripts/remove_white_bg.py`,
    RGBA 1512×1600).
37. **Валидация.** `node --check` OK; HTML — 7 section / 3 article / 0 form / 1 h1 / 2 video;
    40 локальных ссылок без битых (2 PDF с пробелами в именах валидны).

### [Аудит] 2026-08-28 — Мульти-агентный аудит + точечные правки

38. **Hero (УТП за 3 сек).** Подзаголовок теперь явно описывает ключевое отличие —
    «self-propelled drive unit travelling along a stationary cable».
39. **Фото-архив.** Из слайдеров удалены неаутентичные кадры (3D-рендеры `passenger-render-*`,
    AI-рендер `material-render-ai`, generic-crane `cable-crane-*`/`cable-cranes`,
    `material-crane-desert`, `material-ropeways-cdc-4`). Остались только кадры гусеничного
    модуля: Passenger 2 / Material 4 / Cable Cranes 4.
40. **Воронка.** В каждую карточку решения возвращена ссылка-выход на cdc.company
    (`.ab-solution__cta` → passenger-ropeways / material-ropeways / cable-cranes).

### [Правки] 2026-08-28 — Финальная сборка страницы (10:33–21:22)

41. **Полная сборка (`daf325c`).** Лендинг доведён до цельного состояния: header, dark-hero,
    trust-bar, technology, solutions, recognition, gallery, финальный CTA (`#visit`), footer;
    навигация и внешние ссылки ведут на cdc.company.
42. **Типографика и мобильный hero (`6731520`, `602576d`).** Полностью оранжевый «AirBridge»,
    убран дублирующий тег, компактные кнопки на мобильных, перенос описания hero, кадрирование
    видео под мобильный экран.
43. **Анимации и видео (`e4e48c0`, `698e90a`).** Boomerang-видео в hero, кнопки из hero убраны,
    видео не обрезается на мобильных, добавлены scroll-reveal анимации; шапка сужена,
    заголовочный блок переведён в серый с оранжевым акцентом.
44. **UI/UX-полировка (`de0b22b`, `7a9e5da`).** Уменьшен hero-title, решения сведены к
    **2 карточкам** (Passenger & Material Ropeways + Cable Cranes), гармонизированы отступы;
    исправлена маршрутизация изображений слайдеров.
45. **Seamless hero + жёсткая привязка фото (`199d2ee`, `b26cd1b`).** Бесшовная «сцена» hero,
    скрипты `scripts/route_slider_images.py` и `scripts/sync_exact_user_paths.py` — фотографии
    берутся строго из заданных папок на диске D:; тёмный high-tech hero.

### [Правки] 2026-08-29 — Фото, вес страницы, полировка

46. **Фото из папок пользователя (`ef6722a`, `77d2caa`, `force_user_folders.py`,
    `hard_reset_photos.py`).** Убрана овальная виньетка, секции стыкуются бесшовно, слайдеры
    жёстко перезаписаны кадрами из указанных папок.
47. **Скорость загрузки (`73c3cb4`, `compress_solutions_images.py`).** Фото решений сжаты
    (например, 8.99 МБ → 313 КБ), в hero добавлена high-tech display-карточка.
48. **Чистка UI (`3a14a32`).** Убраны бейджи 01/02 и подпись поверх видео, выровнена мобильная
    типографика.
49. **Финальная полировка (`e8b8c74`, `rename_png_to_jpg.py`).** Анимированные счётчики метрик
    в `main.js`, hover-glow эффекты, расширения ассетов приведены к реальному формату (png→jpg).

### [Правки] 2026-08-30 — Контент по канону, сравнение, KSA, факт-чек

50. **Канон контента (`72643cd`).** Значения приведены к материалам клиента: **60° угол подъёма
    и 8 м/с** (вместо 90°/10 м/с с сайта CDC), Neology (аммиак), ItalDesign, ISO. Добавлены блоки
    «The Global Opportunity» (рынок), миссия/технология, «Key Applications». Обновлены meta/OG/
    Twitter/canonical (`https://petrikin83.github.io/airbridge-landing/`). Видео переименовано
    `airbridge-motion-galiya.mp4` → `airbridge-motion-01.mp4`. PDF-презентации удалены из
    репозитория (их текстовые выжимки остались в `airbridge_materials/texts/`).
51. **Сравнение и Zero-Emission (`01ceb95`).** Таблица сравнения (Conventional / 3S / AirBridge),
    блок «100% Zero-Emission Autonomy» (аммиак, Neology), проекты KSA (NEOM Trojena, AlUla,
    Soudah Peaks, Caspian), `robots.txt`, мобильные фиксы.
52. **Строгий факт-чек (`bd34973`, `scripts/fact_index.py`).** Утверждения сверены с локальными
    материалами, неподтверждённые формулировки убраны.
53. **Брендинг и мобильное видео (`c128bd2`).** Возвращено видео в мобильном hero, «AirBridge®»
    выделен оранжевым через `.ab-brand` во всех заголовках.

### [Правки] 2026-08-31 — ISO-блок

54. **ISO-блок (`2101935`).** В «Proven Engineering & Recognition» возвращён блок
    `ISO 9001 · ISO 14001 · ISO 45001` (+ стили `.ab-iso`).

### [Правки] 2026-10-25 — проверки, документация, чистка, autoplay-fallback

55. **Источник ISO восстановлен.** Добавлен `scripts/extract_pptx_text.py` (текст PPTX →
    `airbridge_materials/texts/`). Извлечены 3 источника: `AirBridge V1`, `AirBridge by CDC - V7`,
    `CDC Corporate Presentation 2026 (1)`. ISO подтверждён дословно: «ISO 9001:2015 Quality
    Management», «ISO 14001:2015 Environmental Management», «ISO 45001:2018 Occupational Health
    & Safety». **Важно:** ISO-блок был «не подтверждён» только потому, что этот источник не был
    извлечён в текстовый слой.
56. **`scripts/fact_index.py` переработан.** Читает только клиентские материалы
    (`airbridge_materials/texts/`); наши `MEMORY.md`/`TECH_SPEC.md` больше не считаются
    доказательством. Вывод принудительно в UTF-8 (раньше падал с `UnicodeEncodeError` на `×`/`°`).
    Список утверждений приведён к текущей странице (убраны 90°/10 м/с), отраслевые бенчмарки
    таблицы сравнения вынесены в `BENCHMARKS`. Итог прогона: **44/44 утверждения подтверждены**.
57. **`scripts/check_site.py` добавлен.** Проверяет наличие всех локальных ассетов, совпадение
    якорей, ровно один `<h1>`, `alt` у изображений, `<source>` у видео. Текущий прогон:
    16 локальных ссылок, 7 якорей, 2 видео — OK.
58. **Проверка прода.** `https://petrikin83.github.io/airbridge-landing/` — HTTP 200, `<title>`
    совпадает, 714 строк HTML идентичны локальной версии; CSS/JS/видео/robots.txt отдаются 200;
    `node --check assets/js/main.js` — OK. Сервер для локальной проверки: `python -m http.server 8085`.
59. **Чистка ассетов.** Удалены 11 изображений (~2.6 МБ), на которые больше нет ссылок ни в
    `index.html`, ни в `main.js`, ни в `landing.css`: `airbridge-cable-1/2/3.jpg`,
    `airbridge-material-2/3/4.jpg`, `airbridge-passenger-1/3.jpg`, `cable-airbridge.jpg`,
    `cdc-airbridge-technology.jpeg`, `material-hero-module-mountain.jpg`. Восстанавливаются из
    истории git (до коммита с чисткой).
60. **Авторизация GitHub и Pages API.** `gh` 2.92.0 уже авторизован: аккаунт **Petrikin83**,
    токен в системном keyring, scopes `repo`, `workflow`, `gist`, `read:org`. Причина ответа
    **404 без авторизации**: эндпоинт `/repos/{owner}/{repo}/pages` относится к администрированию
    репозитория и анонимно не отдаётся (GitHub отвечает 404, а не 401, чтобы не раскрывать
    настройки репозитория). С токеном: `status: built`, `build_type: legacy`,
    `source: main /`, `https_enforced: true`; последняя сборка — коммит `0aaa5de`.
61. **Hero-видео: fallback для заблокированного autoplay.** Симптом «видео не воспроизводится»:
    файл валиден (H.264 High, yuv420p, 1280×720, 24 fps, faststart, движение по всем 10 с), но
    браузер блокирует автозапуск (iOS Low Power Mode, экономия трафика, политика autoplay) —
    элемент в `readyState 4`, при этом `paused: true`, и без кнопки виден только постер.
    Исправлено: `preload="auto"`, `webkit-playsinline`, `disablepictureinpicture`, кнопка
    `.ab-hero__play` и логика в `main.js`:
    - `playing` → кнопка скрывается; `pause` после старта → показывается;
    - `loadeddata`/`load` + 400 мс проверяют `paused` и `readyState`, чтобы не показывать кнопку
      поверх реально играющего видео;
    - повторный `play()` по первому `pointerdown`/`touchstart`/`scroll`.
    Проверено двумя сценариями на локальной и прод-сборке: (1) отказ `play()` + `pause` →
    кнопка 68×68 видна, клик запускает видео и скрывает кнопку; (2) обычная загрузка → видео
    играет, кнопка скрыта.

## Карта выкачанных активов (из D:\Clone_CDC → D:\Airbridge_NEW_DeepSeek\assets)

### CSS (assets/css/)

На странице подключены только: `cdc-tokens.css`, `fonts.css`, `font-awesome-all.min.css`,
`font-awesome-v4-shims.min.css`, `landing.css`. Остальные файлы ниже — эталонные стили CDC
(скопированы для сверки, из `index.html` не загружаются).

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

На странице подключён только `main.js` (vanilla). Остальные файлы — эталонные скрипты CDC
(jQuery, Divi, плагины галереи), не подключаются и служат только референсом.

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

### Images (assets/images/) — 36 файлов (~8.5 МБ после чистки 25.10)

Корень:
- `cdc-logo-orange-full.png` — логотип шапки и футера.
- `cdc-favicon-32/180/192.png` — фавиконы.
- `cdc-hero-render.png` — изображение для OG/Twitter.
- `airbridge-module-clean.png` — модуль без фона (блок технологии).
- `cdc-award-ft-2026.png`, `cdc-award-winner-2026.png`, `cdc-logo-leader-crescita.png` — награды.
- `hero-poster.jpg`, `airbridge-motion-poster.jpg` — постеры видео hero и showcase.

`solutions/passengers_material/` — 14 кадров, `solutions/cable_cranes/` — 11 кадров.
Пути жёстко зашиты в `SOLUTION_IMAGES` (`assets/js/main.js`), поэтому слайдеры показывают
строго «свои» категории (в канатных кранах нет пассажирских кабин и наоборот).

### Media / Videos
- `assets/media/hero-pendulum.mp4` (2.0 МБ) — фоновое видео hero.
- `assets/media/airbridge-demo-1.mp4` (3.0 МБ) — исходный демо-ролик клиента (на странице не используется).
- `assets/videos/airbridge-motion-01.mp4` (6.2 МБ) — основной ролик секции Showcase
  (обрезан с 5.0 с через `scripts/trim_video.py`, постер `airbridge-motion-poster.jpg`).

### Скрипты (scripts/)
- Извлечение материалов: `extract_pdf_text.py`, `extract_pptx_text.py`, `extract_html_text.py`,
  `extract_airbridge_images.py`, `map_pptx.py`.
- Фотографии: `sort_photos.py`, `prepare_airbridge_images.py`, `remove_white_bg.py`,
  `finalize_photos.py`, `route_slider_images.py`, `sync_exact_user_paths.py`,
  `force_user_folders.py`, `hard_reset_photos.py`, `compress_solutions_images.py`,
  `rename_png_to_jpg.py`.
- Видео: `trim_video.py`.
- Проверки качества: `fact_index.py` (факт-чек по клиентским материалам),
  `check_site.py` (ссылки, якоря, разметка).

## Ключевые факты / УТП (извлечены из материалов)

**Технические параметры AirBridge® (канон лендинга — презентации клиента):**
- Длина системы: без фиксированного лимита.
- Макс. угол подъёма: **до 60°**.
- Полезная нагрузка: **до 40 тонн**.
- Пролёт между опорами: **до 3 км**.
- Рабочая скорость: **до 8 м/с**.
- Защищено патентом **WO2017064014** + **52 технических инновации**.
- Соответствие **EU Regulation 2016/424**.

**Сертификации (подтверждено `CDC Corporate Presentation 2026 (1).pptx`):**
- **ISO 9001:2015** — Quality Management.
- **ISO 14001:2015** — Environmental Management.
- **ISO 45001:2018** — Occupational Health & Safety.

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

- **Макс. угол подъёма:** cdc.company → «до 90°», презентации клиента (Red Sea Global V5,
  Discovery Land Company V5) → «до 60°».
- **Скорость:** cdc.company → «до 10 м/с», презентации клиента → «до 8 м/с».
- **Решение (коммит `72643cd`, «align content to canon»):** на лендинге используются значения из
  презентаций клиента — **60° и 8 м/с**. Они фигурируют в `.ab-hero__specs`, `.ab-spec__value`
  и в таблице сравнения.
- Если клиент подтвердит 90°/10 м/с как официальные, обновить эти три места **одновременно**
  и перепрогнать `python scripts/fact_index.py` (в клиентских материалах есть только 60°/8 м/с,
  поэтому значения 90°/10 м/с потребуют нового источника).

## Отраслевые бенчмарки (не заявления клиента)
- Таблица сравнения содержит ориентиры по традиционным канатным дорогам (до 5 км) и 3S (до 1.5 км
  пролёт). В клиентских материалах этих цифр нет — это общеотраслевые значения, поэтому в
  `fact_index.py` они вынесены в отдельный блок `BENCHMARKS` и не считаются «неподтверждёнными».

## Принятые решения
1. Лендинг — **vanilla HTML/CSS/JS** без сборщика (быстрый деплой на GitHub Pages).
2. Использовать **дизайн-токены CDC** (оранжевый/тёмный/светлый, Lato + Goodly), но вёрстка
   самостоятельная, не копирует разметку Divi (лёгкая и чистая).
3. Все медиа и шрифты — локально в `./assets/` (без внешних CDN).
4. Карточки решений: **2** — «Passenger & Material Ropeways» и «Cable Cranes» (объединены
   в коммите `de0b22b`); раньше было три отдельные карточки.
5. CTA-действия: единая воронка на cdc.company (внешние ссылки в шапке, hero и финальном CTA).
   Локальная форма/модалки удалены (см. правки 2026-08-28).

## Статус

- [x] Этап 1: материалы отсортированы и изучены.
- [x] Этап 1: UI-кит CDC извлечён в `./assets/`.
- [x] Этап 1: системные документы созданы.
- [x] Этап 2: `index.html` свёрстан, CSS/JS подключены (vanilla, без сборщика).
- [x] Контент приведён к канону клиента: 60° / 8 м/с / 40 т / 3 км, Neology (аммиак),
      ItalDesign, ISO 9001/14001/45001, проекты KSA.
- [x] Локальный сервер: `python -m http.server 8085` → http://localhost:8085 (HTTP 200).
- [x] Статическая проверка: `python scripts/check_site.py` — OK (16 ссылок, 7 якорей, 2 видео).
- [x] Факт-чек: `python scripts/fact_index.py` — **44/44 утверждения подтверждены**
      (бенчмарки таблицы сравнения вынесены отдельно).
- [x] Деплой: **https://petrikin83.github.io/airbridge-landing/** (GitHub Pages, ветка `main`,
      HTTP 200, контент идентичен локальному).
- [x] Документация актуализирована: `MEMORY.md`, `README.md`, `DEPLOY.md` (25.10.2026).
- [x] Hero-видео: fallback-кнопка при блокировке autoplay + повторный запуск по первому жесту.
- [x] GitHub Pages проверен через авторизованный API (`gh api .../pages`) — статус `built`.
- [ ] (по запросу) аналитика/счётчики — только по явному согласованию.
- [ ] (по подтверждению клиента) возможный перевод канона на 90°/10 м/с — см. раздел расхождений.


