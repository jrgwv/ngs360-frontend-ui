import { describe, expect, it } from 'vitest'
import { loginView } from '@/lib/login-view'

const base = { isPending: false, isError: false, hasCorpProvider: false }

describe('loginView', () => {
  it('shows SSO when the corporate provider is listed, in either mode', () => {
    expect(loginView({ ...base, localAuthEnabled: false, hasCorpProvider: true })).toBe('sso')
    expect(loginView({ ...base, localAuthEnabled: true, hasCorpProvider: true })).toBe('sso')
  })

  it('never falls back to the password form when password accounts are off', () => {
    // Provider list failed (API restarting) or came back without a corp provider.
    expect(loginView({ ...base, localAuthEnabled: false, isError: true })).toBe('unavailable')
    expect(loginView({ ...base, localAuthEnabled: false })).toBe('unavailable')
  })

  it('shows a loading state while the provider list is pending', () => {
    expect(loginView({ ...base, localAuthEnabled: false, isPending: true })).toBe('loading')
  })

  it('keeps the upstream password form when password accounts are on', () => {
    expect(loginView({ ...base, localAuthEnabled: true, isError: true })).toBe('password')
  })
})
