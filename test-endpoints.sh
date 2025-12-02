#!/bin/bash

echo "🧪 Testing Campus Market Platform"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Dashboard Admin API
echo -e "${YELLOW}Test 1: Dashboard Admin API${NC}"
response=$(curl -s -w "\n%{http_code}" http://localhost:3000/api/admin/dashboard)
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$status" = "200" ]; then
  echo -e "${GREEN}✓ Dashboard API responding${NC}"
  if echo "$body" | grep -q "productsByCategory"; then
    echo -e "${GREEN}✓ Response contains productsByCategory${NC}"
  fi
  if echo "$body" | grep -q "shopsByProvince"; then
    echo -e "${GREEN}✓ Response contains shopsByProvince${NC}"
  fi
else
  echo -e "${RED}✗ Dashboard API returned status $status${NC}"
fi
echo ""

# Test 2: Seller Dashboard API
echo -e "${YELLOW}Test 2: Seller Dashboard API${NC}"
response=$(curl -s -w "\n%{http_code}" "http://localhost:3000/api/seller/dashboard?sellerId=2")
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$status" = "200" ]; then
  echo -e "${GREEN}✓ Seller Dashboard API responding${NC}"
  if echo "$body" | grep -q "stockByProduct"; then
    echo -e "${GREEN}✓ Response contains stockByProduct${NC}"
  fi
else
  echo -e "${RED}✗ Seller Dashboard API returned status $status${NC}"
fi
echo ""

# Test 3: Admin Report - Sellers
echo -e "${YELLOW}Test 3: Admin Report - Sellers PDF${NC}"
response=$(curl -s -w "\n%{http_code}" -o /tmp/sellers_report.pdf http://localhost:3000/api/admin/report/sellers)
status=$(echo "$response" | tail -n1)

if [ "$status" = "200" ]; then
  filesize=$(stat -f%z /tmp/sellers_report.pdf 2>/dev/null || stat -c%s /tmp/sellers_report.pdf 2>/dev/null)
  if [ "$filesize" -gt 0 ]; then
    echo -e "${GREEN}✓ Sellers report PDF generated (${filesize} bytes)${NC}"
  fi
else
  echo -e "${RED}✗ Sellers report API returned status $status${NC}"
fi
echo ""

# Test 4: Admin Report - Shops by Province
echo -e "${YELLOW}Test 4: Admin Report - Shops by Province PDF${NC}"
response=$(curl -s -w "\n%{http_code}" -o /tmp/shops_report.pdf http://localhost:3000/api/admin/report/shops-by-province)
status=$(echo "$response" | tail -n1)

if [ "$status" = "200" ]; then
  filesize=$(stat -f%z /tmp/shops_report.pdf 2>/dev/null || stat -c%s /tmp/shops_report.pdf 2>/dev/null)
  if [ "$filesize" -gt 0 ]; then
    echo -e "${GREEN}✓ Shops report PDF generated (${filesize} bytes)${NC}"
  fi
else
  echo -e "${RED}✗ Shops report API returned status $status${NC}"
fi
echo ""

# Test 5: Admin Report - Products with Rating
echo -e "${YELLOW}Test 5: Admin Report - Products with Rating PDF${NC}"
response=$(curl -s -w "\n%{http_code}" -o /tmp/products_report.pdf http://localhost:3000/api/admin/report/products-rating)
status=$(echo "$response" | tail -n1)

if [ "$status" = "200" ]; then
  filesize=$(stat -f%z /tmp/products_report.pdf 2>/dev/null || stat -c%s /tmp/products_report.pdf 2>/dev/null)
  if [ "$filesize" -gt 0 ]; then
    echo -e "${GREEN}✓ Products report PDF generated (${filesize} bytes)${NC}"
  fi
else
  echo -e "${RED}✗ Products report API returned status $status${NC}"
fi
echo ""

# Test 6: Seller Report - Stock
echo -e "${YELLOW}Test 6: Seller Report - Stock PDF${NC}"
response=$(curl -s -w "\n%{http_code}" -o /tmp/stock_report.pdf "http://localhost:3000/api/seller/report/stock?sellerId=2")
status=$(echo "$response" | tail -n1)

if [ "$status" = "200" ]; then
  filesize=$(stat -f%z /tmp/stock_report.pdf 2>/dev/null || stat -c%s /tmp/stock_report.pdf 2>/dev/null)
  if [ "$filesize" -gt 0 ]; then
    echo -e "${GREEN}✓ Stock report PDF generated (${filesize} bytes)${NC}"
  fi
else
  echo -e "${RED}✗ Stock report API returned status $status${NC}"
fi
echo ""

# Test 7: Seller Report - Rating
echo -e "${YELLOW}Test 7: Seller Report - Rating PDF${NC}"
response=$(curl -s -w "\n%{http_code}" -o /tmp/rating_report.pdf "http://localhost:3000/api/seller/report/rating?sellerId=2")
status=$(echo "$response" | tail -n1)

if [ "$status" = "200" ]; then
  filesize=$(stat -f%z /tmp/rating_report.pdf 2>/dev/null || stat -c%s /tmp/rating_report.pdf 2>/dev/null)
  if [ "$filesize" -gt 0 ]; then
    echo -e "${GREEN}✓ Rating report PDF generated (${filesize} bytes)${NC}"
  fi
else
  echo -e "${RED}✗ Rating report API returned status $status${NC}"
fi
echo ""

# Test 8: Seller Report - Low Stock
echo -e "${YELLOW}Test 8: Seller Report - Low Stock PDF${NC}"
response=$(curl -s -w "\n%{http_code}" -o /tmp/low_stock_report.pdf "http://localhost:3000/api/seller/report/low-stock?sellerId=2")
status=$(echo "$response" | tail -n1)

if [ "$status" = "200" ]; then
  filesize=$(stat -f%z /tmp/low_stock_report.pdf 2>/dev/null || stat -c%s /tmp/low_stock_report.pdf 2>/dev/null)
  if [ "$filesize" -gt 0 ]; then
    echo -e "${GREEN}✓ Low stock report PDF generated (${filesize} bytes)${NC}"
  fi
else
  echo -e "${RED}✗ Low stock report API returned status $status${NC}"
fi
echo ""

echo -e "${YELLOW}=================================="
echo -e "✓ Testing Complete${NC}"
