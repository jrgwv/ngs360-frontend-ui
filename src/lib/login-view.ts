/**
 * Which login screen to show. Pure so the rules can be tested without rendering.
 *
 * The rule that matters: when password accounts are off, the password form is
 * never shown, not even as a fallback when the provider list cannot be loaded
 * (for example while the API is restarting). Showing it would offer a sign-up
 * path that does not exist.
 */
export type LoginView = 'sso' | 'loading' | 'unavailable' | 'password'

export function loginView(opts: {
  localAuthEnabled: boolean
  isPending: boolean
  isError: boolean
  hasCorpProvider: boolean
}): LoginView {
  if (opts.hasCorpProvider) return 'sso'
  if (!opts.localAuthEnabled) {
    if (opts.isPending) return 'loading'
    return 'unavailable'
  }
  return 'password'
}
