type ProtectedRouteProps = {
  onlyUnauth?: boolean;
  children: React.ReactNode;
};

export default function ProtectedRoute({
  children,
  onlyUnauth
}: ProtectedRouteProps) {
  return children;
}
