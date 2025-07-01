import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { SignUp } from "~/app/_components/auth/sign-up";
import { auth } from "~/auth/server";

const SignUpPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/");

  return <SignUp />;
};
export default SignUpPage;
