import Link from "next/link";

export default function MakeSense() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <main className="max-w-7xl mx-auto px-6 py-20">
        <Link 
          href="/learning"
          className="inline-block font-[family-name:var(--font-roboto)] text-[#39A6A3] hover:text-[#329d9a] mb-8"
        >
          ← Back to Learning
        </Link>
        
        <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-5xl text-[#1B2A49] mb-6">
          Make Sense
        </h1>
        
        <p className="font-[family-name:var(--font-roboto)] text-xl text-[#333333] max-w-3xl">
          Interactive programmes that help young people explore complex ideas and build confidence in learning.
        </p>
        
        <div className="mt-12 bg-white rounded-2xl p-12 text-center">
          <p className="font-[family-name:var(--font-roboto)] text-[#333333] italic">
            Content coming soon...
          </p>
        </div>
      </main>
    </div>
  );
}
