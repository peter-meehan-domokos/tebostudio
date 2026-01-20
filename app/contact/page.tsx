import Link from "next/link";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-5xl text-[#1B2A49] mb-6 text-center">
            Get in Touch
          </h1>
          
          <p className="font-[family-name:var(--font-roboto)] text-xl text-[#333333] mb-12 text-center">
            Questions, collaboration ideas, or inquiries about programs and visualisations? Let's connect.
          </p>
          
          {/* Contact Details */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="space-y-8">
              {/* Name */}
              <div>
                <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl text-[#1B2A49] mb-2">
                  Peter Meehan-Domokos
                </h2>
                <p className="font-[family-name:var(--font-roboto)] text-lg text-[#666666]">
                  BSc, MSc, PGCE
                </p>
              </div>

              {/* Contact Information Grid */}
              <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
                {/* Contact */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#39A6A3]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#39A6A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-[family-name:var(--font-montserrat)] font-semibold text-[#1B2A49] mb-3">
                      Contact
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-[family-name:var(--font-roboto)] text-xs text-[#666666] mb-1">Email</p>
                        <a 
                          href="mailto:p.meehan.domokos@gmail.com" 
                          className="font-[family-name:var(--font-roboto)] text-[#39A6A3] hover:text-[#329d9a] transition-colors"
                        >
                          p.meehan.domokos@gmail.com
                        </a>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-roboto)] text-xs text-[#666666] mb-1">Phone (UK)</p>
                        <a 
                          href="tel:+447547196642" 
                          className="font-[family-name:var(--font-roboto)] text-[#39A6A3] hover:text-[#329d9a] transition-colors"
                        >
                          +44 7547 196642
                        </a>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-roboto)] text-xs text-[#666666] mb-1">Phone (Ireland)</p>
                        <a 
                          href="tel:+353852076241" 
                          className="font-[family-name:var(--font-roboto)] text-[#39A6A3] hover:text-[#329d9a] transition-colors"
                        >
                          +353 85 207 6241
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Locations */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#39A6A3]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#39A6A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-[family-name:var(--font-montserrat)] font-semibold text-[#1B2A49] mb-3">
                      Locations
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-[family-name:var(--font-roboto)] text-xs text-[#666666] mb-1">UK</p>
                        <p className="font-[family-name:var(--font-roboto)] text-[#39A6A3]">
                          35 Upper Street, 
                        </p>
                        <p className="font-[family-name:var(--font-roboto)] text-[#39A6A3]">
                          Salisbury, SP2 8LS
                        </p>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-roboto)] text-xs text-[#666666] mb-1">Ireland</p>
                        <p className="font-[family-name:var(--font-roboto)] text-[#39A6A3]">
                          5 Whitestrand Park,
                        </p>
                        <p className="font-[family-name:var(--font-roboto)] text-[#39A6A3]">
                          Galway, H91 YX65
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-[family-name:var(--font-montserrat)] font-semibold text-[#1B2A49] mb-4">
                  Connect
                </h3>
                <div className="flex gap-4">
                  <a 
                    href="https://www.linkedin.com/in/petedomokos/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#39A6A3] hover:bg-[#329d9a] rounded-lg flex items-center justify-center transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.facebook.com/peter.meehan.domokos?" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#39A6A3] hover:bg-[#329d9a] rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://github.com/peter-meehan-domokos" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#39A6A3] hover:bg-[#329d9a] rounded-lg flex items-center justify-center transition-colors"
                    aria-label="GitHub"
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form - Hidden */}
          <div className="bg-white rounded-2xl p-8" style={{ display: 'none' }}>
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
