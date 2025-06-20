// apiTest.js
const http = require("http");

const chalk = {
  red: (msg) => `\x1b[41m❌ ${msg}\x1b[0m`,
  green: (msg) => `\x1b[42m✅ ${msg}\x1b[0m`,
};

function logDivider(title) {
  console.log(`\n=== ${title.toUpperCase()} ===`);
}

async function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const result = {
          status: res.statusCode,
          body: (() => {
            try {
              return JSON.parse(data);
            } catch {
              return data;
            }
          })(),
        };

        const status = res.statusCode;
        const label =
          status >= 500
            ? chalk.red(`500 Error`)
            : status === 404
            ? chalk.red(`404 Not Found`)
            : chalk.green(`${status} OK`);
        console.log(`${label} → ${options.method} ${options.path}`);
        if (body) {
          console.log("  ▶ Request Body:", JSON.parse(body));
        }
        console.log("  ◀ Response:", result.body);
        resolve(result);
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runTests() {
  try {
    const host = "localhost", port = 3000;
    let res, userId, categoryId, productId, orderId, paymentId, reviewId;

    // Static files
    logDivider("Static Files");
    console.time("Static Files");
    res = await request({
      hostname: host,
      port,
      path: "/test.txt",
      method: "GET",
    });
    if (res.status !== 200 || typeof res.body !== "string")
      throw new Error("Static file test.txt failed");
    res = await request({
      hostname: host,
      port,
      path: "/style.css",
      method: "GET",
    });
    if (res.status !== 200 || typeof res.body !== "string")
      throw new Error("Static file style.css failed");
    console.timeEnd("Static Files");

    // Home page
    logDivider("Home Page");
    console.time("Home Page");
    res = await request({ hostname: host, port, path: "/", method: "GET" });
    if (res.status !== 200) throw new Error("Home page failed");
    console.timeEnd("Home Page");

    // USERS
    logDivider("Users");
    console.time("Users");
    res = await request(
      {
        hostname: host,
        port,
        path: "/api/users",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      JSON.stringify({
        name: "Alice",
        email: "alice@test.com",
        password: "1234",
      })
    );
    if (!res.body.id) throw new Error("User creation failed");
    userId = res.body.id;

    await request({
      hostname: host,
      port,
      path: `/api/users/${userId}`,
      method: "GET",
    });

    await request({ hostname: host, port, path: "/api/users", method: "GET" });

    await request(
      {
        hostname: host,
        port,
        path: `/api/users/${userId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      },
      JSON.stringify({ name: "Alice Updated" })
    );

    await request({
      hostname: host,
      port,
      path: `/api/users/${userId}`,
      method: "DELETE",
    });
    console.timeEnd("Users");

    // CATEGORIES
    logDivider("Categories");
    console.time("Categories");
    res = await request(
      {
        hostname: host,
        port,
        path: "/api/categories",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      JSON.stringify({ name: "Electronics" })
    );
    if (!res.body.id) throw new Error("Category creation failed");
    categoryId = res.body.id;

    await request({
      hostname: host,
      port,
      path: `/api/categories/${categoryId}`,
      method: "GET",
    });

    await request({
      hostname: host,
      port,
      path: "/api/categories",
      method: "GET",
    });

    await request(
      {
        hostname: host,
        port,
        path: `/api/categories/${categoryId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      },
      JSON.stringify({ name: "Gadgets" })
    );

    await request({
      hostname: host,
      port,
      path: `/api/categories/${categoryId}`,
      method: "DELETE",
    });
    console.timeEnd("Categories");

    // PRODUCTS
    logDivider("Products");
    console.time("Products");
    res = await request(
      {
        hostname: host,
        port,
        path: "/api/products",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      JSON.stringify({
        name: "Smartphone",
        price: 999.99,
        category: "Gadgets",
        stock: 10,
        description: "Latest model",
      })
    );
    if (!res.body.id) throw new Error("Product creation failed");
    productId = res.body.id;

    await request({
      hostname: host,
      port,
      path: `/api/products/${productId}`,
      method: "GET",
    });

    await request({
      hostname: host,
      port,
      path: "/api/products",
      method: "GET",
    });

    await request(
      {
        hostname: host,
        port,
        path: `/api/products/${productId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      },
      JSON.stringify({ price: 899.99 })
    );

    await request({
      hostname: host,
      port,
      path: `/api/products/${productId}`,
      method: "DELETE",
    });
    console.timeEnd("Products");

    // ORDERS
    logDivider("Orders");
    console.time("Orders");
    res = await request(
      {
        hostname: host,
        port,
        path: `/api/orders/${userId}/orders`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      JSON.stringify({
        productId,
        address: "Seoul",
        paymentMethod: "card",
      })
    );
    if (!res.body.id) throw new Error("Order creation failed");
    orderId = res.body.id;

    await request({
      hostname: host,
      port,
      path: `/api/orders/${userId}/orders`,
      method: "GET",
    });

    await request({
      hostname: host,
      port,
      path: `/api/orders/details/${orderId}`,
      method: "GET",
    });

    await request({
      hostname: host,
      port,
      path: `/api/orders/${orderId}`,
      method: "DELETE",
    });
    console.timeEnd("Orders");

    // PAYMENTS
    logDivider("Payments");
    console.time("Payments");
    res = await request(
      {
        hostname: host,
        port,
        path: `/api/payments/${orderId}/pay`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      JSON.stringify({
        paymentMethod: "card",
        cardNumber: "1111-2222-3333-4444",
        expiry: "01/30",
        cvc: "123",
      })
    );
    if (!res.body.id) throw new Error("Payment creation failed");
    paymentId = res.body.id;

    await request({
      hostname: host,
      port,
      path: `/api/payments/${paymentId}`,
      method: "GET",
    });
    console.timeEnd("Payments");

    // REVIEWS
    logDivider("Reviews");
    console.time("Reviews");
    res = await request(
      {
        hostname: host,
        port,
        path: `/api/reviews/${productId}/reviews`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      JSON.stringify({ userId, rating: 5, comment: "Great!" })
    );
    if (!res.body.id) throw new Error("Review creation failed");
    reviewId = res.body.id;

    await request({
      hostname: host,
      port,
      path: `/api/reviews/${productId}/reviews`,
      method: "GET",
    });

    await request(
      {
        hostname: host,
        port,
        path: `/api/reviews/${reviewId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      },
      JSON.stringify({ comment: "Updated!" })
    );

    await request({
      hostname: host,
      port,
      path: `/api/reviews/${reviewId}`,
      method: "DELETE",
    });
    console.timeEnd("Reviews");

    logDivider("✅ All tests passed!");
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ Test Failed: ${err.message}`);
    process.exit(1);
  }
}

runTests();












