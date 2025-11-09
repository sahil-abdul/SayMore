"use client";
import React, { useState } from "react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const [inProcess, setInProcess] = useState(false);
  const user: User = session?.user as User;
  const router = useRouter();

  const logout = async () => {
    setInProcess(true);
    await signOut();
    setInProcess(false);
  };
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-800 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a
          href="#"
          className="text-xl font-bold mb-4 md:mb-0 text-sky-400 hover:text-cyan-400"
        >
          SayMore
        </a>
        <div>
          {session ? (
            <>
              <span className="mr-4">
                Welcome, {user.username || user.email}
              </span>
              <Button
                className="bg-sky-400 text-gray-900 hover:bg-cyan-400"
                disabled={inProcess}
                onClick={logout}
              >
                {inProcess ? (
                  <span className="flex gap-2">
                    <Loader2 className="ml-2 mr-2 h-4 w-4 animate-spin" />{" "}
                    Processing...{" "}
                  </span>
                ) : (
                  "signOut"
                )}
              </Button>
            </>
          ) : (
            <Button
              className="bg-sky-400 text-gray-900 hover:bg-cyan-400"
              onClick={() => router.replace("/signIn")}
            >
              signIn
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
