import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const role =localStorage.getItem("role");
  return (
    <div className="bg-green-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-green-700 text-white py-20 px-6 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to FarmCare 🌱
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mb-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Your trusted partner in buying genuine and affordable farm medicines directly from verified sellers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            to="/medicines"
            className="bg-white text-green-700 px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-100 transition"
          >
            Browse Medicines
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-10">Why Choose FarmCare?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "✔ Verified Products",
              desc: "All medicines are verified by experts to ensure authenticity and quality for your farm."
            },
            {
              title: "💰 Affordable Prices",
              desc: "Buy medicines at the best prices directly from sellers without middlemen costs."
            },
            {
              title: "🚚 Easy Ordering",
              desc: "Simple process to order and track your medicines from anywhere with just a few clicks."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-green-600">{feature.title}</h3>
              <p className="mt-3 text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16 px-6 text-center">
        <motion.h2
          className="text-3xl font-bold text-green-700 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          About FarmCare
        </motion.h2>
        <motion.p
          className="max-w-3xl mx-auto text-lg text-gray-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          FarmCare is a platform built to help farmers buy necessary medicines and pesticides for their fields with ease. 
          We connect farmers with trusted sellers, ensuring transparency, safety, and affordable access to essential products. 
          Our mission is to empower farmers with technology and make agriculture more sustainable.
        </motion.p>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-green-700 text-white py-16 px-6 text-center">
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          Start Your Journey with FarmCare Today!
        </motion.h2>
        <motion.p
          className="mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Register now and get access to verified, affordable farm medicines.
        </motion.p>
        {!role &&(<motion.div
          className="space-x-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Link
            to="/register"
            className="bg-white text-green-700 px-6 py-3 rounded-full font-semibold hover:bg-green-100 transition"
          >
            Register Now
          </Link>
          <Link
            to="/login"
            className="bg-green-900 px-6 py-3 rounded-full font-semibold hover:bg-green-800 transition"
          >
            Login
          </Link>
        </motion.div>)}
      </section>
    </div>
  );
}