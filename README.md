# TaskFlow API

TaskFlow, ekip içerisindeki görevlerin oluşturulmasını, çalışanlara atanmasını ve durumlarının takip edilmesini sağlayan REST API projesidir.

Bu proje Node.js Backend Programlama eğitimi bitirme projesi kapsamında geliştirilmiştir.

## Özellikler

- Görev oluşturma
- Görevleri listeleme
- Görev detayını görüntüleme
- Görev güncelleme
- Görev silme
- Görevleri çalışanlara atama
- Soft delete desteği
- Request validation
- Merkezi hata yönetimi
- HTTP request logger
- Request ID oluşturma
- Otomatik API testleri

## Kullanılan Teknolojiler

- Node.js
- Express.js
- Pino
- Pino HTTP
- Node.js Test Runner
- Postman

## Kurulum

Projeyi bilgisayarınıza indirdikten sonra proje klasöründe terminal açın.

Bağımlılıkları yükleyin:

```bash
npm install
```

Sunucuyu çalıştırın:

```bash
npm start
```

Sunucu varsayılan olarak şu adreste çalışır:

```text
http://localhost:3000
```

## Testler

Otomatik testleri çalıştırmak için:

```bash
npm test
```

Testler; CRUD işlemlerini, validation cevaplarını, soft delete davranışını ve hata yönetimini kontrol eder.

## API Endpointleri

| Metot | Endpoint | Açıklama |
|---|---|---|
| POST | `/api/tasks` | Yeni görev oluşturur |
| GET | `/api/tasks` | Aktif görevleri listeler |
| GET | `/api/tasks/:id` | Belirli bir görevi getirir |
| PUT | `/api/tasks/:id` | Görev bilgilerini günceller |
| DELETE | `/api/tasks/:id` | Görevi soft delete ile siler |

## Görev Oluşturma Örneği

```http
POST /api/tasks
Content-Type: application/json
```

```json
{
  "title": "Backend geliştirme",
  "description": "TaskFlow API projesini tamamla",
  "projectId": 1,
  "assignee": "Elif Beycan",
  "priority": "HIGH",
  "dueDate": "2026-10-15"
}
```

Yeni görevlerin başlangıç durumu otomatik olarak `PENDING` olur.

Geçerli öncelik değerleri:

```text
LOW
MEDIUM
HIGH
```

Geçerli durum değerleri:

```text
PENDING
IN_PROGRESS
COMPLETED
```

## Hata Cevabı Örneği

Geçersiz veri gönderildiğinde API `400 Bad Request` döndürür:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

## Logger

API istekleri Pino kullanılarak terminale kaydedilir.

Loglarda şu bilgiler bulunur:

- Zaman damgası
- HTTP metodu
- Endpoint
- HTTP durum kodu
- Request ID
- Response süresi

Her response içerisinde `X-Request-Id` header’ı bulunur.

## Veri Saklama

Bu proje eğitim yönergesinin kapsamına uygun olarak in-memory veri yapısı kullanır.

Görevler uygulama belleğinde tutulduğu için sunucu kapatılıp yeniden açıldığında veriler sıfırlanır.

## Proje Yapısı

```text
taskflow/
├── docs/
│   ├── logger/
│   └── postman/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── entities/
│   ├── enums/
│   ├── errors/
│   ├── middlewares/
│   ├── routes/
│   └── services/
├── tests/
├── app.js
├── package.json
└── README.md
```

## Test Kanıtları

Postman CRUD ekran görüntüleri:

```text
docs/postman/
```

Logger ekran görüntüleri:

```text
docs/logger/
```

## Geliştirici

Elif Beycan