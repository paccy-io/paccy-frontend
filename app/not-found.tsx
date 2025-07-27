import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'Sorry, we couldn\'t find the page you were looking for.',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <h2 className="text-2xl mt-4 text-white">Page Not Found</h2>
      <p className="text-lg mt-2 text-white">
        Sorry, we couldn't find the page you were looking for.
      </p>
      <Link href="/" passHref>
        <button className="mt-6 px-6 py-2 text-lg bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none">
          Return to Home
        </button>
      </Link>
    </div>
  );
}
