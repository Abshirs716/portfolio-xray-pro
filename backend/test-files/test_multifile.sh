#!/bin/bash
echo "Testing Step 2.5 - Multi-file upload with custom mappings"
echo "==========================================================="

# Test 1: Standard format files (should work without mapping)
echo -e "\n1. Testing standard format files (positions + prices):"
curl -X POST "http://localhost:8000/ingest/batch" \
  -F "firm_id=1" \
  -F "client_id=1" \
  -F "as_of_date=2025-08-21" \
  -F "files=@positions.csv" \
  -F "files=@prices.csv" \
  | python3 -m json.tool

# Test 2: Schwab format (will need mapping)
echo -e "\n2. Testing Schwab format (custom headers):"
curl -X POST "http://localhost:8000/ingest/batch" \
  -F "firm_id=1" \
  -F "client_id=1" \
  -F "as_of_date=2025-08-21" \
  -F "files=@schwab_positions.csv" \
  | python3 -m json.tool

# Test 3: Multiple custodian files together
echo -e "\n3. Testing multiple custodian formats:"
curl -X POST "http://localhost:8000/ingest/batch" \
  -F "firm_id=1" \
  -F "client_id=1" \
  -F "as_of_date=2025-08-21" \
  -F "files=@fidelity_holdings.csv" \
  -F "files=@td_account.csv" \
  -F "files=@vanguard_prices.csv" \
  | python3 -m json.tool

# Check saved mappings
echo -e "\n4. Checking saved mappings:"
curl "http://localhost:8000/mappings?firm_id=1" | python3 -m json.tool

# Check database counts
echo -e "\n5. Database status:"
psql -d capx100_dev -c "SELECT COUNT(*) as total_positions FROM positions;"
psql -d capx100_dev -c "SELECT COUNT(*) as total_batches FROM batches;"
psql -d capx100_dev -c "SELECT COUNT(*) as saved_mappings FROM mappings;"
