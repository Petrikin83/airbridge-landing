# scripts/ — карта скриптов и правила

Каталог содержит одноразовые утилиты (история работ) и **активные** скрипты, которые входят в
рабочий процесс проекта. Документ поддерживается вместе с кодом.

## Принципы

- **Python 3.14**, стандартная библиотека; сторонние пакеты только там, где без них нельзя:
  `Pillow`, `PyMuPDF (fitz)`, `fontTools+brotli`, `beautifulsoup4+lxml`, `ffmpeg` (CLI).
- **Общий слой** — `_lib.py`: `ROOT`, `path()`, `rel()`, `enable_utf8()`, `read_text()`,
  `write_text()`, `file_kb()`, `iter_files()`. Дублировать эти функции в скриптах не нужно.
- **Никаких жёстких путей** (`D:\...`) в активных скриптах — только `_lib.path(...)` и переменные
  окружения (например, `CDC_SITE`).
- **Контракт запуска**: `main() -> int` и `if __name__ == "__main__": sys.exit(main())`.
  Коды выхода: `0` — успех, `1` — проверка не прошла, `2` — нет входных данных/зависимостей.
- **UTF-8 вывод** через `enable_utf8()` (иначе Windows-консоль cp1251 падает на `×`/`°`).

## Активные скрипты

| Скрипт | Назначение | Команда |
|---|---|---|
| `run_checks.py` | все проверки разом (сайт + факты + лишние ассеты) | `python scripts/run_checks.py` |
| `check_site.py` | локальные ссылки, якоря, разметка (h1/alt/source) | `python scripts/check_site.py` |
| `fact_index.py` | 45 утверждений страницы против клиентских материалов | `python scripts/fact_index.py` |
| `find_unused_assets.py` | аудит файлов в `assets/`, на которые ничего не ссылается (`--delete`) | `python scripts/find_unused_assets.py` |
| `optimize_assets.py` | WebP для рендера, WOFF2 для Goodly, сабсет FA, 720p hero-видео | `python scripts/optimize_assets.py` |
| `extract_pdf_text.py` | PDF → `airbridge_materials/texts/` (ищет `presentations/`, затем `Materials from Galiya/`) | `python scripts/extract_pdf_text.py` |
| `extract_pptx_text.py` | PPTX → `airbridge_materials/texts/` | `python scripts/extract_pptx_text.py` |
| `extract_html_text.py` | тексты CDC-сайта (read-only) → `texts/`, путь через `CDC_SITE` | `python scripts/extract_html_text.py` |
| `_lib.py` | общие утилиты (не запускается) | — |

## Архивные (одноразовые)

Это снимки работ по подготовке ассетов: жёсткие пути `D:\...` в них — историческая фиксация,
в проверках они не участвуют. При повторном использовании замените пути на `_lib.path(...)`.

| Скрипт | Что делал |
|---|---|
| `sort_photos.py` | раскладка фото клиента по категориям |
| `prepare_airbridge_images.py` | подготовка изображений из `scripts/_extract` |
| `remove_white_bg.py` | удаление белого фона у рендера модуля |
| `finalize_photos.py` | финальная сборка фото решений |
| `route_slider_images.py` | маршрутизация кадров в слайдеры |
| `sync_exact_user_paths.py` | синхронизация фото из конкретных папок пользователя |
| `force_user_folders.py` | принудительная привязка папок |
| `hard_reset_photos.py` | жёсткая перезапись фото слайдеров |
| `compress_solutions_images.py` | сжатие фото решений под веб |
| `rename_png_to_jpg.py` | приведение расширений к реальному формату |
| `trim_video.py` | обрезка исходного ролика клиента |
| `map_pptx.py` | карта изображений из PPTX |
| `extract_airbridge_images.py` | извлечение изображений из PDF/PPTX |

## Типовые сценарии

```powershell
# перед коммитом
python scripts/run_checks.py
node --check assets/js/main.js

# контент/цифры изменились
python scripts/fact_index.py

# добавили/удалили файлы в assets/
python scripts/find_unused_assets.py

# обновились исходные материалы клиента
python scripts/extract_pptx_text.py
python scripts/extract_pdf_text.py
python scripts/fact_index.py

# меняли исходники медиа
python scripts/optimize_assets.py
```

## Граф зависимостей

`graphify update .` пересобирает `graphify-out/GRAPH_REPORT.md` (каталог не коммитится,
это артефакт). Отчёт до рефакторинга показывал: god nodes `kb()` и пять разных `main()`,
`load_sources()` как мост между сообществами, отсутствие общего слоя. После вынесения `_lib.py`
и дробления `main()` на функции граф стал плоским: общий слой — единственный хаб.

Соответствие сообществ графа и файлов:

| Сообщество в отчёте | Файлы |
|---|---|
| Asset Optimization Scripts | `optimize_assets.py` |
| Site Fact-Checking | `fact_index.py`, `check_site.py` |
| Image Compression & Cleanup | `compress_solutions_images.py`, `prepare_airbridge_images.py` |
| Photo Finalization | `finalize_photos.py`, `remove_white_bg.py` |
| Slider Image Sync / Routing | `sync_exact_user_paths.py`, `route_slider_images.py`, `force_user_folders.py`, `hard_reset_photos.py` |
| Content Extraction & Sorting | `extract_html_text.py`, `sort_photos.py`, `map_pptx.py` |
| PDF / PPTX Content Extraction | `extract_pdf_text.py`, `extract_pptx_text.py` |

## Как добавить скрипт

1. Если скрипт нужен регулярно — он **активный**: использует `_lib`, `main() -> int`,
   коды `0/1/2`, docstring с `Run:` и описанием кодов выхода. Добавьте строку в таблицу выше.
2. Если это разовая операция — кладите в каталог и добавьте в раздел «Архивные» с описанием;
   пути — через `_lib.path(...)`, чтобы не привязываться к машине.
3. Не дублируйте `kb()`, `read_text()`, `ROOT` и т.п. — расширяйте `_lib.py`.
