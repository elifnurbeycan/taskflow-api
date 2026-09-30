# TaskFlow API

TaskFlow, ekip içerisindeki görevlerin oluşturulmasını, çalışanlara atanmasını, güncellenmesini ve durumlarının takip edilmesini sağlayan REST API projesidir.

Bu proje, Node.js Backend Programlama eğitimi bitirme projesi kapsamında geliştirilmiştir.

## Proje Özellikleri

- Görev oluşturma
- Aktif görevleri listeleme
- Görev detayını görüntüleme
- Görev bilgilerini güncelleme
- Görevleri çalışanlara atama
- Soft delete ile görev silme
- Request validation
- Merkezi hata yönetimi
- Yapılandırılmış HTTP logları
- Her istek için benzersiz Request ID
- Otomatik API testleri

## Kullanılan Teknolojiler

- Node.js
- Express.js
- Pino
- Pino HTTP
- Pino Pretty
- Node.js Test Runner
- Postman

## Gereksinimler

Projeyi çalıştırabilmek için bilgisayarınızda şu araçların bulunması gerekir:

- Node.js 18 veya üzeri
- npm
- Git
- Postman veya benzeri bir API istemcisi

Kurulu Node.js ve npm sürümlerini kontrol etmek için:

```bash
node --version
npm --version
```

## Kurulum

Repository’yi bilgisayarınıza indirin:

```bash
git clone https://github.com/elifnurbeycan/taskflow-api.git
```

Proje klasörüne girin:

```bash
cd taskflow-api
```

Bağımlılıkları yükleyin:

```bash
npm install
```

Sunucuyu çalıştırın:

```bash
npm start
```

Başarılı başlangıçta terminalde buna benzer bir log görülür:

```text
INFO: TaskFlow API server started
port: 3000
```

API varsayılan olarak şu adreste çalışır:

```text
http://localhost:3000
```

Ana endpoint kontrolü:

```http
GET http://localhost:3000/
```

Beklenen cevap:

```text
TaskFlow API is running
```

## npm Komutları

| Komut | Açıklama |
|---|---|
| `npm install` | Proje bağımlılıklarını yükler |
| `npm start` | API sunucusunu başlatır |
| `npm test` | Otomatik API testlerini çalıştırır |

## API Endpointleri

Base URL:

```text
http://localhost:3000/api/tasks
```

| Metot | Endpoint | Başarılı Kod | Açıklama |
|---|---|---:|---|
| POST | `/api/tasks` | 201 | Yeni görev oluşturur |
| GET | `/api/tasks` | 200 | Aktif görevleri listeler |
| GET | `/api/tasks/:id` | 200 | Belirli bir görevi getirir |
| PUT | `/api/tasks/:id` | 200 | Görev bilgilerini günceller |
| DELETE | `/api/tasks/:id` | 200 | Görevi soft delete ile siler |

## Task Veri Modeli

| Alan | Tip | Açıklama |
|---|---|---|
| `id` | Number | Görevin benzersiz kimliği |
| `title` | String | Görev başlığı |
| `description` | String | Görev açıklaması |
| `projectId` | Number | Görevin bağlı olduğu proje kimliği |
| `assignee` | String | Görevin atandığı çalışan |
| `status` | String | Görevin mevcut durumu |
| `priority` | String | Görev önceliği |
| `dueDate` | String | Son tamamlanma tarihi |
| `active` | Boolean | Görevin aktif olup olmadığı |
| `version` | Number | Güncelleme sürümü |
| `createdAt` | Date | Oluşturulma zamanı |
| `updatedAt` | Date | Son güncellenme zamanı |

## Görev Oluşturma

```http
POST /api/tasks
Content-Type: application/json
```

Request body:

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

## Görev Güncelleme

```http
PUT /api/tasks/1
Content-Type: application/json
```

Request body:

```json
{
  "title": "Backend geliştirme tamamlanıyor",
  "assignee": "Musa",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```

Başarılı güncellemede:

- `updatedAt` alanı güncellenir.
- `version` değeri bir artırılır.
- Gönderilmeyen alanlar mevcut değerlerini korur.

## Enum Değerleri

Geçerli görev durumları:

```text
PENDING
IN_PROGRESS
COMPLETED
```

Geçerli öncelik değerleri:

```text
LOW
MEDIUM
HIGH
```

## Validation

Aşağıdaki veriler doğrulanır:

- `title` boş olamaz.
- `projectId` pozitif bir tam sayı olmalıdır.
- `assignee` boş olamaz.
- `priority` tanımlı enum değerlerinden biri olmalıdır.
- `status` tanımlı enum değerlerinden biri olmalıdır.
- `dueDate` geçerli bir tarih olmalıdır.
- URL içerisindeki task ID pozitif bir tam sayı olmalıdır.

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

## Hata Yönetimi

Bulunamayan görev:

```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task not found"
  }
}
```

Bulunamayan route:

```json
{
  "error": {
    "code": "ROUTE_NOT_FOUND",
    "message": "Route not found: GET /api/deneme"
  }
}
```

Beklenmeyen sunucu hatalarında dahili hata ayrıntıları istemciye gönderilmez.

## Logger

API istekleri Pino ve Pino HTTP kullanılarak terminale kaydedilir.

Loglarda şu bilgiler bulunur:

- Zaman damgası
- Log seviyesi
- HTTP metodu
- Endpoint
- HTTP durum kodu
- Request ID
- Response süresi

Her response içerisinde benzersiz bir header bulunur:

```text
X-Request-Id
```

Başarılı istekler `INFO`, istemci hataları `WARN`, sunucu hataları `ERROR` seviyesinde loglanır.

## Otomatik Testler

Testleri çalıştırmak için:

```bash
npm test
```

Test kapsamı:

- Görev oluşturma
- Görev listeleme
- Görev güncelleme
- Soft delete
- Validation hataları
- Geçersiz task ID
- Bulunamayan route

Beklenen sonuç:

```text
tests 7
pass 7
fail 0
```

## Veri Saklama

Proje, eğitim yönergesinin kapsamına uygun olarak in-memory veri yapısı kullanır.

Görevler uygulama belleğinde tutulur. Sunucu kapatılıp yeniden açıldığında görev verileri sıfırlanır.

## Proje Yapısı

```text
taskflow-api/
├── docs/
│   ├── logger/
│   └── postman/
├── src/
│   ├── config/
│   │   └── logger.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── data/
│   │   └── tasks.js
│   ├── entities/
│   │   ├── BaseEntity.js
│   │   └── Task.js
│   ├── enums/
│   │   ├── taskPriority.js
│   │   └── taskStatus.js
│   ├── errors/
│   │   ├── AppError.js
│   │   └── errorCodes.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   ├── httpLogger.js
│   │   ├── notFoundHandler.js
│   │   └── taskValidation.js
│   ├── routes/
│   │   └── taskRoutes.js
│   └── services/
│       └── taskService.js
├── tests/
│   └── taskApi.test.js
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

## Test Kanıtları

### Postman CRUD Testleri

- [Görev oluşturma](docs/postman/01-task-create.png)
- [Görev listeleme](docs/postman/02-task-list.png)
- [Görev detayı](docs/postman/03-task-detail.png)
- [Görev güncelleme](docs/postman/04-task-update.png)
- [Görev silme](docs/postman/05-task-delete.png)

### Logger Çıktıları

- [POST logger çıktısı](docs/logger/01-logger-post.png)
- [GET logger çıktısı](docs/logger/02-logger-get.png)
- [PUT logger çıktısı](docs/logger/03-logger-put.png)
- [DELETE logger çıktısı](docs/logger/04-logger-delete.png)

## Sık Karşılaşılan Sorunlar

### `Cannot GET /...`

Route adresini ve `app.use("/api/tasks", taskRoutes)` bağlantısını kontrol edin.

### `req.body` undefined

`app.use(express.json())` middleware’inin route tanımlarından önce bulunduğunu kontrol edin.

### `EADDRINUSE: address already in use`

3000 portunda çalışan eski sunucuyu terminalde `Ctrl+C` ile durdurun.

### Görevler sunucu yeniden başladığında kayboluyor

Bu beklenen davranıştır. Proje in-memory veri yapısı kullanmaktadır.

### `Cannot find module`

Önce bağımlılıkların kurulduğundan emin olun:

```bash
npm install
```

## Geliştirici

Elif Nur Beycan