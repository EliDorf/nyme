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

  const user: CreateUserParams = {
    clerkId: id,
    email: email_addresses[0]?.email_address ?? '',
    username: username ?? '',
    firstName: first_name ?? '',
    lastName: last_name ?? '',
    photo: image_url ?? '',
  };

  const newUser = await createUser(user);

  if (newUser) {
    await clerkClient.users.updateUserMetadata(id, {
      publicMetadata: {
        userId: newUser._id,
      },
    });
  }

  return NextResponse.json({ message: "OK", user: newUser });
}

async function handleUserUpdated(data: WebhookEvent['data']) {
  if (!('id' in data)) {
    return new Response('Error occurred -- invalid data format', { status: 400 });
  }

  const userData = data as UserJSON;
  const { id, image_url, first_name, last_name, username } = userData;

  const user = {
    firstName: first_name ?? '',
    lastName: last_name ?? '',
    username: username ?? '',
    photo: image_url ?? '',
  };

  const updatedUser = await updateUser(id, user);

  return NextResponse.json({ message: "OK", user: updatedUser });
}

async function handleUserDeleted(data: WebhookEvent['data']) {
  if (!('id' in data) || typeof data.id !== 'string') {
    return new Response('Error occurred -- invalid or missing id', { status: 400 });
  }

  const { id } = data;

  const deletedUser = await deleteUser(id);

  return NextResponse.json({ message: "OK", user: deletedUser });
}