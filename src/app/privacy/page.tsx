'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create or modify your account, request customer service, or otherwise communicate with us. This information may include your name, email, password, postal address, phone number, payment method data, and other information you choose to provide.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">2. How We Use Information</h2>
          <p className="mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Develop new products and services</li>
            <li>Personalize your experience</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">3. Sharing of Information</h2>
          <p className="mb-4">
            We may share the information we collect as follows:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>With vendors, consultants, and other service providers</li>
            <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
            <li>If we believe your actions are inconsistent with our user agreements or policies</li>
            <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">4. Cookies</h2>
          <p className="mb-4">
            We use cookies and similar technologies to track your activities on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">5. Security</h2>
          <p className="mb-4">
            StreamVibe takes reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration, and destruction.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">6. Changes to this Privacy Policy</h2>
          <p className="mb-4">
            We may change this privacy policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">7. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please <Link href="/contact" className="text-cyan-400 hover:text-cyan-300">contact us</Link>.
          </p>
        </section>
      </div>
    </div>
  );
} 