'use client';

import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Terms of Service</h1>
      
      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">1. Introduction</h2>
          <p className="mb-4">
            Welcome to StreamVibe. By accessing our website, you agree to these Terms of Service in full. If you disagree with these terms or any part of them, you must not use our service.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">2. Intellectual Property Rights</h2>
          <p className="mb-4">
            Unless otherwise stated, we own the intellectual property rights for all material on StreamVibe. All intellectual property rights are reserved.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">3. Restrictions</h2>
          <p className="mb-4">
            You are specifically restricted from:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Publishing any material from StreamVibe in any other media without our permission</li>
            <li>Selling, sublicensing and/or otherwise commercializing any material from StreamVibe</li>
            <li>Using this website in any way that is or may be damaging to this website</li>
            <li>Using this website to engage in any advertising or marketing</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">4. Subscription</h2>
          <p className="mb-4">
            Some parts of StreamVibe are offered on a subscription basis. You will be billed in advance on a recurring basis, depending on the type of subscription plan you select.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">5. Content</h2>
          <p className="mb-4">
            Our Service allows you to stream movies, TV shows, and other entertainment content. The content available through our service is licensed, not sold. We reserve the right to add or remove content at any time.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">6. Disclaimer</h2>
          <p className="mb-4">
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">7. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please <Link href="/contact" className="text-cyan-400 hover:text-cyan-300">contact us</Link>.
          </p>
        </section>
      </div>
    </div>
  );
} 