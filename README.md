# Care AI — Modern Healthcare Platform

Care AI is a comprehensive healthcare management platform that connects patients with doctors, streamlines medical record keeping, and facilitates secure appointment booking with integrated payments.

## 🚀 Key Features

### For Patients

- **Personal Health Dashboard**: Track vitals, upcoming appointments, and health status.
- **Medical Records**: Upload and manage medical scans (X-rays, MRIs) with AI-ready storage.
- **Doctor Directory**: Search specialists by rating, price, and availability.
- **Appointment Booking**: Secure booking with **Interswitch Payment Integration**.
- **Emergency Assistance**: Quick access to verified emergency contacts.

### For Doctors

- **Practice Management**: Track patient consultations and schedule.
- **Patient Profiles**: Review shared medical history and history logs.
- **Session Control**: Direct access to virtual consultation triggers.

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State/API**: [Axios](https://axios-http.com/) with JWT interception
- **Aesthetics**: Premium Glassmorphism UI, Lucide Icons

### Backend

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: MySQL with SQLAlchemy ORM
- **Security**: OAuth2.0 with JWT (Access & Refresh tokens)
- **Payment**: [Interswitch](https://www.interswitchgroup.com/) (Inline Checkout Integration)

## 📦 Project Structure

```text
├── care-ai-frontend/       # Next.js Application
│   ├── src/app/            # App Router (Pages)
│   ├── src/components/     # UI Design System & Pages
│   └── .env.local          # Client Configuration
└── care-ai-backend/        # FastAPI Application
    ├── app/api/            # API Endpoints
    ├── app/models/         # Database Schemas
    └── .env                # Server Configuration
```

## 🛠 Setup & Installation

### Backend Setup

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd care-ai-backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Configure `.env` with your MySQL and Interswitch credentials.
3. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd care-ai-frontend
   npm install
   ```
2. Configure `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 or https://care-ai-api.ahiakwojohn.com/api/v1
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables

### Backend (`.env`)

- `MYSQL_SERVER`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DB`
- `SECRET_KEY` (JWT signing key)
- `ISW_MERCHANT_CODE`, `ISW_PAYABLE_CODE`, `ISW_CLIENT_ID`, `ISW_CLIENT_SECRET` (Interswitch credentials)

### Frontend (`.env.local`)

- `NEXT_PUBLIC_API_URL` (Pointer to your backend API)

## 📄 License

Care AI is a proprietary medical software project under development.

## Contributon

Ahiakwo John worked on the frontend and backend integration

Valentine worked on ai angineering, by architecting a hybrid diagnostic pipepline and training the models
