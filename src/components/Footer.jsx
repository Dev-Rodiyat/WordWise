import React from 'react'

const Footer = () => {
    return (
        <footer className="text-center text-sm pt-10 border-t dark:border-gray-700">
            <p>© {new Date().getFullYear()} WordWise. Built with ❤️ using React & Tailwind.</p>
        </footer>
    )
}

export default Footer