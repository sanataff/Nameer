import { Navigate } from 'react-router'

// `/business` has no page of its own, so send visitors to the marketplace home.
// SPA mode does not allow loaders, hence a client-side redirect component.
export default function BusinessIndexRoute() {
  return <Navigate to="/business/home-page-cafes" replace />
}
