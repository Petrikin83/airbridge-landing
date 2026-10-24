# AirBridge® — Premium Landing Page

Премиальный сайт-воронка для технологии **AirBridge®** компании **CDC — Cableway Development
Company** (Bolzano, South Tyrol, Italy). Проект презентует инновационную self-propelled
канатную технологию B2B-заказчикам и ведёт их к целевому действию — переходу на головной сайт
**https://cdc.company/** или заявке на расчёт проекта.

**Прод:** https://petrikin83.github.io/airbridge-landing/ (GitHub Pages, ветка `main`).

## Быстрый старт (локально)

```powershell
# из корня проекта D:\Airbridge_NEW_DeepSeek
python -m http.server 8085
```

Затем откройте **http://localhost:8085** в браузере.

## Проверки качества

```powershell
python scripts/check_site.py    # локальные ассеты, якоря, разметка (h1/alt/source)
python scripts/fact_index.py    # факт-чек страницы по клиентским материалам
node --check assets/js/main.js  # синтаксис JS
```

`fact_index.py` читает только `airbridge_materials/texts/*.txt` — то есть презентации и тексты
клиента; собственные документы проекта доказательством не считаются. Тексты из PDF/PPTX
пересобираются командами `python scripts/extract_pdf_text.py` и `python scripts/extract_pptx_text.py`.

## Структура проекта

| Путь | Назначение |
|------|-----------|
| `index.html` | Лендинг (10 секций: tech, comparison, zero-emission, solutions, applications, projects, recognition, gallery, CTA) |
| `assets/css/` | Дизайн-токены CDC, локальные шрифты, иконки, стили лендинга |
| `assets/js/main.js` | Нативная логика: шапка, бургер, reveal, счётчики, видео, слайдеры |
| `assets/fonts/` | Lato, Goodly, Font Awesome 6.5.2 (локально) |
| `assets/images/` | Логотипы, награды, постеры, 25 кадров решений (`solutions/`) |
| `assets/media/` | Видео hero и демо-ролик клиента |
| `assets/videos/` | Ролик секции Showcase |
| `airbridge_materials/texts/` | Текстовые выжимки клиентских PDF/PPTX и сайта CDC (источники факт-чека) |
| `scripts/` | Извлечение материалов, обработка фото/видео и проверки (`check_site.py`, `fact_index.py`) |
| `PROJECT_RULES.md` | Стандарты и барьер безопасности |
| `MEMORY.md` | Оперативный лог, карта активов, канон фактов |
| `TECH_SPEC.md` | Детальное ТЗ воронки |
| `DEPLOY.md` | Деплой на GitHub Pages и проверка прода |

## Канон фактов

- Угол подъёма **до 60°**, скорость **до 8 м/с**, нагрузка **до 40 т**, пролёт **до 3 км**,
  длина без фиксированного лимита — по презентациям клиента.
- Патент **WO2017064014**, **52** инновации, соответствие **EU Regulation 2016/424**.
- **ISO 9001:2015 / ISO 14001:2015 / ISO 45001:2018** — из `CDC Corporate Presentation 2026`.
- Zero-emission автономия на аммиаке — партнёрство с **Neology** (Швейцария).
- cdc.company указывает 90° и 10 м/с; расхождение и порядок его правки описаны в `MEMORY.md`.

## Дизайн-система (UI-кит CDC)

- **Акцент / CTA:** `#ff751f` (оранжевый)
- **Текст:** `#2e2e2e` · **фон:** `#f3f4f5`
- **Шрифты:** `Goodly` (заголовки) + `Lato` (текст)
- Токены собраны в `assets/css/cdc-tokens.css`.

## Ограничения

- `D:\Clone_CDC` — **READ-ONLY** эталон UI-кита. Любые изменения в нём запрещены.
- Все файлы проекта создаются только в `D:\Airbridge_NEW_DeepSeek`.

## Статус

- [x] **Этап 1** — материалы отсортированы, UI-кит извлечён, концепт сформирован.
- [x] **Этап 2** — `index.html` свёрстан, CSS/JS подключены (vanilla), сервер на 8085 работает.
- [x] Контент приведён к канону клиента (60° / 8 м/с / 40 т / 3 км, ISO, Neology, ItalDesign, KSA).
- [x] Проверки: `check_site.py` — OK; `fact_index.py` — 44/44 утверждения подтверждены.
- [x] Деплой на GitHub Pages — https://petrikin83.github.io/airbridge-landing/ (HTTP 200).
- [ ] (по запросу) аналитика/счётчики — только по явному согласованию.
