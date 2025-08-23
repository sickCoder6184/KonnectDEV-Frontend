import React, { useState, useEffect } from "react";
import { Github, Linkedin, Mail, Code, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Cheesy lines array
  const lines = [
    "💻 Looking for someone to git commit to.",
    "⚡ Let's merge our branches and resolve conflicts together.",
    "💓  My love language? Clean code & pull requests.",
    "🔥 Full-stack in love, backend in feelings.",
    "🕶️ Searching for my pair programming partner for life.",
    "💾 I promise I won't ghost you… unless my server crashes.",
  ];

  const [index, setIndex] = useState(0);

  // Auto-rotate lines every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % lines.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [lines.length]);

  const socialLinks = [
    {
      href: "https://github.com/sickCoder6184",
      icon: Github,
      label: "GitHub Profile",
      color: "hover:bg-gray-800"
    },
    {
      href: "https://www.linkedin.com/in/preyanshu-d-852019231/",
      icon: Linkedin,
      label: "LinkedIn Profile",
      color: "hover:bg-blue-600"
    },
    {
      href: "https://leetcode.com/u/SickCoder/",
      icon: null,
      label: "LeetCode Profile",
      color: "hover:bg-orange-500",
      customIcon: (
        <svg
          className="w-5 h-5 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.098-.278l3.501 3.501c.372.372.965.371 1.336 0s.372-.965 0-1.337l-3.501-3.501A3.5 3.5 0 0 0 13.483 0z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-gradient-to-r from-base-300 via-base-200 to-base-300 border-t border-base-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Brand Section */}
          <div className="flex items-center justify-center md:justify-start">
            <div className="group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                    <Heart className="w-6 h-6 text-primary-content fill-current animate-pulse" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-2xl opacity-20 blur group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    KonnectDEV
                  </h3>
                  <div className="h-6 overflow-hidden">
                    <p className="text-sm text-base-content/70 transition-all duration-700 ease-in-out transform" 
                       style={{transform: `translateY(-${index * 24}px)`}}>
                      {lines.map((line, idx) => (
                        <span key={idx} className="block h-6 leading-6">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="btn btn-outline btn-primary btn-sm group">
              <Code className="w-4 h-4 group-hover:animate-bounce" />
              <a
                href="https://preyanshportfolio.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                Portfolio
              </a>
            </div>
            <div className="btn btn-outline btn-secondary btn-sm group">
              <Mail className="w-4 h-4 group-hover:animate-pulse" />
              <a
                href="mailto:preyanshudhapola6184@gmail.com"
                className="no-underline"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-end gap-3">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-circle btn-ghost btn-sm group relative overflow-hidden ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                aria-label={social.label}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                {social.icon ? <social.icon className="w-5 h-5" /> : social.customIcon}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="divider divider-primary my-8">
          <div className="flex items-center gap-2 text-primary/60">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-secondary rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <p className="text-sm text-base-content/60 flex items-center justify-center gap-2 flex-wrap">
            <span>© {currentYear} Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current animate-heartbeat inline" />
            <span>by</span>
            <a
              href="https://preyanshportfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary font-semibold hover:link-secondary transition-colors duration-300"
            >
              Preyanshu
            </a>
          </p>
          <div className="mt-2 text-xs text-base-content/40">
            <span className="animate-pulse">🚀 Building the future, one commit at a time</span>
          </div>
        </div>
      </div>

      {/* Custom CSS for heartbeat animation */}
      <style jsx>{`
        @keyframes heartbeat {
          0%, 70%, 100% { transform: scale(1); }
          35% { transform: scale(1.2); }
        }
        .animate-heartbeat {
          animation: heartbeat 2s infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;