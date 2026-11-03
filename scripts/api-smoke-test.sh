#!/usr/bin/env bash
# ShopWave API smoke test — exercises every endpoint.
set -u
BASE="http://localhost:4000/api"
PASS=0; FAIL=0

check() { # name, expected_fragment, actual
  if echo "$3" | grep -q "$2"; then PASS=$((PASS+1)); echo "✅ $1";
  else FAIL=$((FAIL+1)); echo "❌ $1 — expected '$2' in: $(echo "$3" | head -c 300)"; fi
}

# 1. Products list
R=$(curl -s "$BASE/products?limit=5")
check "GET /products" '"total":18' "$R"
check "GET /products limit" '"limit":5' "$R"

# 2. Search + filter + sort
R=$(curl -s "$BASE/products?search=headphones")
check "GET /products?search" 'aurora-anc-headphones' "$R"
R=$(curl -s "$BASE/products?category=Beauty")
check "GET /products?category" '"total":2' "$R"
R=$(curl -s "$BASE/products?sort=price-asc&limit=1")
check "GET /products sort asc" 'glowlab-vitamin-c-serum' "$R"

# 3. Single product + 404
R=$(curl -s "$BASE/products/aurora-anc-headphones")
check "GET /products/:id" '"brand":"Aurora Audio"' "$R"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/products/nope")
check "GET /products/:id 404" '404' "$CODE"

# 4. Categories
R=$(curl -s "$BASE/categories")
check "GET /categories" 'Home & Kitchen' "$R"

# 5. Product image
CT=$(curl -s -o /dev/null -w "%{content_type}" "$BASE/images/aurora-anc-headphones.svg")
check "GET /images/:id.svg" 'image/svg' "$CT"

# 6. Cart lifecycle
CART="test-cart-$RANDOM"
R=$(curl -s "$BASE/cart/$CART")
check "GET empty cart" '"itemCount":0' "$R"
R=$(curl -s -X POST "$BASE/cart/$CART/items" -H 'Content-Type: application/json' -d '{"productId":"aurora-anc-headphones","quantity":2}')
check "POST add item" '"itemCount":2' "$R"
R=$(curl -s -X PUT "$BASE/cart/$CART/items/aurora-anc-headphones" -H 'Content-Type: application/json' -d '{"quantity":3}')
check "PUT update qty" '"quantity":3' "$R"
R=$(curl -s -X POST "$BASE/cart/$CART/items" -H 'Content-Type: application/json' -d '{"productId":"zenmat-pro-yoga-mat","quantity":1}')
check "POST second item" '"itemCount":4' "$R"
R=$(curl -s -X DELETE "$BASE/cart/$CART/items/zenmat-pro-yoga-mat")
check "DELETE item" '"itemCount":3' "$R"

# 7. Cart validation errors
R=$(curl -s -X POST "$BASE/cart/$CART/items" -H 'Content-Type: application/json' -d '{"productId":"nope"}')
check "POST bad product" 'not found' "$R"
R=$(curl -s -X PUT "$BASE/cart/$CART/items/aurora-anc-headphones" -H 'Content-Type: application/json' -d '{"quantity":50}')
check "PUT over stock" 'in stock' "$R"

# 8. Totals math: 3 × 199.99 = 599.97 subtotal, free shipping (>=35), 5% tax = 30.00, total 629.97
R=$(curl -s "$BASE/cart/$CART")
check "cart subtotal" '"subtotal":599.97' "$R"
check "cart free shipping" '"shipping":0' "$R"
check "cart tax" '"tax":30' "$R"
check "cart total" '"total":629.97' "$R"

# 9. Order — invalid then valid
R=$(curl -s -X POST "$BASE/orders" -H 'Content-Type: application/json' -d '{"cartId":"'$CART'","customer":{"name":"A"}}')
check "POST order invalid" 'details' "$R"
R=$(curl -s -X POST "$BASE/orders" -H 'Content-Type: application/json' -d '{"cartId":"'$CART'","customer":{"name":"Test Buyer","email":"buyer@example.com","phone":"+201234567890","address":"1 Tahrir Square","city":"Cairo","country":"Egypt","paymentMethod":"cod"}}')
check "POST order created" '"status":"Confirmed"' "$R"
ORDER_ID=$(echo "$R" | sed -n 's/.*"id":"\(ORD-[A-Z0-9]*\)".*/\1/p')
check "order id generated" 'ORD-' "$ORDER_ID"
check "order total" '"total":629.97' "$R"

# 10. Cart cleared after order
R=$(curl -s "$BASE/cart/$CART")
check "cart cleared after order" '"itemCount":0' "$R"

# 11. Get order + list orders + 404
R=$(curl -s "$BASE/orders/$ORDER_ID")
check "GET /orders/:id" 'Test Buyer' "$R"
R=$(curl -s "$BASE/orders?limit=5")
check "GET /orders list" 'ORD-DEMO' "$R"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/orders/ORD-NOPE")
check "GET /orders/:id 404" '404' "$CODE"

# 12. Unknown route
R=$(curl -s "$BASE/definitely-not-a-route")
check "unknown route 404" 'not found' "$R"

echo "----------------------------------------"
echo "PASS: $PASS  FAIL: $FAIL"
[ "$FAIL" -eq 0 ] && echo "ALL SMOKE TESTS PASSED" || echo "SOME TESTS FAILED"
