# IECBP Evaluation System - Setup Guide

## Prerequisites

Install the following:

- Node.js (v20+ recommended)
- PostgreSQL
- Git

Verify installation:

```bash
node -v
npm -v
git --version
```

## Clone Repository

```bash
git clone <repository-url>
cd iecbp-evaluation-system
```

## Install Dependencies

```bash
npm install
```
## Create Database - with preferrable name - iecbp_eval

## Environment Variables

Create a `.env` file in the project root.
Refer .env.example file

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

GROQ_API_KEY=your_groq_api_key

RESEND_API_KEY=your_resend_api_key
```

## Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

## Run Application

```bash
npm run dev
```

Application URL:

```text
http://localhost:3000
```

---

# AI Features

The platform includes:

- Evidence Extraction
- AI Evidence Audit
- Capability Trait Generation
- Capability Insight Generation

All AI analysis is powered using **Groq**.

Required environment variable:

```env
GROQ_API_KEY=
```

---

# Email Service

Email notifications are handled using **Resend**.

Required environment variable:

```env
RESEND_API_KEY=
```

---

# Useful Commands

### Generate Prisma Client

```bash
npx prisma generate
```

### Open Prisma Studio

```bash
npx prisma studio
```

### Reset Database

```bash
npx prisma migrate reset
```

### Build Project

```bash
npm run build
```

### Start Production Build

```bash
npm start
```

---

# Project Workflow

Candidate Submission
↓
Evidence Extraction
↓
Signal Generation
↓
Evaluation Scoring
↓
AI Evidence Audit
↓
Capability Traits
↓
Capability Insights
↓
Evaluator Dashboard

---

# Dashboard Features

Evaluator Dashboard includes:

- Candidate Details
- Evaluation Scores
- Evidence Signals
- AI Evidence Audit
- Capability Traits
- Capability Insights
- Approval / Rejection Workflow

---

# Common Issues

## Database Connection Error

Verify:

```env
DATABASE_URL
```

## Prisma Client Error

Run:

```bash
npx prisma generate
```

## Groq API Error

Verify:

```env
GROQ_API_KEY
```

and ensure the API key is active.

## Resend Email Error

Verify:

```env
RESEND_API_KEY
```

and confirm the sender domain/email is verified.