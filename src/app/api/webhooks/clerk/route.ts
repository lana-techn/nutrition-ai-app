import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Handle the webhook
  const { type, data } = evt;

  try {
    switch (type) {
      case 'user.created': {
        const { id, email_addresses, first_name, last_name, image_url, created_at } = data;
        
        // Get primary email
        const primaryEmail = email_addresses.find(email => email.id === data.primary_email_address_id);
        
        if (!primaryEmail) {
          console.error('No primary email found for user:', id);
          return new Response('No primary email found', { status: 400 });
        }

        // Insert user into database
        await db.insert(users).values({
          clerkId: id,
          name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
          email: primaryEmail.email_address,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
          createdAt: new Date(created_at),
        });

        console.log('User created in database:', id);
        break;
      }

      case 'user.updated': {
        const { id, email_addresses, first_name, last_name, image_url, last_sign_in_at } = data;
        
        // Get primary email
        const primaryEmail = email_addresses.find(email => email.id === data.primary_email_address_id);
        
        if (!primaryEmail) {
          console.error('No primary email found for user:', id);
          return new Response('No primary email found', { status: 400 });
        }

        // Update user in database
        await db.update(users)
          .set({
            name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
            email: primaryEmail.email_address,
            firstName: first_name,
            lastName: last_name,
            imageUrl: image_url,
            lastSignInAt: last_sign_in_at ? new Date(last_sign_in_at) : null,
            updatedAt: new Date(),
          })
          .where(eq(users.clerkId, id));

        console.log('User updated in database:', id);
        break;
      }

      case 'user.deleted': {
        const { id } = data;
        
        // Delete user from database
        if (id) {
          await db.delete(users).where(eq(users.clerkId, id));
          console.log('User deleted from database:', id);
        }
        
        break;
      }

      default:
        console.log('Unhandled webhook type:', type);
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}