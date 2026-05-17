export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tight">Privacy <span className="text-[#39FF14] bg-black px-3 py-1 rounded-lg">Policy</span></h1>
        <p className="text-gray-500">Effective Date: May 17, 2024</p>
      </div>

      <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-black mb-4">1. Information We Collect</h2>
          <p>
            At ZEDTUNES, we value your privacy. We collect minimal information to provide you with the best music experience. This may include device information, IP addresses for security, and usage patterns to improve our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black mb-4">2. Cookies</h2>
          <p>
            We use cookies and similar technologies to remember your preferences and provide a personalized experience. You can manage your cookie settings through your browser at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black mb-4">3. External Links</h2>
          <p>
            Our service may contain links to external sites (like Archive.org for downloads). We are not responsible for the content or privacy practices of these third-party sites.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black mb-4">4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@zedtunes.com" className="text-blue-600 font-bold hover:underline">support@zedtunes.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
