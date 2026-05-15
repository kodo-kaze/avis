'use client';

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { motion } from "framer-motion";

export function HomeNavigation() {
  return (
    <div className="flex items-center gap-4">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 text-sm font-bold bg-white text-black rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            SIGN IN
          </motion.button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <div className="flex items-center gap-4">
          <Link href="/workspace">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-sm font-bold bg-white text-black rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              DASHBOARD
            </motion.button>
          </Link>
          <UserButton />
        </div>
      </Show>
    </div>
  );
}
