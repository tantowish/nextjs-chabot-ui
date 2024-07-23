"use client";
import { signOut } from "next-auth/react";
import { useState } from "react";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";

const SignOutButton = ({className}: {className?: string}) => {
  const [signingOut, setSigningOut] = useState<boolean>(false);

  const handleSignOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
  };
  
  return (
    <Button onClick={handleSignOut} className={className}>
      {signingOut ? <Spinner /> : "Sign Out"}
    </Button>
  );
};

export default SignOutButton;
