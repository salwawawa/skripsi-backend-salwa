# Sentra Tamansari - Backend API

Backend API untuk aplikasi manajemen toko dan kegiatan Sentra Tamansari menggunakan Express.js dan PostgreSQL.

## Prasyarat

Sebelum menjalankan aplikasi, pastikan sudah terinstall:

- Node.js (v14 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)
- npm atau yarn

## Instalasi

1. Clone repository:

```bash
git clone https://github.com/DhanuKampus/sentra-tamansari.git
cd sentra-tamansari
```

2. Install dependencies:

```bash
npm install
```

3. Salin file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

4. Update konfigurasi database di file `.env`:

```
PGUSER=postgres
PGPASSWORD=your_password
PGHOST=localhost
PGPORT=5432
PGDATABASE=sentra_tamansari
PORT=3000
```

5. Buat database PostgreSQL:

```bash
sudo -u postgres createdb sentra_tamansari
```

6. Jalankan migrasi database:

```bash
npm run migrate:up
```

## Menjalankan Aplikasi

Development mode dengan auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## Struktur Project

```
src/
├── config/         # Konfigurasi database dan environment
├── controllers/    # Logic untuk setiap route
├── middleware/     # Express middleware
├── models/         # Database models
├── routes/         # Route definitions
└── utils/         # Helper functions

public/
└── photos/        # Uploaded images
    ├── shops/
    ├── products/
    └── activities/
```

## API Endpoints

### Shops

- `GET /api/v1/shops` - Get all shops
- `POST /api/v1/shops` - Create new shop
- `GET /api/v1/shops/:id` - Get shop by ID
- `PUT /api/v1/shops/:id` - Update shop
- `DELETE /api/v1/shops/:id` - Delete shop
- `GET /api/v1/shops/:id/products` - Get shop products

### Categories

- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create new category
- `GET /api/v1/categories/:id` - Get category by ID
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Products

- `GET /api/v1/products` - Get all products
- `POST /api/v1/products` - Create new product
- `GET /api/v1/products/:id` - Get product by ID
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Activities

- `GET /api/v1/activities` - Get all activities
- `POST /api/v1/activities` - Create new activity
- `GET /api/v1/activities/:id` - Get activity by ID
- `PUT /api/v1/activities/:id` - Update activity
- `DELETE /api/v1/activities/:id` - Delete activity

## Scripts

- `npm start` - Run production server
- `npm run dev` - Run development server with auto-reload
- `npm run migrate` - Run database migrations
- `npm run migrate:up` - Run pending migrations
- `npm run migrate:down` - Rollback last migration
- `npm run migrate:create` - Create new migration file

## License

ISC

# sentra-tamansari
