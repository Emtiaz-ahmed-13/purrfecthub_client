"use client";

import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export function SocialAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" type="button">
        <FaGithub className="mr-2 h-4 w-4" />
        GitHub
      </Button>
      <Button variant="outline" type="button">
        <FcGoogle className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
}
