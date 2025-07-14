import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Home = () => {
    return (
        <div className="min-h-screen text-gray-900 dark:text-white bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">
                <motion.section
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-6"
                >
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">
                        📚 Discover, Learn & Save New Words
                    </h1>
                    <p className="text-base sm:text-xl max-w-2xl mx-auto">
                        WordWise helps you understand meanings, hear pronunciations, and build your vocabulary.
                    </p>
                    <Link
                        to="/dictionary"
                        className="inline-block px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg"
                    >
                        Start Exploring
                    </Link>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="space-y-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-center">🚀 How It Works</h2>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            'Search any word in the input box',
                            'Read multiple definitions & examples',
                            'Hear pronunciation using text-to-speech',
                            'Save your favorite words for later',
                            'Access your search history anytime',
                            'Switch between Light & Dark mode',
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                                whileHover={{ scale: 1.03 }}
                            >
                                <p className="font-medium text-gray-800 dark:text-gray-100">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">{i + 1}.</span> {step}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Features Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="space-y-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-center">✨ Features</h2>
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-lg text-gray-700 dark:text-gray-200">
                        {[
                            '✅ Clean and responsive interface',
                            '🔊 Text-to-speech with play and stop',
                            '⭐ Save and view favorites easily',
                            '🕓 Auto-saved history of searched words',
                            '🌗 Light/Dark theme switch',
                            '📱 Mobile and desktop friendly',
                        ].map((feature, index) => (
                            <li key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
                                {feature}
                            </li>
                        ))}
                    </ul>
                </motion.section>

                {/* FAQ Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="space-y-10"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-center">❓ FAQ</h2>
                    <div className="max-w-3xl mx-auto space-y-6 text-gray-800 dark:text-gray-200">
                        <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-5 shadow-sm">
                            <p className="font-semibold">Q: Is WordWise free to use?</p>
                            <p className="text-gray-600 dark:text-gray-400">A: Yes! It’s 100% free with no login required.</p>
                        </div>
                        <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-5 shadow-sm">
                            <p className="font-semibold">Q: How do I hear the pronunciation?</p>
                            <p className="text-gray-600 dark:text-gray-400">A: After searching a word, click the green "Read Word" button.</p>
                        </div>
                        <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-5 shadow-sm">
                            <p className="font-semibold">Q: Can I use this on mobile?</p>
                            <p className="text-gray-600 dark:text-gray-400">A: Absolutely. The app is fully responsive and works great on small screens.</p>
                        </div>
                    </div>
                </motion.section>
            </div>

            <Footer />
        </div>
    );
}

export default Home;