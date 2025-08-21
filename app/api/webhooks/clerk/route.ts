import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { handleError } from "@/lib/utils";
import User from "@/lib/database/models/user.model";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { connectToDatabase } from "@/lib/database/mongoose"; // Adjust path

export async function POST(req: Request) {
  try {
    // Connect to DB early for logging DB status
    await connectToDatabase();
    console.log("✅ Database connected");

    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) throw new Error("Missing WEBHOOK_SECRET");

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing Svix headers");
      return new Response("Missing Svix headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
      console.log("✅ Webhook verified");
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response("Webhook verification failed", { status: 400 });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`🔔 Received event: ${eventType} for user ${id}`);

    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        image_url,
        first_name,
        last_name,
        username,
      } = evt.data;

      const user = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || "no-email",
        username: username ?? "no-username",
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        photo: image_url ?? "",
      };

      const newUser = await createUser(user);
      console.log("✅ User created in DB:", newUser?._id ?? "No ID");

      if (newUser) {
        const client = await clerkClient();

        await client.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
        });
        console.log("✅ Clerk user metadata updated");
      }

      return NextResponse.json({ message: "OK", user: newUser });
    }

    if (eventType === "user.updated") {
      const { id, image_url, first_name, last_name, username } = evt.data;

      const user = {
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        username: username ?? "no-username",
        photo: image_url ?? "",
      };

      const updatedUser = await updateUser(id, user);
      console.log("✅ User updated in DB:", updatedUser?._id ?? "No ID");

      return NextResponse.json({ message: "OK", user: updatedUser });
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      const deletedUser = await deleteUser(id!);
      console.log("✅ User deleted from DB:", deletedUser?._id ?? "No ID");

      return NextResponse.json({ message: "OK", user: deletedUser });
    }

    console.log(`Unhandled event type: ${eventType}`);

    return new Response("", { status: 200 });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
