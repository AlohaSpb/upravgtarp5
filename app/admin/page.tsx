import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminBuilder } from "@/components/admin/AdminBuilder";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    return <LoginForm />;
  }

  return <AdminBuilder />;
}
