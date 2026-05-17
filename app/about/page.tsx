export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-6 tracking-tight">About <span className="text-[#39FF14] bg-black px-4 py-1 rounded-lg">ZEDTUNES</span></h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Zambia&apos;s premier digital music destination, connecting artists with fans across the globe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Founded in 2024, ZEDTUNES was built with one goal: to elevate Zambian music. We provide a platform for both established legends and rising stars to showcase their talent and reach a wider audience.
          </p>
        </div>
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
          <p className="text-gray-600 leading-relaxed">
            From high-quality streaming to exclusive downloads and artist profiles, ZEDTUNES is more than just a music site—it&apos;s a community dedicated to the heartbeat of Zambian culture.
          </p>
        </div>
      </div>

      <div className="prose prose-lg max-w-none text-gray-700">
        <h2 className="text-3xl font-black mb-6">Why ZEDTUNES?</h2>
        <p className="mb-6">
          Zambian music is rich, diverse, and ready for the world. We believe in providing a seamless, user-friendly experience that puts the music first. Whether it&apos;s Zed Beats, Kalindula, Amapiano, or Gospel, we&apos;ve got the soundtrack to your life.
        </p>
        <p>
          We are committed to supporting artists by providing them with the tools they need to manage their presence and share their creations directly with their supporters.
        </p>
      </div>

      <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Want to get involved?</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">Whether you&apos;re an artist looking to share your music or a fan with feedback, we&apos;d love to hear from you.</p>
        <a href="/contact" className="bg-black text-[#39FF14] px-8 py-4 rounded-full font-black hover:scale-105 transition-transform tracking-tight">Contact Us</a>
      </div>
    </div>
  );
}
