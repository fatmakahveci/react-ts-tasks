# Odak — React & TypeScript Görev Uygulaması

Next.js, React ve TypeScript ile geliştirilmiş; Firebase Realtime Database kullanan
sade bir görev takip uygulaması.

## Çalıştırma

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local` içindeki adresi kendi Firebase Realtime Database adresinizle değiştirin.
Adres `tasks.json` ile bitmelidir.

## Özellikler

- Görev ekleme, tamamlama ve silme
- Yükleme, hata, doğrulama ve boş liste durumları
- Mobil uyumlu arayüz
- Firebase verileri için tip güvenli dönüşüm
