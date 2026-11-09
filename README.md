# Docker SIMONA - PHP ke React Migration

Migrasi aplikasi CodeIgniter 4 (PHP) ke Express.js (Node.js) backend + React frontend.

## Struktur Proyek

```
docker-simona-react-migrate/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MySQL connection pool
│   │   ├── controllers/
│   │   │   ├── HomeController.js    # Dashboard charts logic
│   │   │   └── ContactsController.js # File upload logic
│   │   ├── models/
│   │   │   ├── HomeModels.js        # Chart queries
│   │   │   └── ContactsModels.js    # File & data queries
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication
│   │   └── routes/
│   │       ├── homeRoutes.js        # /api/home/* routes
│   │       └── contactsRoutes.js    # /api/contacts/* routes
│   ├── app.js                       # Express server entry
│   └── .env                         # Environment config
├── client/
│   ├── public/
│   │   └── index.html              # HTML template (Bootstrap 5)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js             # Dashboard component (charts)
│   │   │   └── Contacts.js         # Upload & list component
│   │   ├── services/
│   │   │   └── api.js              # Axios API client
│   │   ├── App.js                  # Main app routing
│   │   └── index.js                # React DOM render
│   └── package.json
└── package.json                     # Root scripts
```

## Equivalence Map: CodeIgniter → Express + React

| CodeIgniter | Express | React |
|-----------|---------|-------|
| `app/Controllers/Home.php` | `HomeController.js` | `Home.js` component |
| `app/Models/HomeModels.php` | `HomeModels.js` | - |
| `app/Views/home.php` | - | `Home.js` render |
| Routes (routes.php) | `homeRoutes.js` | - |
| Session (`$_SESSION`) | JWT token (localStorage) | - |
| Form submission | Axios API call | - |
| Bootstrap UI template | Bootstrap 5 CDN | - |

## Database Schema (Tetap Sama)

- `tb_spm_program` - Program data, pagu, realisasi
- `tb_spm_kegiatan` - Kegiatan records
- `tb_satker` - Satuan kerja (UPT)
- `tb_ref_*` - Reference tables (program, kegiatan, kro, etc)

## Fitur yang Sudah Diimplementasi

### Backend (Express)
1. **Database Connection** - MySQL pool, parameterized queries
2. **Home API**
   - `GET /api/home/getChartData?tahun=2024` - Pagu, realisasi, sisa
   - `GET /api/home/getChartRealisasi?tahunrealisasi=2024` - Persentase realisasi
3. **Contacts API**
   - `GET /api/contacts` - List laporan terakhir
   - `GET /api/contacts/new` - Form data (satker, bulan)
   - `POST /api/contacts/upload` - File upload & parse
4. **Auth Middleware** - JWT token validation
5. **Error Handling** - Try-catch + error responses

### Frontend (React)
1. **Home Component** - Line charts (pagu, realisasi, sisa + persentase)
2. **Contacts Component** - Upload form + data table
3. **API Service** - Centralized axios client + interceptor (token attach)
4. **Navigation** - Simple navbar routing
5. **Bootstrap 5** - Responsive UI (gaya existing template)

## Setup & Run

### Backend
```bash
cd docker-simona-react-migrate

# Install deps
npm install

# Optional: install xlsx untuk Excel parsing
# npm install xlsx

# Configure database
# Edit server/.env dengan credentials MySQL

# Jalankan server
npm run start:server
# atau dev dengan nodemon: npm run dev:server
```

Server runs on `http://localhost:5000`

### Frontend
```bash
cd client

# Install React deps (jika belum)
npm install

# Start dev server
npm start
```

Frontend runs on `http://localhost:3000`, proxy ke Express di `:5000`

## API Endpoints (Express)

| Method | Path | Auth | Desc |
|--------|------|------|------|
| GET | `/api/health` | No | Health check |
| GET | `/api/home/getChartData` | Yes | Pagu chart |
| GET | `/api/home/getChartRealisasi` | Yes | Realisasi % |
| GET | `/api/contacts` | Yes | List uploads |
| GET | `/api/contacts/new` | Yes | Form data |
| POST | `/api/contacts/upload` | Yes | Upload file |

## Environment Variables

**server/.env**
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=docker_simona
JWT_SECRET=your_secret_key
UPLOAD_DIR=./uploads
```

## Fitur Belum Selesai / TODO

1. **Auth Controller** - Login, logout, token generation
2. **Excel Parsing** - Install `xlsx`, parse file rows → DB insert
3. **Groups Controller** - Per-kegiatan grouping reports
4. **Export to Excel** - Generate report files
5. **Advanced Filters** - Per-UPT, per-bulan filtering
6. **Error UI** - Toast notifications, validation messages
7. **Session/User Context** - React context untuk user profile
8. **Tests** - Unit tests backend & components

## Perbedaan Teknis

### Error Handling
- **PHP**: try-catch + redirect dengan flashdata
- **Express**: try-catch + JSON response (status + msg)
- **React**: .catch() + state update + UI alert

### File Upload
- **CodeIgniter**: `$file->move()` built-in
- **Express**: `multer` middleware, manual fs.renameSync
- **React**: FormData + multipart/form-data

### Charts
- **PHP View**: Hardcoded HTML table
- **Express**: JSON data
- **React**: Chart.js library + react-chartjs-2 component

### Session/Auth
- **PHP**: Server-side $_SESSION
- **Express**: JWT token
- **React**: localStorage + Authorization header

## Catatan Migrasi

1. **Database tetap MySQL** - query mirip dengan CodeIgniter Builder
2. **Template UI Bootstrap 5** - gaya existing terjaga, responsive
3. **Async/await** - Express native support (vs CodeIgniter callback)
4. **Parameterized queries** - mysql2/promise prevent SQL injection
5. **Stateless API** - Express stateless, auth via token

## Next Steps

1. Install `xlsx` library untuk Excel parsing
2. Implementasi Auth controller (login flow)
3. Implement Groups & Kegiatan controllers (laporan detail)
4. Add Redux/Context untuk state management
5. Setup deployment (Docker compose atau cloud)
6. DB backup & data migration dari PHP app
