import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { clerkClient, WebhookEvent, UserJSON } from '@clerk/nextjs/server'
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log("🔔 Webhook received");
  try {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
      throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature)
       {
        console.error("❌ Error: Missing svix headers");
      return new Response('Error occurred -- no svix headers', {
        status: 400
      })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error occurred', {
        status: 400
      })
    }

    const eventType = evt.type;

    switch (eventType) {
      case "user.created":
        return handleUserCreated(evt.data);
      case "user.updated":
        return handleUserUpdated(evt.data);
      case "user.deleted":
        return handleUserDeleted(evt.data);
      default:
        console.log(`🤔 Unhandled webhook event type: ${eventType}`);
        return new Response('', { status: 200 });
    }
    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return new Response('Error occurred', { status: 500 })
  }
}

async function handleUserCreated(data: WebhookEvent['data']) {
  if (!('email_addresses' in data)) {
    return new Response('Error occurred -- invalid data format', { status: 400 });
  }

  const userData = data as UserJSON;
  const { id, email_addresses, image_url, first_name, last_name, username } = userData;

  if (!id || email_addresses.length === 0) {
    return new Response('Error occurred -- missing data', { status: 405 });
  }

  // Determine signup method based on email verification status
  const signupMethod = email_addresses[0]?.verification?.strategy === 'oauth_google' ? 'google_auth' : 'email';

  const defaultUsername = `user_${id.slice(-6)}`;

  const user: CreateUserParams = {
    clerkId: id,
    email: email_addresses[0]?.email_address ?? '',
    username: username || defaultUsername,
    firstName: first_name ?? '',
    lastName: last_name ?? '',
    photo: image_url ?? '',
  };

  try {
    console.log("👤 Creating user:", user);
    const newUser = await createUser(user);

    if (!newUser) {
      console.error('Failed to create user in database');
      return new Response('Error creating user in database', { status: 500 });
    }

    console.log('Created user in database:', newUser);

    // Store the MongoDB _id in Clerk metadata
    await clerkClient.users.updateUserMetadata(id, {
      publicMetadata: {
        userId: newUser._id.toString(), // Ensure _id is converted to string
        signupMethod, // Store signup method in metadata for client-side access
      },
    });

    console.log('Updated Clerk metadata with MongoDB ID and signup method');
    return NextResponse.json({ message: "OK", user: newUser });
  } catch (error) {
    console.error('Error in handleUserCreated:', error);
    return new Response('Error creating user', { status: 500 });
  }
}

async function handleUserUpdated(data: WebhookEvent['data']) {
  if (!('id' in data)) {
    return new Response('Error occurred -- invalid data format', { status: 400 });
  }

  const userData = data as UserJSON;
  const { id, image_url, first_name, last_name, username } = userData;

  // Only include non-empty fields in the update
  const updateData: Record<string, string> = {};
  
  if (first_name) updateData.firstName = first_name;
  if (last_name) updateData.lastName = last_name;
  if (image_url) updateData.photo = image_url;
  
  // Only update username if it's not empty
  if (username && username.trim() !== '') {
    updateData.username = username;
  }

  // Only proceed with update if there are fields to update
  if (Object.keys(updateData).length > 0) {
    console.log("📝 Updating user:", id, updateData);
    const updatedUser = await updateUser(id, updateData);
    return NextResponse.json({ message: "OK", user: updatedUser });
  } else {
    console.log("⏭️ Skipping update for user:", id, "- No valid fields to update");
    return NextResponse.json({ message: "No fields to update" });
  }
}

async function handleUserDeleted(data: WebhookEvent['data']) {
  if (!('id' in data) || typeof data.id !== 'string') {
    return new Response('Error occurred -- invalid or missing id', { status: 400 });
  }

  const { id } = data;

  console.log("🗑️ Deleting user:", id);
  const deletedUser = await deleteUser(id);

  return NextResponse.json({ message: "OK", user: deletedUser });
}
