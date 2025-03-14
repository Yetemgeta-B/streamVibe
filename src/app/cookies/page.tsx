import Link from 'next/link';

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Cookie Policy</h1>
      
      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">1. What Are Cookies</h2>
          <p className="mb-4">
            Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the service or a third party to recognize you and make your next visit easier and more useful to you.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">2. How We Use Cookies</h2>
          <p className="mb-4">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>To remember your preferences and settings</li>
            <li>To authenticate users and prevent fraudulent use of user accounts</li>
            <li>To understand how you use our website</li>
            <li>To personalize your experience</li>
            <li>To analyze which pages you visit</li>
            <li>To help us improve our website</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">3. Types of Cookies We Use</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white">Essential Cookies</h3>
              <p>These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white">Performance Cookies</h3>
              <p>These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white">Functional Cookies</h3>
              <p>These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white">Targeting Cookies</h3>
              <p>These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.</p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">4. Managing Cookies</h2>
          <p className="mb-4">
            Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version. You can however obtain up-to-date information about blocking and deleting cookies via these links:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">Microsoft Edge</a></li>
          </ul>
          <p className="mb-4">
            Please note that blocking cookies may have a negative impact on the functions of many websites, including our site. Some features of the site may cease to be available to you.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">5. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our Cookie Policy, please <Link href="/contact" className="text-cyan-400 hover:text-cyan-300">contact us</Link>.
          </p>
        </section>
      </div>
    </div>
  );
} 