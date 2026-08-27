# DEPLOY.md — Деплой на GitHub Pages

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

## 2. Подключение удалённого репозитория

```powershell
git branch -M main
git remote add origin https://github.com/<USER>/<REPO>.git
git push -u origin main
```

## 3. Включение GitHub Pages

1. На GitHub откройте репозиторий → **Settings** → **Pages**.
2. В блоке **Build and deployment**:
   - Source: **Deploy from a branch**;
   - Branch: **main**, папка: **/ (root)**.
3. Нажмите **Save**. Через 1–2 минуты сайт будет доступен по адресу:
   `https://<USER>.github.io/<REPO>/`.

## 4. Обновление сайта

```powershell
git add .
git commit -m "chore: update content"
git push
```

## Важные замечания

### Крупные медиафайлы
- `assets/media/` содержит видео до ~13.5 МБ, `airbridge_materials/presentations/` — PDF до
  ~4.8 МБ. GitHub Pages допускает файлы до 100 МБ, поэтому всё укладывается в лимит.
- Для ускорения загрузки рекомендуется держать видео в сжатом виде и использовать `poster`.
- При необходимости тяжёлые PDF/видео можно вынести на отдельный CDN/хостинг и сослаться
  на них, чтобы не раздувать репозиторий.

### Абсолютные ссылки на cdc.company
- Все переходы на головной сайт — абсолютные: `https://cdc.company/...` (см. `TECH_SPEC.md`).

### Проверка перед пушем
```powershell
# локальный сервер
python -m http.server 8085
# открыть http://localhost:8085 и проверить консоль на ошибки
```
