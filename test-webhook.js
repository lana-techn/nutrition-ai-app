// Simple webhook test script
// Run with: node test-webhook.js

const crypto = require('crypto');

// Sample webhook payload
const payload = JSON.stringify({
  type: 'user.created',
  data: {
    id: 'user_test123',
    email_addresses: [{
      id: 'email_test123',
      email_address: 'test@example.com'
    }],
    primary_email_address_id: 'email_test123',
    first_name: 'Test',
    last_name: 'User',
    image_url: 'https://example.com/avatar.jpg',
    created_at: Date.now()
  }
});

const timestamp = Math.floor(Date.now() / 1000);
const webhookSecret = 'your-webhook-secret'; // Replace with actual secret

// This is just for testing - in real webhook, Clerk handles signature generation
console.log('Test payload:', payload);
console.log('Timestamp:', timestamp);
console.log('Webhook endpoint: http://localhost:3000/api/webhooks/clerk');