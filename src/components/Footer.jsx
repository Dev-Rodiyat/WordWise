import React from 'react'

const Footer = () => {
    return (
        <footer className="text-center sm:text-base text-sm py-5 border-t dark:border-gray-700">
            <p>© {new Date().getFullYear()} WordWise. Built with ❤️ using React, Vite & Tailwind.</p>
        </footer>
    )
}

export default Footer