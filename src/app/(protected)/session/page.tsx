import React from "react";
import { auth } from "~/server/auth/core";

const page = async () => {
  const session = await auth();
  return <pre>{JSON.stringify(session, null, 2)}</pre>;
};

export default page;
