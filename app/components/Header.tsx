"use client";

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center">
      <Link href="/" className="text-white text-xl font-bold">
        Xeno Insights
      </Link>
      {session ? (
        <div className="flex items-center space-x-4">
          <span className="text-gray-300 hidden md:inline">Logged in as: {session.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
          Login
        </Link>
      )}
    </header>
  );
}