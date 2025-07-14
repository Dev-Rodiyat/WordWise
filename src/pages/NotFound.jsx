import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
    >
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400">404</h1>
        <p className="text-xl font-semibold">Oops! Page not found</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 px-5 py-2 rounded-lg transition-colors"
        >
          Go back home
        </Link>
      </div>
    </motion.div>
  );
}
