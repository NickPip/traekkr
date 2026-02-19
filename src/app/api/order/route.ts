import configPromise from '@payload-config'
import { getPayload } from 'payload'
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

    const payload = await getPayload({ config: await configPromise })
    await payload.create({
      collection: 'orders',
      data: {
        name: String(name).trim(),
        email: String(email).trim(),
        message: message ? String(message).trim() : '',
        serviceTitle: String(serviceTitle).trim(),
      },
    })

    if (RESEND_API_KEY && ORDER_TO_EMAIL) {
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
            ${message ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
          `,
        }),
      })
      if (!res.ok) {
        const err = await res.text()
        console.error('Resend error:', err)
      }
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
