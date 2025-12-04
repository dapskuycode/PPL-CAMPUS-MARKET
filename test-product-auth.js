/**
 * Test Script: Product Authentication & Ownership Validation
 * 
 * Test Cases:
 * 1. Create product without auth → 401
 * 2. Create product with seller auth → 200
 * 3. Edit someone else's product → 403
 * 4. Edit own product → 200
 * 5. Delete someone else's product → 403
 * 6. Delete own product → 200
 * 7. Upload without auth → 401
 * 8. Upload non-image file → 400
 * 9. Upload file > 5MB → 400
 * 
 * Manual Testing Steps (Browser Console):
 * 
 * Setup:
 * 1. Login as Seller A, note idUser from localStorage
 * 2. Login as Seller B in incognito/different browser, note idUser
 * 
 * Test 1: Create Product Without Auth
 * ```javascript
 * fetch('http://localhost:3000/api/products', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     namaProduk: 'Test Product',
 *     harga: 100000,
 *     stok: 10,
 *     idCategory: 1
 *   })
 * }).then(r => r.json()).then(console.log); // Expected: 401 Unauthorized
 * ```
 * 
 * Test 2: Create Product With Seller Auth
 * ```javascript
 * const user = JSON.parse(localStorage.getItem('user'));
 * fetch('http://localhost:3000/api/products', {
 *   method: 'POST',
 *   headers: { 
 *     'Content-Type': 'application/json',
 *     'x-user-data': JSON.stringify(user)
 *   },
 *   body: JSON.stringify({
 *     namaProduk: 'My Product',
 *     harga: 150000,
 *     stok: 5,
 *     idCategory: 1,
 *     kondisi: 'baru'
 *   })
 * }).then(r => r.json()).then(data => {
 *   console.log(data); // Expected: 200 with product data
 *   window.testProductId = data.idProduct; // Save for later tests
 * });
 * ```
 * 
 * Test 3: Edit Someone Else's Product (Use Seller B's browser)
 * ```javascript
 * const user = JSON.parse(localStorage.getItem('user'));
 * fetch('http://localhost:3000/api/products/' + window.testProductId, {
 *   method: 'PUT',
 *   headers: { 
 *     'Content-Type': 'application/json',
 *     'x-user-data': JSON.stringify(user)
 *   },
 *   body: JSON.stringify({
 *     namaProduk: 'Hacked Product',
 *     harga: 1
 *   })
 * }).then(r => r.json()).then(console.log); // Expected: 403 Forbidden
 * ```
 * 
 * Test 4: Edit Own Product (Use Seller A's browser)
 * ```javascript
 * const user = JSON.parse(localStorage.getItem('user'));
 * fetch('http://localhost:3000/api/products/' + window.testProductId, {
 *   method: 'PUT',
 *   headers: { 
 *     'Content-Type': 'application/json',
 *     'x-user-data': JSON.stringify(user)
 *   },
 *   body: JSON.stringify({
 *     namaProduk: 'Updated Product',
 *     harga: 200000
 *   })
 * }).then(r => r.json()).then(console.log); // Expected: 200 with updated data
 * ```
 * 
 * Test 5: Delete Someone Else's Product (Use Seller B's browser)
 * ```javascript
 * const user = JSON.parse(localStorage.getItem('user'));
 * fetch('http://localhost:3000/api/products/' + window.testProductId, {
 *   method: 'DELETE',
 *   headers: { 
 *     'x-user-data': JSON.stringify(user)
 *   }
 * }).then(r => r.json()).then(console.log); // Expected: 403 Forbidden
 * ```
 * 
 * Test 6: Delete Own Product (Use Seller A's browser)
 * ```javascript
 * const user = JSON.parse(localStorage.getItem('user'));
 * fetch('http://localhost:3000/api/products/' + window.testProductId, {
 *   method: 'DELETE',
 *   headers: { 
 *     'x-user-data': JSON.stringify(user)
 *   }
 * }).then(r => r.json()).then(console.log); // Expected: 200 success
 * ```
 * 
 * Test 7: Upload Without Auth
 * ```javascript
 * const formData = new FormData();
 * formData.append('images', new File(['test'], 'test.jpg', { type: 'image/jpeg' }));
 * fetch('http://localhost:3000/api/upload', {
 *   method: 'POST',
 *   body: formData
 * }).then(r => r.json()).then(console.log); // Expected: 401 Unauthorized
 * ```
 * 
 * Test 8: Upload Non-Image File
 * ```javascript
 * const user = JSON.parse(localStorage.getItem('user'));
 * const formData = new FormData();
 * formData.append('images', new File(['malware'], 'virus.exe', { type: 'application/exe' }));
 * fetch('http://localhost:3000/api/upload', {
 *   method: 'POST',
 *   headers: { 'x-user-data': JSON.stringify(user) },
 *   body: formData
 * }).then(r => r.json()).then(console.log); // Expected: 400 invalid file type
 * ```
 * 
 * Test 9: Validation Tests
 * ```javascript
 * const user = JSON.parse(localStorage.getItem('user'));
 * // Invalid price
 * fetch('http://localhost:3000/api/products', {
 *   method: 'POST',
 *   headers: { 
 *     'Content-Type': 'application/json',
 *     'x-user-data': JSON.stringify(user)
 *   },
 *   body: JSON.stringify({
 *     namaProduk: 'Test',
 *     harga: -100,
 *     stok: 10,
 *     idCategory: 1
 *   })
 * }).then(r => r.json()).then(console.log); // Expected: 400 harga must be > 0
 * 
 * // Invalid stock
 * fetch('http://localhost:3000/api/products', {
 *   method: 'POST',
 *   headers: { 
 *     'Content-Type': 'application/json',
 *     'x-user-data': JSON.stringify(user)
 *   },
 *   body: JSON.stringify({
 *     namaProduk: 'Test',
 *     harga: 100000,
 *     stok: -5,
 *     idCategory: 1
 *   })
 * }).then(r => r.json()).then(console.log); // Expected: 400 stok must be >= 0
 * ```
 * 
 * UI Testing (Dashboard):
 * 1. Login as seller → Go to dashboard
 * 2. Create new product → Should succeed
 * 3. Edit product → Should succeed
 * 4. Delete product → Should succeed
 * 5. Check browser console for errors
 * 6. Verify all requests include x-user-data header
 */

console.log('Product Authentication Test Suite');
console.log('Run tests manually in browser console');
console.log('See comments above for test commands');
