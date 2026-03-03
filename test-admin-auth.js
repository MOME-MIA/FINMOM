const http = require('http');

async function testAdmin() {
    // We already know the middleware redirected curl without cookies.
    // Let's print the environment variables to see if there's any misconfiguration.
    console.log("NEXT_PUBLIC_INSFORGE_URL:", process.env.NEXT_PUBLIC_INSFORGE_URL);
}

testAdmin();
