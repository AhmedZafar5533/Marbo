

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
    <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 mb-16">
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Company</h3>
                <ul className="space-y-3">
                    {["About", "Team", "Careers", "Press", "Investors"].map((item) => (
                        <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                    ))}
                </ul>
            </div>
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Resources</h3>
                <ul className="space-y-3">
                    {["Documentation", "Guides", "API", "Blog", "Support"].map((item) => (
                        <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                    ))}
                </ul>
            </div>
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Legal</h3>
                <ul className="space-y-3">
                    {["Privacy", "Terms", "Security", "Compliance"].map((item) => (
                        <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                    ))}
                </ul>
            </div>
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Subscribe</h3>
                <p>Stay up to date with the latest news and updates</p>
                <div className="flex mt-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="px-4 py-3 rounded-l-lg w-full bg-gray-800 border-0 focus:ring-2 focus:ring-indigo-500"
                    />
                    <button className="bg-indigo-600 text-white px-4 py-3 rounded-r-lg hover:bg-indigo-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                <p>&copy; 2025 Your Company. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
                {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((social) => (
                    <a key={social} href="#" className="hover:text-white transition-colors">
                        {social}
                    </a>
                ))}
            </div>
        </div>
    </div>
</footer>
  );
};

export default Footer;