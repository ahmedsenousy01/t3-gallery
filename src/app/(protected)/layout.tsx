import "@uploadthing/react/styles.css";
import "~/styles/globals.css";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import Navbar from "~/app/_components/navbar";
import { ourFileRouter } from "~/app/api/uploadthing/core";
import ReduxStoreProvider from "~/components/providers/reduxStoreProvider";
import { SessionProvider } from "next-auth/react";
import { auth } from "~/server/auth/core";
import { Modals } from "../_components/modals/modals";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <ReduxStoreProvider>
      <SessionProvider session={session}>
        {/* TODO: look up how ssr works and why this is necessary */}
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <div className="grid h-screen grid-rows-[auto,1fr]">
          <Navbar />
          <main id="content" className="overflow-y-auto">
            {children}
          </main>
        </div>
        <Modals />
      </SessionProvider>
    </ReduxStoreProvider>
  );
}
