# SIMONA Backend - Express.js

Express.js backend untuk migrasi CodeIgniter 4 PHP → Node.js. REST API untuk dashboard SPM.

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env dengan MySQL credentials

# Run server
npm run start:server
# Dev dengan nodemon: npm run dev:server
```

Server runs on `http://localhost:5000`

## API Endpoints

| Method | Path | Auth | Desc |
|--------|------|------|------|
| POST | `/api/auth/login` | No | Login, return JWT |
| GET | `/api/auth/profile` | Yes | User profile |
| GET | `/api/home/getChartData?tahun=2024` | Yes | Pagu chart |
| GET | `/api/home/getChartRealisasi?tahunrealisasi=2024` | Yes | Realisasi % |
| GET | `/api/contacts` | Yes | List laporan upload |
| GET | `/api/contacts/new` | Yes | Form data (satker, bulan) |
| POST | `/api/contacts/upload` | Yes | File upload (multipart) |

## Environment Variables

```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=docker_simona
JWT_SECRET=your_jwt_secret_key_here
UPLOAD_DIR=./uploads
```

## Architecture

```
src/
├── config/
│   └── database.js          # MySQL connection pool
├── controllers/
│   ├── AuthController.js    # Login, profile
│   ├── HomeController.js    # Chart queries
│   └── ContactsController.js # File upload
├── models/
│   ├── HomeModels.js        # Chart data queries
│   └── ContactsModels.js    # File & satker queries
├── middleware/
│   └── auth.js              # JWT validation
└── routes/
    ├── authRoutes.js        # Auth endpoints
    ├── homeRoutes.js        # Home/dashboard endpoints
    └── contactsRoutes.js    # Upload & list endpoints
app.js                       # Express app entry
```

## Database Schema

Tables required:
- `tb_users` - User accounts (id, username, password, level, kd_unit)
- `tb_spm_program` - Program data (pagu, realisasi, sisa, bulan, tahun_anggaran, kd_unit)
- `tb_spm_kegiatan` - Kegiatan records
- `tb_satker` - Satuan kerja / UPT

## Features

✓ JWT auth (login)
✓ Chart data queries (pagu, realisasi, sisa)
✓ File upload (multipart)
✓ Error handling (try-catch)
✓ MySQL parameterized queries (SQL injection safe)
✓ CORS enabled

## TODO

- [ ] Excel parsing (xlsx library)
- [ ] Groups detail API
- [ ] Export to Excel
- [ ] Password bcrypt hash
- [ ] Rate limiting
- [ ] Input validation
- [ ] Tests (jest)
