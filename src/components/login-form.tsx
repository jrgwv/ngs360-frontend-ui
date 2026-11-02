import { useQuery } from '@tanstack/react-query'
import { getAvailableOauthProvidersOptions } from '@/client/@tanstack/react-query.gen'
import { LoginFormCorporate } from '@/components/login-form-corporate'
import { LoginFormDefault } from '@/components/login-form-default'
import { storePostLoginRedirect } from '@/lib/post-login-redirect'
import { API_BASE_URL } from '@/lib/api-base'
import { LOCAL_AUTH_ENABLED } from '@/lib/feature-flags'
import { loginView } from '@/lib/login-view'
import { Button } from '@/components/ui/button'
import { NGS360Logo } from '@/components/ngs360-logo'

interface LoginFormProps {
  redirectTo?: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const apiUrl = API_BASE_URL
  const {
    data: oauthProviders,
    isPending,
    isError,
    refetch,
  } = useQuery(getAvailableOauthProvidersOptions())

  const handleOAuthLogin = (provider: string, authorizeUrl: string) => {
    storePostLoginRedirect(redirectTo)
    const redirectUri = `${window.location.origin}/oauth/${provider}/callback`
    const separator = authorizeUrl.includes('?') ? '&' : '?'
    window.location.href = `${authorizeUrl}${separator}redirect_uri=${encodeURIComponent(redirectUri)}`
  }

  // Check for corporate SSO provider
  const corpProvider = oauthProviders?.providers.find((p) => p.name === 'corp')

  const view = loginView({
    localAuthEnabled: LOCAL_AUTH_ENABLED,
    isPending,
    isError,
    hasCorpProvider: Boolean(corpProvider),
  })

  // SSO-only deployments never fall back to a password form.
  if (view === 'loading' || view === 'unavailable') {
    return (
      <div
        id="login-sso-status"
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <NGS360Logo className="mb-2" />
          {view === 'loading' ? (
            <p className="text-sm text-muted-foreground">Loading sign-in…</p>
          ) : (
            <>
              <h1 className="text-xl font-bold">Sign-in is unavailable</h1>
              <p className="text-sm text-muted-foreground">
                The sign-in service did not respond. It may be starting up. Try
                again in a minute.
              </p>
              <Button
                id="login-sso-retry"
                variant="outline"
                onClick={() => void refetch()}
              >
                Try again
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  // Render corporate SSO login if corp provider exists
  if (view === 'sso' && corpProvider) {
    return (
      <LoginFormCorporate
        provider={corpProvider}
        onLogin={handleOAuthLogin}
        apiUrl={apiUrl}
      />
    )
  }

  // Otherwise render standard login form
  return (
    <LoginFormDefault
      oauthProviders={oauthProviders?.providers}
      onOAuthLogin={handleOAuthLogin}
      apiUrl={apiUrl}
      redirectTo={redirectTo}
    />
  )
}
