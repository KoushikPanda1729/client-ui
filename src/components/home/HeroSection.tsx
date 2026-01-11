import Image from "next/image";
import { ArrowRightOutlined } from "@ant-design/icons";

export default function HeroSection() {
  return (
    <section className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Get yummy pizza in <span className="text-[#FF6B35]">30 min</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              No need to pay if, order took more than 30 min
            </p>
            <a
              href="#menu"
              className="bg-[#FF6B35] hover:bg-[#FF5520] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors text-sm sm:text-base"
            >
              Order Now
              <ArrowRightOutlined />
            </a>
          </div>
          <div className="flex justify-center mt-6 lg:mt-0">
            <div className="relative w-full max-w-xs sm:max-w-md">
              <Image
                src="/image/pizza_image.png"
                alt="Delicious Pizza"
                width={500}
                height={500}
                className="w-full h-auto mix-blend-multiply"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
