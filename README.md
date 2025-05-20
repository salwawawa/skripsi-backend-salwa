# Sentra Tamansari - Backend API

Backend API untuk aplikasi manajemen toko dan kegiatan Sentra Tamansari menggunakan Express.js dan PostgreSQL.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Sebelum menjalankan aplikasi, pastikan telah terinstall:

- Node.js (v14+)
- PostgreSQL (v12+)
- npm atau yarn
- Git

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Image Storage**: Local filesystem
- **Authentication**: -
- **Testing**: -

## Installation

1. Clone repository:

```bash
git clone https://github.com/DhanuKampus/sentra-tamansari.git
cd sentra-tamansari
```

2. Install dependencies:

```bash
npm install
```

## Configuration

1. Salin file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

2. Update konfigurasi pada file `.env`:

```ini
# Database Configuration
PGUSER=postgres
PGPASSWORD=your_password
PGHOST=localhost
PGPORT=5432
PGDATABASE=sentra_tamansari

# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload Configuration
UPLOAD_DIR=public/photos
MAX_FILE_SIZE=5242880
```

## Database Setup

1. Buat database PostgreSQL:

```bash
sudo -u postgres createdb sentra_tamansari
```

2. Jalankan migrasi database:

```bash
npm run migrate:up
```

## Running the Application

Development mode dengan auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## Project Structure

```
sentra-tamansari/
├── src/
│   ├── config/         # Database & environment config
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Database models
│   ├── routes/         # Route definitions
│   ├── utils/          # Helper functions
│   └── app.js         # Express app setup
├── migrations/         # Database migrations
├── public/            # Static files
│   └── photos/        # Uploaded images
│       ├── shops/
│       ├── products/
│       └── activities/
├── .env               # Environment variables
├── .gitignore        # Git ignore rules
└── package.json      # Project metadata
```

## API Documentation

### Common Response Format

Success Response:

```json
{
  "status": "berhasil",
  "messages": "Message describing the success",
  "data": {} // Data object or null
}
```

Error Response:

```json
{
  "status": "gagal",
  "messages": "Message describing the error",
  "error": "Detailed error message"
}
```

### Authentication

Currently no authentication required

### Available Endpoints

<details>
<summary><b>Shops API</b></summary>

#### Create Shop

- **POST** `/api/v1/shops`
- Body:

```json
{
  "nama": "Toko Batik Tamansari",
  "pemilik": "Ibu Sari",
  "alamat": "Jl. Tamansari No. 123",
  "block_id": 1,
  "foto": "data:image/jpeg;base64,...",
  "deskripsi": "Toko batik khas Yogyakarta"
}
```

</details>

<details>
<summary><b>Categories API</b></summary>

#### Create Category

- **POST** `/api/v1/categories`
- Body:

```json
{
  "nama": "Batik",
  "deskripsi": "Kategori untuk produk batik"
}
```

</details>

<details>
<summary><b>Products API</b></summary>

#### Create Product

- **POST** `/api/v1/products`
- Body:

```json
{
  "shop_id": 1,
  "category_id": 1,
  "nama": "Batik Parang",
  "harga": 150000,
  "foto": "data:image/jpeg;base64,...",
  "description": "Batik motif parang klasik"
}
```

</details>

<details>
<summary><b>Activities API</b></summary>

#### Create Activity

- **POST** `/api/v1/activities`
- Body:

```json
{
  "nama_kegiatan": "Festival Batik Tamansari",
  "start_date": "2024-06-01T00:00:00.000Z",
  "end_date": "2024-06-03T23:59:59.000Z",
  "tempat": "Area Sentra Tamansari",
  "foto": "data:image/jpeg;base64,...",
  "deskripsi": "Festival tahunan batik"
}
```

</details>

<details>
<summary><b>Blocks API</b></summary>

### Blocks Endpoints

#### Get All Blocks

- **GET** `/api/v1/blocks`
- Response:

```json
{
  "status": "berhasil",
  "messages": "Berhasil mengambil semua data blok",
  "data": [
    {
      "id": 1,
      "nama": "Blok A",
      "deskripsi": "Blok bagian utara",
      "created_at": "2024-05-20T10:00:00.000Z",
      "updated_at": "2024-05-20T10:00:00.000Z"
    }
  ]
}
```

#### Create Block

- **POST** `/api/v1/blocks`
- Body:

```json
{
  "nama": "Blok A",
  "deskripsi": "Blok bagian utara"
}
```

#### Get Single Block

- **GET** `/api/v1/blocks/:id`

#### Update Block

- **PUT** `/api/v1/blocks/:id`
- Body:

```json
{
  "nama": "Blok A Updated",
  "deskripsi": "Deskripsi baru untuk Blok A"
}
```

#### Delete Block

- **DELETE** `/api/v1/blocks/:id`

#### Get Shops in Block

- **GET** `/api/v1/blocks/:id/shops`

#### Add House Number to Block

- **POST** `/api/v1/blocks/:id/house-numbers`
- Body:

```json
{
  "nomor": "A-123"
}
```

#### Get House Numbers in Block

- **GET** `/api/v1/blocks/:id/house-numbers`

</details>

## Scripts

| Command                  | Description                             |
| ------------------------ | --------------------------------------- |
| `npm start`              | Run production server                   |
| `npm run dev`            | Run development server with auto-reload |
| `npm run migrate`        | Run database migrations                 |
| `npm run migrate:up`     | Run pending migrations                  |
| `npm run migrate:down`   | Rollback last migration                 |
| `npm run migrate:create` | Create new migration file               |

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

ISC

---

Developed with ❤️ for Sentra Tamansari
