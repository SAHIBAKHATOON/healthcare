"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export function AuthButtons({ showSignIn, showUserButton }) {
  return (
    <>
      {showSignIn && (
        <SignInButton>
          <Button variant="secondary">Sign In</Button>
        </SignInButton>
      )}

      {showUserButton && (
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
              userButtonPopoverCard: "shadow-xl",
              userPreviewMainIdentifier: "font-semibold",
            },
          }}
          afterSignOutUrl="/"
        />
      )}
    </>
  );
}

