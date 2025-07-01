import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { SignIn } from "~/app/_components/auth/sign-in";
import { auth } from "~/auth/server";

const SignInPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/");

  return <SignIn />;
};

export default SignInPage;
