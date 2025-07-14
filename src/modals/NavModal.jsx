import React, { useEffect } from 'react'
import { HiOutlineX } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from "framer-motion";

const NavModal = ({ navTitle, isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const location = useLocation();

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);


    return (

        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <motion.div
                        initial={{ y: "-100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md px-6 pt-6 pb-10 flex flex-col items-start gap-6"
                    >
                        {/* Close button */}
                        <div className="w-full flex justify-end">
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-gray-700 dark:text-white"
                            >
                                <HiOutlineX className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Nav links */}
                        <ul className="flex flex-col w-full gap-4 font-semibold text-gray-800 dark:text-gray-100">
                            {navTitle.map(({ url, title }, index) => (
                                <li key={index}>
                                    <Link
                                        to={url}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block transition duration-300 hover:text-blue-600 dark:hover:text-blue-400
                  ${url === location.pathname
                                                ? "text-blue-700 dark:text-blue-400 font-semibold"
                                                : ""
                                            }`}
                                    >
                                        {title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

    )
}

export default NavModal