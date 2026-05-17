"use client";

import { Mail, Phone, Send, MessageCircle } from 'lucide-react';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you shortly.");
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-6 tracking-tight">Get in <span className="text-[#39FF14] bg-black px-4 py-1 rounded-lg">Touch</span></h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Have questions, feedback, or want to collaborate? We&apos; love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-black text-[#39FF14] rounded-full flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email</p>
                  <a href="mailto:zedtuneza@gmail.com" className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">zedtuneza@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-black text-[#39FF14] rounded-full flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                  <a href="tel:+260975232473" className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">+260 975 232 473</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">WhatsApp</p>
                  <a href="https://wa.me/260975232473" target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors">+260 975 232 473</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl shadow-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Your Name</label>
                <input 
                  type="text" required
                  className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 focus:outline-none focus:bg-white focus:border-black transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <input 
                  type="email" required
                  className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 focus:outline-none focus:bg-white focus:border-black transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-2 mb-8">
              <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
              <input 
                type="text" required
                className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 focus:outline-none focus:bg-white focus:border-black transition-all"
                placeholder="How can we help?"
              />
            </div>
            <div className="space-y-2 mb-8">
              <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
              <textarea 
                required rows={5}
                className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 focus:outline-none focus:bg-white focus:border-black transition-all resize-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-black text-[#39FF14] py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-black/10"
            >
              <Send size={24} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
