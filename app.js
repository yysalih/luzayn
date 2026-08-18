/**
 * cPanel "Setup Node.js App" (Phusion Passenger) başlatma dosyası.
 *
 * Passenger başlangıç dosyası olarak genelde `app.js` bekler; asıl sunucu ise
 * Nitro'nun ürettiği ESM paketidir (.output/server/index.mjs). Bu dosya
 * ikisini birbirine bağlar.
 *
 * Statik `import` yerine dinamik `import()` kullanılıyor: dosyanın CommonJS mi
 * ESM mi sayılacağı yanına package.json konup konmadığına göre değişir,
 * dinamik import her iki durumda da çalışır.
 *
 * Dinlenecek portu Passenger `PORT` ortam değişkeniyle verir; Nitro onu
 * kendiliğinden okur, burada bir şey yapmaya gerek yok.
 */
import('./.output/server/index.mjs').catch((error) => {
  console.error('[luzayn] sunucu başlatılamadı:', error)
  process.exit(1)
})
