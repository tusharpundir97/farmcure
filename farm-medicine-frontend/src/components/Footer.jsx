import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-8 mt-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
        
      
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-3">FarmCare 🌱</h2>
          <p className="text-gray-300 text-sm">
            Empowering farmers with affordable and verified medicines for better agriculture.
          </p>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-green-200">Home</Link></li>
            <li><Link to="/medicines" className="hover:text-green-200">Medicines</Link></li>
            <li><Link to="/" className="hover:text-green-200">About</Link></li>
          </ul>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-gray-300 text-sm">📍 Village Road, Meerut, India</p>
          <p className="text-gray-300 text-sm">📧 support@farmcare.com</p>
          <p className="text-gray-300 text-sm">📞 +91 98765 43210</p>
        </motion.div>
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm border-t border-green-700 pt-4">
        © {new Date().getFullYear()} FarmCare. All rights reserved.
      </div>
    </footer>
  );
}