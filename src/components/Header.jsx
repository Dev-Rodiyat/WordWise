import React, { useEffect, useState } from 'react';
import { GoMoon } from 'react-icons/go';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { LuSunMedium } from 'react-icons/lu';
import { Link, useLocation } from 'react-router-dom';
import NavModal from '../modals/NavModal';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const [darkMode, setDarkMode] = useState(() => {
        const storedTheme = localStorage.getItem("theme");
        return storedTheme ? storedTheme === "dark" : false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    const toggleTheme = () => {
        const newTheme = !darkMode;
        setDarkMode(newTheme);
        localStorage.setItem("theme", newTheme ? "dark" : "light");
    };

    const navTitle = [
        { url: "/", title: "Home" },
        { url: "/dictionary", title: "Dictionary" },
    ];

    return (
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 px-4 sm:px-6 md:px-10 lg:px-20 pt-4 shadow dark:shadow-md">
            <header className="px-6 py-3 rounded-xl flex justify-between items-center w-full">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">WordWise</h1>

                <div className="flex items-center space-x-4 lg:space-x-10">
                    {/* Desktop nav */}
                    <ul className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-inter font-semibold text-sm xl:text-base">
                        {navTitle.map(({ url, title }, index) => (
                            <li key={index}>
                                <Link
                                    to={url}
                                    className={`transition-colors duration-700 ease-in-out hover:text-blue-600 dark:hover:text-blue-400
            ${url === location.pathname
                                            ? "text-blue-700 dark:text-blue-400 font-semibold"
                                            : "text-gray-800 dark:text-gray-200"
                                        }`}
                                >
                                    {title}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={toggleTheme}
                        className="rounded-md bg-gray-700 px-3 py-2 text-white hover:bg-gray-600 w-auto flex items-center"
                    >
                        {darkMode ? <LuSunMedium /> : <GoMoon />}
                    </button>

                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="block lg:hidden p-2 text-gray-700 dark:text-white"
                    >
                        <HiOutlineMenuAlt3 className="w-6 h-6" />
                    </button>
                </div>
            </header>
            {isMobileMenuOpen && (
               <NavModal navTitle={navTitle} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}/>
            )}
        </div>
    );
};

export default Header;
