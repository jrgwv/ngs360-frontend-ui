import { createFileRoute, redirect } from '@tanstack/react-router'
import { LOCAL_AUTH_ENABLED } from '@/lib/feature-flags'

export const Route = createFileRoute('/_user/reset-password')({
  // Password accounts are off in an SSO-only deployment.
  beforeLoad: () => {
    if (!LOCAL_AUTH_ENABLED) throw redirect({ to: '/login' })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_user/reset-password"!</div>
}
