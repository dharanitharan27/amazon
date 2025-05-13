
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-amazon-blue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Get to Know Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-amazon-yellow">About Us</a></li>
              <li><a href="#" className="hover:text-amazon-yellow">Careers</a></li>
              <li><a href="#" className="hover:text-amazon-yellow">Corporate Information</a></li>
              <li><a href="#" className="hover:text-amazon-yellow">Press Releases</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Make Money with Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-amazon-yellow">Sell on AmaStore</a></li>
              <li><a href="#" className="hover:text-amazon-yellow">Advertise Your Products</a></li>
              <li><a href="#" className="hover:text-amazon-yellow">Become an Affiliate</a></li>
              <li><a href="#" className="hover:text-amazon-yellow">Self-Publish with Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-amazon-yellow">Returns & Replacements</a></li>
              <li><a href="#" className="hover:text-amazon-yellow">Shipping Rates & Policies</a></li>
              <li><a href="#" className="hover:text-amazon-yellow">Help</a></li>
              <li><a href="#" className="hover:text-amazon-yellow">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 flex-shrink-0 text-amazon-yellow" />
                <span>123 E-Commerce St, Shopping City, 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-amazon-yellow" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-amazon-yellow" />
                <span>support@amastore.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} AmaStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
