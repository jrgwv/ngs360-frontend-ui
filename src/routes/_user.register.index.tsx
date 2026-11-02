import { createFileRoute, redirect } from '@tanstack/react-router'
import { LOCAL_AUTH_ENABLED } from '@/lib/feature-flags'
import { RegisterForm } from '@/components/register-form'

export const Route = createFileRoute('/_user/register/')({
  // Password accounts are off in an SSO-only deployment.
  beforeLoad: () => {
    if (!LOCAL_AUTH_ENABLED) throw redirect({ to: '/login' })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div id="register-route-page">
      <RegisterForm />
    </div>
  )
}
