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
62. **Визуальный аудит десктопа и мобильной версии, правки раскладки.**
    - **Пустая колонка.** `.ab-features` была сеткой `repeat(4, 1fr)`, а в блоках
      «100% Zero-Emission Autonomy» и «Boarding at Any Point» по 3 карточки → справа оставалась
      пустая колонка ~293px. Добавлен модификатор `.ab-features--trio`: 3 колонки на десктопе,
      2 колонки + полноширинная третья до 980px, 1 колонка на мобильных. Проверено:
      1440 → 3×397px, 1024 → 3×307px, 820 → 2×368px + 757px, 390 → 1×342px.
    - **Подпись Neology.** Перенесена по центру под сетку, контраст поднят с ~3:1
      (`rgba(255,255,255,.5)`) до ~7.4:1 (`rgba(255,255,255,.7)` на `#2e2e2e`).
    - **Горизонтальный скролл на мобильных (20px).** Причина — `translateX(±44px)` в
      `.ab-reveal--left/right` у невидимых ещё блоков. На ширине ≤1100px заменено на
      вертикальный сдвиг, добавлен `body { overflow-x: hidden }`. Итог: overflow = 0 на 390px.
    - **Таблица сравнения на мобильных.** `min-width: 560px` + горизонтальный свайп внутри
      `.ab-table-wrap`; ключевая колонка AirBridge закреплена справа (`position: sticky; right: 0`),
      чтобы преимущества оставались на экране при свайпе.
    - **Тап-таргеты и мелкая графика.** `.ab-solution__cta` → `min-height: 44px`;
      точки слайдера `rgba(255,255,255,.6)` + тень, нижний градиент фото усилен до 0.65.
    - **Контраст мелкого текста.** `.ab-features__note` и `.ab-tech__design-note`:
      `#8a8a8a` → `#666` (3.1:1 → 5.7:1 на светлом фоне, WCAG AA). Проверены также
      подписи наград (5.33), ISO (5.74), lead на тёмном (7.23), низ футера (4.99) — все ≥ 4.5.
    - Проверки после правок: `check_site.py` — OK, `node --check` — OK, CSS-скобки 255/255,
      якорная навигация не перекрывается фиксированной шапкой (секция встаёт на 72px).
63. **Финальный проход «до топ-уровня» (десктоп + мобайл + доступность).**
    - **Hero:** `min-height: min(78vh, 860px)` + вертикальное центрирование — 702px на экране
      900px вместо ~510px; на мобильных высота автоматическая.
    - **Trust bar:** «+500%» приведён к общей схеме (белые цифры, оранжевый юнит), как «200+»
      и «4,000m+».
    - **Boarding at Any Point:** заголовок центрирован (был единственным левым среди центрированных).
    - **Recognition:** сетка метрик `repeat(4, 1fr)` → `repeat(3, 1fr)` (3 метрики заполняют ряд;
      на ≤560px — одна колонка). Логотипы наград зафиксированы по высоте (64px), подписи выровнены.
    - **Showcase:** плеер ограничен 1040px и переведён на `aspect-ratio: 16 / 9`, под видео добавлена
      подпись (описание кадра, без новых фактов).
    - **Мобильная типографика:** на ≤560px заголовки секций выравниваются по левому краю —
      длинный лид больше не «центрированная рвань».
    - **Доступность:** skip-link (появляется по фокусу), `:focus-visible` кольцо, `theme-color`,
      `decoding="async"` у логотипов наград, поддержка `prefers-reduced-motion` — видео не
      автозапускается, показывается кнопка Play (проверено эмуляцией media-query).
    - **Контраст (WCAG AA):** новые токены `--cdc-orange-ink` (#b5470a — мелкий текст на светлом,
      5.4:1), `--cdc-orange-display` (#f05f00 — крупные акценты, 3.3:1), `--cdc-btn-ink` (#141414 —
      содержимое оранжевых плашек, 7.9:1). На них переведены кнопки, eyebrow, бренд-акцент,
      цифры спецификаций и таблица сравнения; тёмный глиф на оранжевых кнопках Play.
    - **Слайдеры:** `role="tablist"` → `role="group"` (ARIA-валидность); точка 10px с областью
      нажатия 22×22px через `::before`, активная — 22px.
    - **Футер:** `h4` → `h3` — исправлен порядок заголовков (h1 → h2 → h3).
    - **CLS:** у hero-видео зарезервировано соотношение сторон (`aspect-ratio: 16 / 9`) — устранён
      сдвиг макета при загрузке метаданных; локальный Lighthouse: Agentic Browsing 100.
    - **Lighthouse (desktop, строгий прогон с принудительно видимыми блоками):**
      Accessibility **100**, Best Practices **100**, SEO **100**, Agentic Browsing **100**, 0 ошибок.
    - Проверки: `check_site.py` — OK; `fact_index.py` — 44/44; `node --check` — OK;
      CSS-скобки 269/269; overflow на 1440 / 1024 / 820 / 390 = **0**.
64. **Мобильный редизайн по итогам исследования практик (25.10.2026).**
    - **Источники:** WCAG 2.2 SC 2.5.8 (target size ≥ 24×24 CSS px), web.dev «Responsive web
      design basics» (строка 70–80 символов, не скрывать контент, брейкпоинты по мере роста
      строки), Adrian Roselli «Tables, CSS Display Properties, and ARIA» (`display: flex/grid`
      ломают семантику таблицы → восстанавливать ролями `table/rowgroup/row/cell/columnheader`;
      содержимое таблицы нельзя переставлять через CSS).
    - **Сравнительная таблица:** на ≤720px — карточки по параметрам без горизонтального свайпа:
      название параметра, две колонки конкурентов (Conventional / 3S), выделенная полоса
      AirBridge®. Семантика сохранена ARIA-ролями, подписи значений — `data-label` + `::before`,
      порядок DOM не менялся (требование Roselli).
    - **Футер:** 958px → **676px**: Company/Solutions в две колонки, Contact на всю ширину,
      уменьшены отступы и высота нижней полосы.
    - **Мобильный ритм:** секции 32/36px, отступ заголовка 22px, лид 16px, карточки 22/20px,
      футер 44px сверху, спеки в 2 колонки (последняя — на всю ширину), tech-caption 13px.
    - **Слайдеры:** 14 точек не влезали в 360px и вылезали за экран → на ≤768px вместо точек
      компактный счётчик «N / 14», добавлен свайп (touchstart/touchend, порог 40px). Точки на
      десктопе: контейнер 24×24 (hit area), диск 10px, активная — пилюля 24×10.
    - **Факт-чек:** в проверку возвращён «Hybrid» (подтверждён 4 клиентскими источниками) —
      теперь **45/45** утверждений.
    - **Награды и метрики:** награды превращены в компактные строки (логотип 44px слева, подписи
      справа) — 510px → 224px; метрики — в один ряд из трёх (270px → 115px, значение 24px).
    - **Итог по высоте:** мобильная страница 15 162px → **13 616px** (футер −282, награды −286,
      метрики −155, спеки −180, ритм секций −300).
    - **Проверки:** Lighthouse **mobile** (строгий прогон со всеми видимыми блоками) —
      Accessibility 100 · Best Practices 100 · SEO 100 · Agentic 100; overflow 0 на 360 / 390 /
      768; `check_site.py` — OK; CSS-скобки 299/299.
65. **Оптимизация производительности под мобильный бюджет (25.10.2026).**
    - **Замеры (390px, без кэша):** первичная загрузка **4068 KB → 860 KB**, запросов 27 → **16**.
    - **Font Awesome** (2 CSS = 128 KB + шрифт 153 KB) заменён на `assets/css/icons.css`
      (сабсет из 19 используемых глифов) + `fa-solid-subset.woff2` — **3 KB**. Остальные FA-файлы
      остались в `assets/` как справочные, но не загружаются.
    - **`airbridge-module-clean.png`** 1331 KB → **WebP 72 KB** (`<picture>` + PNG-fallback),
      добавлены `loading="lazy" decoding="async"`.
    - **`Goodly-Regular.otf`** 292 KB → **WOFF2 64 KB** (в `fonts.css` woff2 первым, preload в head).
    - **Hero-видео:** для ≤768px отдельный `hero-pendulum-mobile.mp4` **412 KB** через
      `<source media="(max-width: 768px)">` (полный файл 1983 KB — только на десктопе).
    - **Слайдеры:** инициализация по `IntersectionObserver` (rootMargin 700px) + подгрузка по
      **2 кадра на слайдер** вместо 25 фото (6.08 MB) сразу; остальные — по мере показа.
    - **LCP:** постер hero вынесен в `preload` с `fetchpriority="high"`. Trace: LCP 375 → **336 ms**,
      render delay 328 → **293 ms**, CLS **0.00**.
    - **`scripts/optimize_assets.py`** — воспроизводимая генерация WebP, WOFF2, сабсета FA и
      мобильного видео (запуск: `python scripts/optimize_assets.py`).
    - **Чек-лист приёмки:** добавлен `docs/MOBILE_QA.md` (WCAG 2.2 / web.dev / Front-End-Checklist,
      матрица устройств, бюджет производительности, чек-лист регрессии).
    - Lighthouse mobile после оптимизаций: **100 / 100 / 100 / 100**.
66. **INP, чистка репозитория, фактический отчёт по мобильной приёмке (25.10.2026).**
    - **INP** измерен реальными кликами через DevTools Input: **60 мс** (порог «good» — 200 мс).
      Фазы: input delay **1 мс**, обработка **6 мс**, отрисовка **53 мс** → узкое место не JavaScript,
      оптимизация кода не требуется.
    - **Найдено и исправлено:** ссылки футера были высотой 17–22px (ниже минимума WCAG 2.2
      SC 2.5.8) → `min-height: 24px` для `.ab-footer__links a` и `.ab-footer__contact a/li`.
    - **`scripts/find_unused_assets.py`** (+ флаг `--delete`) — удалены **40 неиспользуемых файлов
      (4.4 МБ)**: эталонные Divi-стили, jQuery/плагины/MediaElement, лишние начертания Lato,
      полный Font Awesome (кроме build-входа `fa-solid-900.ttf`), демо-видео `airbridge-demo-1.mp4`.
      Повторный прогон: **0 лишних файлов**. Всё восстанавливается из истории git.
    - **`docs/MOBILE_QA_REPORT.md`** — фактический прогон чек-листа: ширины 360 / 390 / 768 / 1024 /
      1440 (overflow 0, таргеты ≥ 24px, таблица-карточки ≤720), Lighthouse mobile и desktop
      **100×4**, LCP **336 мс**, CLS **0.00**, INP **60 мс**, первичная загрузка **815 КБ / 17 запросов**.
    - После удаления: 0 битых запросов, Goodly/Lato загружаются, 25/25 иконок,
      `check_site.py` — OK, `fact_index.py` — 45/45.
67. **Троттлинг и отклик (25.10.2026).**
    - Прод под **Slow 4G + CPU ×4**: **LCP 1138 мс**, CLS **0.00** — в «зелёной» зоне Core Web Vitals.
    - Устранён **forced reflow 577 мс**: обработчики скролла (шапка, индикатор hero) переведены на
      `requestAnimationFrame` + ранний выход при неизменном состоянии.
    - `font-display: block → swap` у сабсета иконок (инсайт FontDisplay).
    - На ≤768px отключён `backdrop-filter` у шапки (дорог на мобильных GPU), фон непрозрачный.
    - Повторный трейс: инсайтов **ForcedReflow** и **FontDisplay** больше нет.
68. **Рефакторинг скриптов по архитектурному графу (25.10.2026).**
    - **До:** в `graphify-out/GRAPH_REPORT.md` god nodes — `kb()`, пять разных `main()`,
      `load_sources()` как мост между сообществами; в скриптах дублировались `ROOT`, UTF-8-обвязка,
      чтение/запись файлов; `extract_pdf_text.py` и `extract_html_text.py` содержали пути `D:\...`.
    - **Общий слой:** добавлен `scripts/_lib.py` — `ROOT`, `path()`, `rel()`, `enable_utf8()`,
      `read_text()`, `write_text()`, `file_kb()`, `iter_files()`.
    - **Активные скрипты** переведены на `_lib` и единый контракт `main() -> int` (коды 0/1/2,
      `sys.exit(main())`): `check_site.py` разбит на `check_references/check_anchors/check_markup`,
      `fact_index.py` — на `load_sources/hits_for/report_claims/report_benchmarks`.
    - **Пути:** `extract_pdf_text.py` ищет PDF в `airbridge_materials/presentations/`, затем в
      `Materials from Galiya/`; `extract_html_text.py` берёт каталог из `CDC_SITE`
      (по умолчанию `D:\Clone_CDC\site`, только чтение).
    - **Оркестратор:** `scripts/run_checks.py` — сайт + факт-чек + лишние ассеты одной командой.
    - **Документация:** `scripts/README.md` — карта скриптов, статусы active/archive, конвенции,
      типовые сценарии, соответствие сообществ графа файлам.
    - **Детерминизм:** `optimize_assets.py` собирает WOFF2 с `recalcTimestamp=False` — повторный
      прогон даёт тот же SHA-256.
    - **Проверка эквивалентности:** `extract_pptx_text.py` + `extract_pdf_text.py` пересобрали 5
      текстов **без diff** в git; `run_checks.py` — **ALL CHECKS PASSED** (site OK, 45/45,
      0 лишних файлов).
    - **Граф после:** **236 узлов / 383 связи / 16 сообществ**; god nodes — `enable_utf8()` (19),
      `rel()` (13), `read_text()` (12), `write_text()` (10), `path()` (8); в топе один `main()`
      вместо пяти. Каталог `graphify-out/` добавлен в `.gitignore` (артефакт генерации).
69. **Технический этап закрыт (26.10.2026).** Клиент подтвердил канон **60° / 8 м/с**
    (как в выгрузке CDC) — значения на лендинге остаются без изменений. Сайт полностью готов:
    прод `9ae4d06`, Lighthouse mobile/desktop **100/100/100/100**, Core Web Vitals
    LCP 336 мс / CLS 0.00 / INP 60 мс, первичная загрузка 815 КБ / 17 запросов.
    В этой итерации код не менялся — только фиксация решения и статуса в документации.

70. **Apple-манифест Эмиля Ковальски + аудит и правки UI по 7 правилам (26.10.2026).**
    - **Манифест:** `.skills/apple-design.md` перезаписан дословным текстом заказчика
      («Apple Design Manifest by Emil Kowalski», 7 правил, 1001 байт, UTF-8 без BOM). Именно этот
      файл — источник правды; текст не редактируется «по вкусу».
    - **Правила проекта:** в `PROJECT_RULES.md` усилено системное правило («при любом аудите UI/UX
      фронтенда и правках стилей строго руководствоваться правилами из `.skills/apple-design.md`»),
      §8 переписан в чек-лист по 7 правилам с конкретными параметрами (damping 1.0/0.8,
      response 0.3/0.4 с, 150 мс фейды, 1px рамки при `prefers-contrast`).
    - **Аудит (по графу + grep):** шапка была почти непрозрачной (0.92), а на ≤768 px
      `backdrop-filter` **отключался** (строки 1835–1845) — нарушение правила 4; радиусы задавались
      вручную (4/6/8/10/12/20/50/999 px) — «жёсткая» шкала; слайдер перелистывался по `touchend`
      без 1:1-трекинга (правило 1), фейд 0.9 с и reveal 0.7 с (правило 2), доты анимировали `inset`
      (не composited, правило 5), `prefers-contrast` отсутствовал (правило 7), reduced-motion глушил
      всё в 0.001 мс вместо 150 мс фейдов и не отключал автопрокрутку (правило 6).
    - **Шапка (правило 4):** `rgba(243,244,245,0.72)` + `backdrop-filter: saturate(180%) blur(20px)`
      (+`-webkit-`), состояние `is-scrolled` — `rgba(255,255,255,0.78)` + мягкая тень; мобильная
      версия больше не глушит стекло (`0.78` / `is-scrolled` `0.84`); добавлены fallback
      `@supports not ((backdrop-filter: blur(1px)) ...)` → непрозрачный фон и
      `prefers-reduced-transparency: reduce` → `#f7f7f8` без блюра.
    - **Радиусы:** в `cdc-tokens.css` введена шкала `--cdc-radius-xs/sm/md/lg/xl/pill` = 6/10/14/20/28/999;
      все хардкоды заменены токенами (кнопки → pill, карточки → md, spec-чипы → sm, hero-видео → lg,
      иконки 52/54/56 px → md, доты/счётчик → pill, skip-link → sm).
    - **Движение (правило 2):** токены `--cdc-ease-out` (damping 1.0), `--cdc-ease-momentum`
      (damping ≈0.8, только жесты), `--cdc-dur-sheet` 300 мс, `--cdc-dur-momentum` 400 мс,
      `--cdc-dur-fast` 120 мс; мобильное меню — `transform 300ms cubic-bezier(0.34,1.32,0.64,1)`
      с задержкой `visibility`; фейд слайдов 0.9 с → 400 мс; reveal 0.7 с/26 px → 400 мс/16 px;
      `transition: all` и `transition: top` заменены на конкретные свойства.
    - **Composited-only (правило 5):** доты слайдера переводятся `transform: scaleX(2.4)` вместо
      `inset`; skip-link выезжает `translateY` вместо `top`; добавлены `will-change` для кнопок,
      карточек, подчёркивания навигации, панели меню, активного слайда и reveal.
    - **Слайдер (правила 1–3):** вместо `touchstart/touchend` — Pointer Events + `setPointerCapture`,
      гистерезис 8 px (вертикальный скролл выигрывает), трекинг 1:1 (`translate3d` текущего слайда),
      подтягивание соседнего кадра (peek), нелинейный rubber-band за 60 % ширины
      (`limit + over·dim·0.55/(dim + 0.55·over)`), коммит по скорости > 0.35 px/мс или 22 % ширины
      со сменой направления по знаку скорости; отмена возвращает кадр без «кирпичной стены»;
      клавиатура ←/→, `role="group"`, `aria-roledescription="carousel"`, `tabindex="0"`;
      автопрокрутка встаёт на hover/focus и **не запускается** при reduced motion.
    - **Меню (правила 1, 6):** Escape закрывает и возвращает фокус на бургер, клик вне панели
      закрывает, при закрытии выставляется `inert` (панель вне tab-порядка), на десктопе `inert`
      снимается по `matchMedia`-change; закрытая панель дополнительно `visibility: hidden`.
    - **Reduced motion (правило 6):** глобально 150 мс и только opacity/цвета, reveal без сдвига,
      меню — cross-fade 150 мс вместо слайда, `scroll-behavior: auto`.
    - **High contrast (правило 7):** `@media (prefers-contrast: more)` — шапка непрозрачная с рамкой
      `1px #141414`, у карточек/кнопок/таблицы рамка вместо теней.
    - **Проверка:** `node --check` — OK; `python scripts/run_checks.py` — **ALL CHECKS PASSED**
      (site OK, 45/45, 0 лишних файлов); Lighthouse desktop и mobile — **100/100/100/100**
      (60 аудитов, 0 падений); вычисленные стили: моб. шапка `rgba(243,244,245,0.78)` +
      `saturate(1.8) blur(20px)`, кнопка `999px`, карточка `14px`, spec `10px`, горизонтальный
      overflow **0**; drag −30 px → ровно −30 px, коммит 4→5 слайд, ArrowRight 5→6,
      резист 320 px → −258 px (0.81), моб. меню: `inert true → false → true`, фокус возвращается
      на бургер.

71. **Исправлен «залипающий» оранжевый кружок на видео Showcase (26.10.2026).**
    - **Симптом:** в секции Showcase поверх видео оставался оранжевый круг play-кнопки —
      и после запуска воспроизведения, и на паузе.
    - **Причина:** в `main.js` было **два** обработчика одного и того же видео. Старый блок
      (`Gallery feature video (play/pause)`) переключал play/pause, но класс `is-playing` вешал на
      саму кнопку, тогда как CSS ждал его на контейнере `.ab-gallery__feature`; оверлей
      `.ab-gallery__play` (`inset: 0` + затемняющая подложка) поэтому не скрывался. Новый
      обработчик дублировал клик и сразу ставил паузу.
    - **Исправление:** дублирующий блок удалён. Один обработчик: клик → `muted = false` + `play()`,
      класс `is-playing` на `.ab-gallery__feature`, `aria-label` меняется на «Pause video»;
      повторный клик по кнопке или по кадру → `pause()` и возврат оверлея. Добавлена защита от
      самопереключения (игнор клика с самой кнопки + окно 350 мс), потому что событие `play`
      может сработать раньше всплытия клика.
    - **CSS:** `.ab-gallery__feature.is-playing .ab-gallery__play { opacity: 0; pointer-events: none }`;
      при `:focus-visible` кнопка снова видима (клавиатура не теряет фокус), `cursor: pointer`
      по кадру, переход 200 мс на `--cdc-ease-out`.
    - **Проверка:** реальный клик (desktop 1440) и Enter (mobile 390): `paused false`, `muted false`,
      `currentTime` растёт, оверлей `opacity 0`, `aria-label="Pause video"`; повторный Enter/клик —
      `paused true`, оверлей `opacity 1`, `aria-label="Play video"`; `node --check` — OK,
      `run_checks` — ALL CHECKS PASSED, Lighthouse desktop/mobile — **100/100/100/100**.

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

## Расхождения в данных (закрыто)

- **Макс. угол подъёма:** cdc.company → «до 90°», материалы клиента (Red Sea Global V5,
  Discovery Land Company V5, выгрузка CDC) → «до 60°».
- **Скорость:** cdc.company → «до 10 м/с», материалы клиента → «до 8 м/с».
- **ИТОГ (подтверждено клиентом 26.10.2026):** канон лендинга — **60° и 8 м/с** «как в выгрузке CDC».
  Значения используются в `.ab-hero__specs`, `.ab-spec__value` и таблице сравнения и **изменению
  не подлежат**.
- Расхождение с сайтом cdc.company (90°/10 м/с) считается **осознанным**: лендинг опирается на
  материалы клиента, а не на публичный сайт. Любое изменение — только по новому письменному
  подтверждению и с добавлением источника в `airbridge_materials/texts/` (иначе `fact_index.py`
  покажет «NOT FOUND»).

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

**Технический этап закрыт 26.10.2026. Сайт полностью готов и опубликован.**

- [x] Этап 1: материалы отсортированы и изучены.
- [x] Этап 1: UI-кит CDC извлечён в `./assets/`.
- [x] Этап 1: системные документы созданы.
- [x] Этап 2: `index.html` свёрстан, CSS/JS подключены (vanilla, без сборщика).
- [x] Контент приведён к канону клиента: **60° / 8 м/с** / 40 т / 3 км, Neology (аммиак),
      ItalDesign, ISO 9001/14001/45001, проекты KSA.
- [x] Канон подтверждён клиентом (26.10.2026): 60° и 8 м/с «как в выгрузке CDC» — без изменений.
- [x] Локальный сервер: `python -m http.server 8085` → http://localhost:8085 (HTTP 200).
- [x] Проверки одной командой: `python scripts/run_checks.py` — ALL CHECKS PASSED.
- [x] Статическая проверка: `check_site.py` — OK (19 локальных ссылок, 7 якорей, 2 видео).
- [x] Факт-чек: `fact_index.py` — **45/45 утверждений подтверждены** (бенчмарки отдельно).
- [x] Деплой: **https://petrikin83.github.io/airbridge-landing/** (GitHub Pages, `main`),
      сборка `9ae4d06`.
- [x] Lighthouse mobile и desktop — **100/100/100/100**; CWV: LCP 336 мс · CLS 0.00 · INP 60 мс.
- [x] Первичная загрузка (390px) — **815 КБ / 17 запросов**, 0 битых запросов.
- [x] Доступность: WCAG AA, тап-таргеты ≥24px (важные — 44px), skip-link, focus-visible,
      поддержка `prefers-reduced-motion`.
- [x] Мобильная приёмка: `docs/MOBILE_QA.md` (чек-лист) + `docs/MOBILE_QA_REPORT.md` (факт).
- [x] Скрипты: общий слой `scripts/_lib.py`, оркестратор `scripts/run_checks.py`,
      карта `scripts/README.md`.
- [x] Документация актуализирована: `MEMORY.md`, `README.md`, `DEPLOY.md`, `docs/` (26.10.2026).

**Вне объёма технического этапа (по запросу):**
- Аналитика/счётчики (GA4 / Яндекс.Метрика) — только по явному согласованию.
- Проверка на реальных устройствах и скринридером — нужен доступ к девайсу
  (сценарии в `docs/MOBILE_QA.md` §7).
- Кастомный домен, форма заявки на сайте, RU-версия — по отдельному решению.


