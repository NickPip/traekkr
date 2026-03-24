import { NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const ORDER_TO_EMAIL = process.env.ORDER_TO_EMAIL || process.env.ADMIN_EMAIL

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message, serviceTitle } = body

    if (!name || !email || !serviceTitle) {
      return NextResponse.json(
        { error: 'Name, email and service are required.' },
        { status: 400 }
      )
    }

    if (!RESEND_API_KEY || !ORDER_TO_EMAIL) {
      console.error(
        'Order API: set RESEND_API_KEY and ORDER_TO_EMAIL (or ADMIN_EMAIL) to receive orders.'
      )
      return NextResponse.json(
        { error: 'Order submission is not configured.' },
        { status: 503 }
      )
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Traekkr <onboarding@resend.dev>',
        to: [ORDER_TO_EMAIL],
        subject: `Order: ${serviceTitle} from ${name}`,
        html: `
            <p><strong>Service:</strong> ${serviceTitle}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${message ? `<p><strong>Message:</strong></p><p>${String(message).replace(/\n/g, '<br>')}</p>` : ''}
          `,
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return NextResponse.json(
        { error: 'Failed to submit order.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Order API error:', e)
    return NextResponse.json(
      { error: 'Failed to submit order.' },
      { status: 500 }
    )
  }
}
