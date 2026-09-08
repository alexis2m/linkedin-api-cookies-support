import { beforeAll, describe, expect, test } from 'vitest'

import { LinkedInClient } from './linkedin-client'

const validCookies =
  'li_at=AQEDATESTVALUE; JSESSIONID="ajax:1234567890"; lang=v=2&lang=en-us'

describe('LinkedInClient cookie-based auth', () => {
  beforeAll(() => {
    // Ensure env-based defaults don't leak into these offline tests.
    // eslint-disable-next-line no-process-env
    delete process.env.LINKEDIN_EMAIL
    // eslint-disable-next-line no-process-env
    delete process.env.LINKEDIN_PASSWORD
    // eslint-disable-next-line no-process-env
    delete process.env.LINKEDIN_COOKIES
  })

  test('authenticates immediately with a raw cookie string', () => {
    const client = new LinkedInClient({ cookies: validCookies })
    expect(client.isAuthenticated).toBe(true)
  })

  test('does not require email or password when cookies are provided', () => {
    const client = new LinkedInClient({ cookies: validCookies })
    expect(client.email).toBeUndefined()
    expect(client.password).toBeUndefined()
  })

  test('throws if cookies are missing JSESSIONID', () => {
    expect(() => new LinkedInClient({ cookies: 'li_at=AQEDATEST' })).toThrow(
      /JSESSIONID/
    )
  })

  test('throws if cookies are missing li_at', () => {
    expect(
      () => new LinkedInClient({ cookies: 'JSESSIONID="ajax:123"' })
    ).toThrow(/li_at/)
  })

  test('throws without email, password, or cookies', () => {
    expect(() => new LinkedInClient()).toThrow()
  })

  test('authenticate() rejects when only cookies are available', async () => {
    const client = new LinkedInClient({ cookies: validCookies })
    await expect(client.authenticate()).rejects.toThrow(/email/)
  })
})
