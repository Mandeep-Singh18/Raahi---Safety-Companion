import { NextRequest, NextResponse } from "next/server";
import { readContacts, createContact, validateContact } from "@/lib/contacts";
import type { ApiError } from "@/types";

/**
 * GET /api/contacts
 * Returns the full list of stored contacts.
 */
export async function GET() {
  try {
    const contacts = readContacts();
    return NextResponse.json(contacts, { status: 200 });
  } catch {
    const error: ApiError = { error: "Failed to read contacts." };
    return NextResponse.json(error, { status: 500 });
  }
}

/**
 * POST /api/contacts
 * Creates a new contact after server-side validation.
 *
 * Body: { name: string, contactInfo: string }
 * Returns: 201 Contact on success, 400 ApiError on validation failure.
 */
export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const error: ApiError = { error: "Invalid JSON body." };
    return NextResponse.json(error, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    const error: ApiError = { error: "Request body must be a JSON object." };
    return NextResponse.json(error, { status: 400 });
  }

  const { name, contactInfo } = body as Record<string, unknown>;

  // Server-side validation — never trust client input
  const validation = validateContact({
    name: typeof name === "string" ? name : "",
    contactInfo: typeof contactInfo === "string" ? contactInfo : "",
  });

  if (!validation.valid) {
    const error: ApiError = {
      error: "Validation failed.",
      details: validation.errors,
    };
    return NextResponse.json(error, { status: 400 });
  }

  try {
    // Vercel's filesystem is ephemeral; the browser stores contacts locally.
    const newContact = createContact({
      name: typeof name === "string" ? name : "",
      contactInfo: typeof contactInfo === "string" ? contactInfo : "",
    });
    return NextResponse.json(newContact, { status: 201 });
  } catch {
    const error: ApiError = { error: "Failed to save contact." };
    return NextResponse.json(error, { status: 500 });
  }
}

/**
 * DELETE /api/contacts?id=<contactId>
 * Removes a contact by ID.
 */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    const error: ApiError = { error: "Missing required query parameter: id" };
    return NextResponse.json(error, { status: 400 });
  }

  // The browser owns contact storage; the client removes this ID from localStorage.
  return NextResponse.json({ success: true, id }, { status: 200 });
}
