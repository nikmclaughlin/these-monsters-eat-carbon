import { Layout } from "@/Layout";
import { SignInForm } from "@/SignInForm";
import { UserMenu } from "@/components/UserMenu";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { UserDashboard } from "./Dashboard/UserDashboard";

export default function App() {
  const user = useQuery(api.users.viewer);

  return (
    <Layout
      menu={
        <Authenticated>
          <UserMenu>{user?.name ?? user?.email}</UserMenu>
        </Authenticated>
      }
    >
      <>
        <Authenticated>
          <UserDashboard user={user} />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </>
    </Layout>
  );
}
