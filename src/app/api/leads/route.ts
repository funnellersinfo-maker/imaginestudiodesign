import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, businessType, email, message } = body;

    if (!name || !phone || !businessType) {
      return NextResponse.json(
        { error: "Name, phone, and business type are required." },
        { status: 400 }
      );
    }

    const lead = await db.lead.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        businessType: businessType.trim(),
        email: email?.trim() || null,
        message: message?.trim() || null,
        source: "website",
        status: "new",
      },
    });

    return NextResponse.json(
      { success: true, id: lead.id, message: "Quote request received! We'll contact you within 24 hours." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit your request. Please try again or call us directly." },
      { status: 500 }
    );
  }
}
