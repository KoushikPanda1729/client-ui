import {
  EnvironmentOutlined,
  FacebookOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-8 sm:mt-12 lg:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-white">pizza</h3>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Delicious pizzas delivered to your doorstep in 30 minutes or less. Quality
              ingredients, authentic taste, and unbeatable service.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#FF6B35] flex items-center justify-center transition-colors"
              >
                <FacebookOutlined className="text-lg" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#FF6B35] flex items-center justify-center transition-colors"
              >
                <TwitterOutlined className="text-lg" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#FF6B35] flex items-center justify-center transition-colors"
              >
                <InstagramOutlined className="text-lg" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#FF6B35] flex items-center justify-center transition-colors"
              >
                <YoutubeOutlined className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#menu" className="hover:text-[#FF6B35] transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="#orders" className="hover:text-[#FF6B35] transition-colors">
                  Orders
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#FF6B35] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#FF6B35] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-[#FF6B35] transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#faq" className="hover:text-[#FF6B35] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#shipping" className="hover:text-[#FF6B35] transition-colors">
                  Delivery Info
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-[#FF6B35] transition-colors">
                  Returns Policy
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-[#FF6B35] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#FF6B35] transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <EnvironmentOutlined className="text-[#FF6B35] mt-1" />
                <span className="text-sm">123 Pizza Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneOutlined className="text-[#FF6B35]" />
                <span className="text-sm">+91 9800 098 998</span>
              </li>
              <li className="flex items-center gap-2">
                <MailOutlined className="text-[#FF6B35]" />
                <span className="text-sm">info@pizza.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">Opening Hours</p>
              <p className="text-sm">Mon - Sun: 10:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Pizza. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#privacy" className="hover:text-[#FF6B35] transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-[#FF6B35] transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="hover:text-[#FF6B35] transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
