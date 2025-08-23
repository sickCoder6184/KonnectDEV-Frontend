// Footer.jsx
import React from "react";
import { Github, Linkedin, Mail, Code, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Main Footer */}
      <footer className="footer footer-center sm:footer-horizontal bg-neutral text-neutral-content p-10">
        {/* Brand Section */}
        <aside className="items-center grid-flow-col">
          <div className="flex items-center gap-3">
            {/* Logo/Brand Icon */}
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-content fill-current" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">KonnectDEV</p>
              <p className="text-sm opacity-70">Connecting Hearts, Coding Dreams</p>
            </div>
          </div>
        </aside>

        {/* Navigation Links */}
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover" href="/about">About Us</a>
          <a className="link link-hover" href="/privacy">Privacy Policy</a>
          <a className="link link-hover" href="/terms">Terms of Service</a>
          <a className="link link-hover" href="/contact">Contact</a>
        </nav>

        {/* Features */}
        <nav>
          <h6 className="footer-title">Features</h6>
          <a className="link link-hover" href="/feed">Discover</a>
          <a className="link link-hover" href="/connections">Connections</a>
          <a className="link link-hover" href="/inbox">Messages</a>
          <a className="link link-hover" href="/profile">Profile</a>
        </nav>

        {/* Developer & Social */}
        <nav>
          <h6 className="footer-title">Developer</h6>
          <div className="flex flex-col gap-2">
            <a 
              href="https://preyanshportfolio.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link link-hover flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              Portfolio
            </a>
            <a 
              href="mailto:preyanshudhapola6184@gmail.com"
              className="link link-hover flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="grid grid-flow-col gap-4 mt-4">
            <a
              href="https://github.com/sickCoder6184"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle hover:btn-primary transition-colors duration-300"
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            
            <a
              href="https://www.linkedin.com/in/preyanshu-d-852019231/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle hover:btn-primary transition-colors duration-300"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            
            <a
              href="https://leetcode.com/u/SickCoder/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle hover:btn-primary transition-colors duration-300"
              aria-label="LeetCode Profile"
            >
              <svg 
                className="w-5 h-5 fill-current" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.098-.278l3.501 3.501c.372.່372.965.371 1.336 0s.372-.965 0-1.337l-3.501-3.501A3.5 3.5 0 0 0 13.483 0z"/>
              </svg>
            </a>
          </div>
        </nav>
      </footer>

      {/* Bottom Copyright Bar */}
      <footer className="footer footer-center bg-base-300 text-base-content p-4">
        <aside className="flex items-center gap-2">
          <p className="text-sm">
            © {currentYear} KonnectDEV. Made with 
            <Heart className="w-4 h-4 mx-1 inline text-red-500 fill-current" />
            by 
            <a 
              href="https://preyanshportfolio.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link link-primary font-semibold ml-1"
            >
              Preyanshu Dhapola
            </a>
          </p>
        </aside>
      </footer>
    </>
  );
};

export default Footer;