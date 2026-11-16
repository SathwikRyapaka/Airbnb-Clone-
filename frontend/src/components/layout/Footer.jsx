import React from 'react';
import { Globe, DollarSign, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 mt-auto text-xs text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-200">
          <div>
            <h4 className="font-bold text-neutral-900 mb-3">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">AirCover</a></li>
              <li><a href="#" className="hover:underline">Anti-discrimination</a></li>
              <li><a href="#" className="hover:underline">Disability support</a></li>
              <li><a href="#" className="hover:underline">Cancellation options</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 mb-3">Hosting</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Airbnb your home</a></li>
              <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
              <li><a href="#" className="hover:underline">Hosting resources</a></li>
              <li><a href="#" className="hover:underline">Community forum</a></li>
              <li><a href="#" className="hover:underline">Hosting responsibly</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 mb-3">Airbnb</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Newsroom</a></li>
              <li><a href="#" className="hover:underline">New features</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Investors</a></li>
              <li><a href="#" className="hover:underline">Gift cards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 mb-3">Student Capstone</h4>
            <p className="text-neutral-500 leading-relaxed">
              Full Stack Airbnb clone featuring Express API, Mongoose, JWT authentication,
              Leaflet maps, booking collision prevention, and host dashboards.
            </p>
            <div className="mt-3 flex items-center gap-1 text-neutral-400">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for learners</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© 2026 Airbnb Clone, Inc.</span>
            <span>·</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:underline">Terms</a>
            <span>·</span>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>

          <div className="flex items-center gap-6 font-semibold text-neutral-800">
            <button className="flex items-center gap-1.5 hover:underline">
              <Globe className="w-4 h-4" /> English (US)
            </button>
            <button className="flex items-center gap-1 hover:underline">
              <span>$ USD</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
