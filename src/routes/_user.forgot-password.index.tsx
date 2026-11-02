import { createFileRoute, redirect } from '@tanstack/react-router'
import { LOCAL_AUTH_ENABLED } from '@/lib/feature-flags'
import { ForgotPasswordForm } from '@/components/forgot-password-form'

export const Route = createFileRoute('/_user/forgot-password/')({
  // Password accounts are off in an SSO-only deployment.
  beforeLoad: () => {
    if (!LOCAL_AUTH_ENABLED) throw redirect({ to: '/login' })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div id="forgot-password-route-page">
      <ForgotPasswordForm />
    </div>
  )
}
