export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-700 leading-relaxed mb-8">
        Have any questions or business inquiries? Feel free to reach out to us!
      </p>
      <div className="space-y-4">
        <p><strong>Email:</strong> <a href="mailto:zedtuneza@gmail.com" className="text-blue-600 hover:underline">zedtuneza@gmail.com</a></p>
        <p><strong>Phone:</strong> +260975232473</p>
        <p><strong>WhatsApp:</strong> <a href="https://wa.me/260975232473" className="text-green-600 hover:underline">+260975232473</a></p>
      </div>
    </div>
  );
}
