import { auth } from "~/server/auth/core";
import { Button } from "~/components/ui/button";
import { initiateSignIn } from "~/server/auth/actions";
import { redirect } from "next/navigation";
// TODO: learn about the export const (configurationOptions) like this one
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();

  if (session) redirect("/feed");

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-3">
      <h1 className="text-center text-4xl font-bold">
        Welcome to the Gallery!
      </h1>
      <p className="text-lg">Please sign in to view the gallery.</p>
      <form
        action={async () => {
          "use server";
          await initiateSignIn();
        }}
      >
        <Button variant="default" type="submit">
          Sign in
        </Button>
      </form>
    </div>
  );
}
