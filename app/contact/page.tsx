import Link from "next/link";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <main className="max-w-7xl mx-auto px-6 py-20">
        <Link 
          href="/"
          className="inline-block font-[family-name:var(--font-roboto)] text-[#39A6A3] hover:text-[#329d9a] mb-8"
        >
          ← Back to Home
        </Link>
        
        <div className="max-w-2xl mx-auto">
          <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-5xl text-[#1B2A49] mb-6">
            Get in Touch
          </h1>
          
          <p className="font-[family-name:var(--font-roboto)] text-xl text-[#333333] mb-12">
            Questions, collaboration ideas, or inquiries about programs and visualisations? Let's connect.
          </p>
          
          <div className="bg-white rounded-2xl p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-[family-name:var(--font-roboto)] font-medium text-[#333333] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39A6A3] font-[family-name:var(--font-roboto)]"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block font-[family-name:var(--font-roboto)] font-medium text-[#333333] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39A6A3] font-[family-name:var(--font-roboto)]"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block font-[family-name:var(--font-roboto)] font-medium text-[#333333] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39A6A3] font-[family-name:var(--font-roboto)]"
                  placeholder="Tell me about your project or inquiry..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#FFB84D] hover:bg-[#f5ab3d] text-[#1B2A49] font-[family-name:var(--font-montserrat)] font-semibold px-8 py-4 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
