#!/bin/bash
# =============================================
# Dadi's Care Hub - GCP Deployment Script
# Usage: bash deploy.sh <YOUR_GCP_PROJECT_ID>
# =============================================
set -e

PROJECT_ID=$1
REGION="us-central1"
SERVICE_NAME="dadis-care-backend"
IMAGE="gcr.io/$PROJECT_ID/$SERVICE_NAME"

if [ -z "$PROJECT_ID" ]; then
  echo "❌ ERROR: Please provide your GCP Project ID."
  echo "   Usage: bash deploy.sh YOUR_PROJECT_ID"
  exit 1
fi

echo "============================================"
echo "  Deploying Dadi's Care Hub to GCP"
echo "  Project: $PROJECT_ID | Region: $REGION"
echo "============================================"

# --- 1. Set active project ---
echo "→ Setting active GCP project..."
gcloud config set project "$PROJECT_ID"

# --- 2. Enable required GCP APIs ---
echo "→ Enabling required GCP APIs..."
gcloud services enable \
  run.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com \
  --project "$PROJECT_ID"

# --- 3. Build & push Docker image for backend ---
echo "→ Building and pushing backend Docker image..."
cd backend
gcloud builds submit --tag "$IMAGE" .
cd ..

# --- 4. Deploy backend to Cloud Run ---
echo "→ Deploying backend to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --project "$PROJECT_ID"

CLOUD_RUN_URL=$(gcloud run services describe "$SERVICE_NAME" \
  --platform managed --region "$REGION" \
  --format "value(status.url)" --project "$PROJECT_ID")

echo "✅ Backend deployed at: $CLOUD_RUN_URL"

# --- 5. Build React frontend ---
echo "→ Building React frontend..."
cd frontend
npm run build
cd ..

# --- 6. Deploy frontend to Firebase Hosting ---
echo "→ Deploying frontend to Firebase Hosting..."
firebase deploy --only hosting --project "$PROJECT_ID"

echo ""
echo "============================================"
echo "  🎉 Deployment Complete!"
echo "  Backend  → $CLOUD_RUN_URL"
echo "  Frontend → https://$PROJECT_ID.web.app"
echo "============================================"
