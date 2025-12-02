// Simple test file untuk API endpoints
async function testDashboardAPI() {
  try {
    const response = await fetch("http://localhost:3000/api/admin/dashboard");
    const data = await response.json();
    
    console.log("Dashboard API Response:");
    console.log(JSON.stringify(data, null, 2));
    
    if (data.productsByCategory) {
      console.log("✓ productsByCategory:", data.productsByCategory.length, "items");
    }
    if (data.shopsByProvince) {
      console.log("✓ shopsByProvince:", data.shopsByProvince.length, "items");
    }
    if (data.sellerStats) {
      console.log("✓ sellerStats:", data.sellerStats);
    }
  } catch (error) {
    console.error("Error testing Dashboard API:", error);
  }
}

async function testSellerDashboardAPI() {
  try {
    const response = await fetch("http://localhost:3000/api/seller/dashboard?sellerId=2");
    const data = await response.json();
    
    console.log("\nSeller Dashboard API Response:");
    console.log(JSON.stringify(data, null, 2));
    
    if (data.stockByProduct) {
      console.log("✓ stockByProduct:", data.stockByProduct.length, "items");
    }
    if (data.ratingByProduct) {
      console.log("✓ ratingByProduct:", data.ratingByProduct.length, "items");
    }
  } catch (error) {
    console.error("Error testing Seller Dashboard API:", error);
  }
}

async function testReportAPIs() {
  const reports = [
    { name: "Admin Sellers Report", url: "http://localhost:3000/api/admin/report/sellers" },
    { name: "Admin Shops Report", url: "http://localhost:3000/api/admin/report/shops-by-province" },
    { name: "Admin Products Report", url: "http://localhost:3000/api/admin/report/products-rating" },
    { name: "Seller Stock Report", url: "http://localhost:3000/api/seller/report/stock?sellerId=2" },
    { name: "Seller Rating Report", url: "http://localhost:3000/api/seller/report/rating?sellerId=2" },
    { name: "Seller Low Stock Report", url: "http://localhost:3000/api/seller/report/low-stock?sellerId=2" },
  ];

  for (const report of reports) {
    try {
      const response = await fetch(report.url);
      const contentType = response.headers.get("content-type");
      console.log(`\n✓ ${report.name}: ${response.status} (${contentType})`);
    } catch (error) {
      console.error(`✗ ${report.name}: ${error.message}`);
    }
  }
}

async function runTests() {
  console.log("🧪 Campus Market Platform - API Testing\n");
  console.log("=" .repeat(50));
  
  await testDashboardAPI();
  await testSellerDashboardAPI();
  await testReportAPIs();
  
  console.log("\n" + "=".repeat(50));
  console.log("✓ Testing Complete");
}

runTests();
