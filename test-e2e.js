/**
 * END-TO-END TEST SCRIPT
 * Test semua alur: Pembeli & Penjual
 */

const BASE_URL = "http://localhost:3001";

// Test data
const buyerData = {
  role: "pembeli",
  nama: "Test Pembeli E2E",
  noHP: "081234567890",
  email: `buyer.e2e.${Date.now()}@test.com`,
  password: "TestPass123!",
  confirmPassword: "TestPass123!",
  alamatJalan: "Jl. Test No. 1",
  rt: "01",
  rw: "01",
  namaKelurahan: "Test",
  kecamatan: "Test",
  kabupatenKota: "Test",
  provinsi: "Test",
};

const sellerData = {
  role: "penjual",
  nama: "Test Penjual E2E",
  noHP: "081234567891",
  email: `seller.e2e.${Date.now()}@test.com`,
  password: "TestPass123!",
  confirmPassword: "TestPass123!",
  alamatJalan: "Jl. Seller Test No. 1",
  rt: "01",
  rw: "01",
  namaKelurahan: "Test",
  kecamatan: "Test",
  kabupatenKota: "Test",
  provinsi: "Test",
  noKtp: "1234567890123456",
  namaToko: "Test Toko",
  deskripsiToko: "Toko Test",
};

async function testBuyerFlow() {
  console.log("\n========== TESTING BUYER FLOW ==========\n");

  try {
    // 1. Register as buyer
    console.log("1️⃣  Registering buyer...");
    const formData = new FormData();
    Object.entries(buyerData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const registerRes = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      body: formData,
    });

    const registerData = await registerRes.json();
    console.log(`   Status: ${registerRes.status}`);
    console.log(`   Message: ${registerData.message}`);
    console.log(`   User ID: ${registerData.userId}`);

    if (!registerRes.ok) {
      throw new Error(`Register failed: ${registerData.error}`);
    }

    // 2. Login as buyer
    console.log("\n2️⃣  Logging in as buyer...");
    const loginRes = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: buyerData.email,
        password: buyerData.password,
      }),
    });

    const loginData = await loginRes.json();
    console.log(`   Status: ${loginRes.status}`);
    console.log(`   Message: ${loginData.message}`);
    console.log(`   User Role: ${loginData.user?.role}`);
    console.log(`   User Status Verifikasi: ${loginData.user?.statusVerifikasi}`);

    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginData.error}`);
    }

    if (loginData.user?.statusVerifikasi !== "verified") {
      throw new Error("Buyer should be verified immediately");
    }

    console.log("\n✅ BUYER FLOW SUCCESS!\n");
    return true;
  } catch (error) {
    console.error(`\n❌ BUYER FLOW FAILED: ${error.message}\n`);
    return false;
  }
}

async function testSellerFlow() {
  console.log("========== TESTING SELLER FLOW ==========\n");

  try {
    // 1. Register as seller
    console.log("1️⃣  Registering seller...");
    const formData = new FormData();
    Object.entries(sellerData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const registerRes = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      body: formData,
    });

    const registerData = await registerRes.json();
    console.log(`   Status: ${registerRes.status}`);
    console.log(`   Message: ${registerData.message}`);
    console.log(`   User ID: ${registerData.userId}`);

    if (!registerRes.ok) {
      throw new Error(`Register failed: ${registerData.error}`);
    }

    const sellerId = registerData.userId;

    // 2. Try login as pending seller (should work but redirect)
    console.log("\n2️⃣  Logging in as pending seller...");
    const loginRes = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: sellerData.email,
        password: sellerData.password,
      }),
    });

    const loginData = await loginRes.json();
    console.log(`   Status: ${loginRes.status}`);
    console.log(`   User Role: ${loginData.user?.role}`);
    console.log(`   User Status Verifikasi: ${loginData.user?.statusVerifikasi}`);

    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginData.error}`);
    }

    if (loginData.user?.statusVerifikasi !== "pending") {
      throw new Error("Seller should be pending after registration");
    }

    // 3. Simulate admin approval
    console.log("\n3️⃣  Simulating admin approval...");
    // Note: This would need admin token in real scenario
    // For now, we'll just show the expected flow
    console.log(`   ⚠️  Admin approval requires authentication (skipped in test)`);
    console.log(`   Expected: Token generated + Email sent to ${sellerData.email}`);

    console.log("\n✅ SELLER FLOW PARTIAL SUCCESS (admin flow not testable without auth)!\n");
    return true;
  } catch (error) {
    console.error(`\n❌ SELLER FLOW FAILED: ${error.message}\n`);
    return false;
  }
}

async function runAllTests() {
  console.log("\n╔═══════════════════════════════════════╗");
  console.log("║   END-TO-END TEST SUITE              ║");
  console.log("║   Campus Market Email Verification   ║");
  console.log("╚═══════════════════════════════════════╝\n");

  const buyerSuccess = await testBuyerFlow();
  const sellerSuccess = await testSellerFlow();

  console.log("╔═══════════════════════════════════════╗");
  console.log("║   TEST SUMMARY                       ║");
  console.log("╠═══════════════════════════════════════╣");
  console.log(`║ Buyer Flow:      ${buyerSuccess ? "✅ PASS" : "❌ FAIL"}                  ║`);
  console.log(`║ Seller Flow:     ${sellerSuccess ? "✅ PASS" : "❌ FAIL"}                  ║`);
  console.log("╚═══════════════════════════════════════╝\n");

  process.exit(buyerSuccess && sellerSuccess ? 0 : 1);
}

// Run tests
runAllTests().catch(console.error);
