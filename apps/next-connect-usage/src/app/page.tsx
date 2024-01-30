import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-4xl">
      👋 <Link href="https://michalczukm.xyz">michalczukm.xyz</Link>
    </main>
  );
}