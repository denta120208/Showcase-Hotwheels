import { Suspense } from "react";

import {
  AdminDashboardContent,
  AdminDashboardSkeleton,
} from "@/components/admin/admin-dashboard-content";
import { AdminLoginPanel } from "@/components/admin/admin-login-panel";
import { getCurrentUserBasicProfile } from "@/lib/auth";
import { getFirstParam, toInt } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const q = getFirstParam(resolved.q).trim();
  const page = toInt(getFirstParam(resolved.page, "1"), 1);
  const message = getFirstParam(resolved.message);
  const error = getFirstParam(resolved.error);
  const { user, profile } = await getCurrentUserBasicProfile();
  const isAdmin = Boolean(user && profile?.role === "admin");

  if (!isAdmin) {
    const accessError = error || (user ? "Akun ini bukan admin." : "");

    return <AdminLoginPanel error={accessError} message={message} />;
  }

  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardContent q={q} page={page} message={message} error={error} />
    </Suspense>
  );
}
