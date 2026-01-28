import type { APIRoute } from 'astro'
import { schema } from '../../lib/zod'
import { addEventToDB } from '../../lib/db'

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData()

  const validatedFields = schema.safeParse({
    title: formData.get('title'),
    start_time: formData.get('start_time'),
    end_time: formData.get('end_time'),
    website: formData.get('website'),
    description: formData.get('description'),
    location: formData.get('location'),
  })

  if (!validatedFields.success) {
    const message = 'Failed to create event. Please check your inputs.'
    return redirect(`/add-event?form=add&error=${encodeURIComponent(message)}`)
  }

  try {
    await addEventToDB(validatedFields.data)
    return redirect('/add-event?form=add&success=Event+created+successfully!')
  } catch (error) {
    console.error('Database error:', error)
    return redirect(`/add-event?form=add&error=${encodeURIComponent('Error: Failed to create event.')}`)
  }
}
