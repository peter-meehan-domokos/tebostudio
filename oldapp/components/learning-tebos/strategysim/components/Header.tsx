'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isGamePage = pathname === '/game';

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Image
              className="dark:invert"
              src="/tebostudio/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
          </Link>
          
          <div className="flex items-center gap-6">
            <Link
              href="/game"
              className={`text-base font-medium transition-colors ${
                isGamePage 
                  ? 'text-gray-900 dark:text-white font-semibold' 
                  : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
              }`}
            >
              Game
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
