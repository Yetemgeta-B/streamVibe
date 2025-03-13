export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Terms of Service
      </h1>

      <div className="space-y-8 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using MovieStream, you accept and agree to be bound by the terms and
            provisions of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily access the materials (information or software) on
            MovieStream for personal, non-commercial transitory viewing only.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The materials cannot be modified or copied</li>
            <li>The materials cannot be used for commercial purposes</li>
            <li>Any unauthorized use terminates the permission granted herein</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">3. Account Terms</h2>
          <p className="mb-4">
            You are responsible for maintaining the security of your account and password. MovieStream
            cannot and will not be liable for any loss or damage from your failure to comply with this
            security obligation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">4. Content and Copyright</h2>
          <p className="mb-4">
            All content available through our service, including but not limited to movies, text,
            graphics, logos, and software is the property of MovieStream or its content suppliers and
            protected by international copyright laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">5. Subscription and Billing</h2>
          <p className="mb-4">
            To access the streaming service, you must have Internet access and a MovieStream
            subscription. You can find the specific details about your MovieStream subscription by
            visiting your account page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">6. Termination</h2>
          <p className="mb-4">
            MovieStream reserves the right to terminate or suspend access to our service immediately,
            without prior notice or liability, for any reason whatsoever, including without limitation
            if you breach the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">7. Changes to Terms</h2>
          <p className="mb-4">
            MovieStream reserves the right, at our sole discretion, to modify or replace these Terms at
            any time. If a revision is material, we will try to provide at least 30 days notice prior
            to any new terms taking effect.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">8. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@moviestream.com
          </p>
        </section>

        <div className="pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
} 