import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simulate database storage / email sending
    console.log('New Contact Message:', { name, email, message });
    
    // In a real scenario, you'd integrate with a CMS or Database here
    // e.g., await db.messages.create({ data: { name, email, message } })

    return NextResponse.json(
      { success: true, message: 'Communication received' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
