# IECBP Evaluation System

## Overview

The IECBP Evaluation System is a web-based platform designed to manage candidate submissions, evaluator workflows, automated scoring pipelines, evidence extraction, AI-assisted analysis, and approval processes.

The system provides:

* Candidate submission management
* Scenario-based evaluations
* Automated evidence extraction
* Question-level scoring
* AI-generated capability traits
* AI-generated capability insights
* AI evidence audit analysis
* Evaluator dashboard and review workflow
* Approval and rejection management
* Email notification support

---

# Technology Stack

## Frontend

* Next.js
* React
* JavaScript
* Bootstrap

## Backend

* Next.js API Routes
* Node.js

## Database

* PostgreSQL
* Prisma ORM

## AI Services

* Groq API

## Email Service

* Resend API

---

# Project Structure

```text
app/
 ├── api/
 ├── dashboard/
 ├── services/

components/

prisma/
 ├── schema.prisma

lib/
 ├── prisma.js

scripts/
```

---

# Prerequisites

Install:

* Node.js 18+
* PostgreSQL
* Git

Verify installation:

```bash
node -v
npm -v
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project:

```bash
cd iecbp-evaluation-system
```

Install dependencies:

```bash
npm install
```

---

# Environment Configuration

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

GROQ_API_KEY=your_groq_api_key

RESEND_API_KEY=your_resend_api_key
```

---

# Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate deploy
```

For local development:

```bash
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

# Running the Application

Development Mode:

```bash
npm run dev
```

Application URL:

```text
http://localhost:3000
```

---

# AI Pipeline

The system includes:

## Evidence Extraction

Extracts evidence from candidate responses.

## AI Evidence Audit

Identifies potentially missed evidence not captured during rule-based extraction.

Stored in:

```text
AIEvidenceAudit
```

## Capability Traits

Generates capability traits with confidence scores and supporting evidence.

Stored in:

```text
CapabilityTrait
```

## Capability Insights

Generates:

* Strengths
* Areas for Improvement
* Recommendations

Stored in:

```text
CapabilityInsight
```

All AI services use Groq.

---

# Email Notifications

The application uses Resend for transactional emails.

Required environment variable:

```env
RESEND_API_KEY=
```

Configure sender email according to deployment environment.

---

# Deployment

Before deployment:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

Start production server:

```bash
npm start
```

---

# Common Commands

Generate Prisma Client:

```bash
npx prisma generate
```

Run Migrations:

```bash
npx prisma migrate dev
```

Open Database Viewer:

```bash
npx prisma studio
```

Build Project:

```bash
npm run build
```

Run Development Server:

```bash
npm run dev
```

---

# Troubleshooting

## Database Connection Issues

Verify:

```env
DATABASE_URL
```

and ensure PostgreSQL is running.

---

## Groq Errors

Verify:

```env
GROQ_API_KEY
```

Check API quota and account status.

---

## Prisma Errors

Regenerate Prisma Client:

```bash
npx prisma generate
```

Apply pending migrations:

```bash
npx prisma migrate deploy
```

#

## Development Team

Developed as part of IECBP Cohort 1 at txrVed Solutions Private Limited.