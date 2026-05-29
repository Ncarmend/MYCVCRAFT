import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo = "/dashboard" } = await searchParams;
  return <LoginForm redirectTo={redirectTo} />;
}
