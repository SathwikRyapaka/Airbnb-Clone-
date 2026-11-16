import React from 'react';
import { Globe, DollarSign, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-lavender/30 border-t border-lavender mt-auto text-xs text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-lavender">
          <div>
            <h4 className="font-extrabold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Support</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:text-powder-dark transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-powder-dark transition-colors">AirCover Protection</a></li>
              <li><a href="#" className="hover:text-powder-dark transition-colors">Anti-discrimination</a></li>
              <li><a href="#" className="hover:text-powder-dark transition-colors">Disability support</a></li>
              <li><a href="#" className="hover:text-powder-dark transition-colors">Cancellation options</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Hosting</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:text-powder-dark transition-colors">Airbnb your home</a></li>
              <li><a href="#" className="hover:text-powder-dark transition-colors">AirCover for Hosts</a></li>
              <li><a href="#" className="hover:text-powder-dark transition-colors">Hosting resources</a></li>
              <li><a href="#" className="hover:text-powder-dark transition-colors">Community forum</a></li>
              <li><a href="#" className="hover:text-powder-dark transition-colors">Hosting responsibly</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Airbnb</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:text-powder-dark transition-colors">Newsroom</a></li>
              <li><a href="#" className="hover:text-powder-dark transition-colors">New features</a></li>
              <li><a href="#" className="hover:text-powder-dark transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-powder-dark transition-colors">Investors</a></li>
              <li><a href="#" className="hover:text-powder-dark transition-colors">Gift cards</a></li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2 text-powder-deep font-bold">
              <Sparkles className="w-3.5 h-3.5 text-peach-dark" />
              <span>Full-Stack Capstone</span>
            </div>
            <p className="text-slate-500 leading-relaxed font-medium">
              Built with Express API, Mongoose, JWT authentication,
              Leaflet maps, booking collision prevention, and host dashboards.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-slate-400 font-semibold">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-peach fill-peach stroke-peach-dark" />
              <span>for travelers</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500">
            <span>© 2026 Airbnb Escapes, Inc.</span>
            <span>·</span>
            <a href="#" className="hover:text-powder-dark">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:text-powder-dark">Terms</a>
            <span>·</span>
            <a href="#" className="hover:text-powder-dark">Sitemap</a>
          </div>

          <div className="flex items-center gap-6 font-bold text-slate-700">
            <button className="flex items-center gap-1.5 hover:text-powder-dark transition-colors">
              <Globe className="w-4 h-4 text-powder" /> English (US)
            </button>
            <button className="flex items-center gap-1 hover:text-powder-dark transition-colors">
              <span>$ USD</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
