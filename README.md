## 🛑 ARCHITECTURAL ANCHOR
This project is part of the **Berlin AI Automation Studio**. 
It is governed by the global rules in **[berlin-ai-infra](https://github.com/yogami/berlin-ai-infra)**.

**Setup for new laptops:**
1. Clone this repo.
2. Run `./bootstrap-infra.sh` to link to the global Master Brain.

---

# Berlin Medflow Hub

> Federated Learning aggregation layer for privacy-preserving hospital AI.

## 🎯 What This Does

Medflow Hub enables hospitals to improve their AI models without sharing patient data. It provides:
- **Federated Aggregation**: Combines model weights from multiple hospitals without moving raw data
- **Privacy-Preserving**: GDPR-compliant architecture with differential privacy options
- **Clinical Operations**: Task routing and audit trails for clinician workflows

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/health` | Health check |
| GET | `/api/openapi.json` | OpenAPI 3.0 specification |
| GET | `/api/docs` | Swagger UI documentation |
| POST | `/api/weights/submit` | Submit model weights from hospital |
| GET | `/api/weights/aggregate` | Get aggregated model weights |
| POST | `/api/tasks/route` | Route clinical task to appropriate handler |
| GET | `/api/audit/:hospitalId` | Get audit trail for hospital |

## 🏗️ Architecture

```
src/
├── domain/           # Hospital, ModelWeights, ClinicalTask entities
├── application/      # AggregateWeights, RouteTask use cases
├── infrastructure/   # PostgreSQL adapter, secure transport
├── lib/
│   └── clinical-ops/    # Extracted microservice (reusable)
└── app/              # Next.js App Router pages and API routes
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the hub dashboard.

## 🧪 Testing

```bash
# Unit tests
npm run test

# With coverage (target: ≥80%)
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 🔗 Dependencies

| Service | Purpose | Production URL |
| :--- | :--- | :--- |
| ConvoGuard AI | Clinical safety guardrails | `https://convo-guard-ai-production.up.railway.app` |
| Supabase | PostgreSQL database | Dedicated instance |

## 📊 Status

- **Deployment**: Railway (planned)
- **Production URL**: `https://berlin-medfl-hub-production.up.railway.app`
- **Catalog Entry**: [Microservices_Catalog.md](../Microservices_Catalog.md)
- **OpenAPI**: 🟡 Early Prototype

## ⚠️ Development Status

This project is in **early prototype** stage. Core federated learning logic is functional but not yet production-hardened. Contact the team before integrating.

## ⚙️ Environment Variables

| Variable | Description | Required |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `ENCRYPTION_KEY` | Key for weight encryption | ✅ |
| `GUARDIAN_API_URL` | ConvoGuard compliance endpoint | Optional |

## 📜 License

MIT
