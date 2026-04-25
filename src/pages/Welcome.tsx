import { Button } from "@/components/ui/button";
import { Phone, MapPin } from "lucide-react";

interface WelcomeProps {
  onEnterSite: () => void;
}

const Welcome = ({ onEnterSite }: WelcomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            JonzyAutomobile LTD
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-yellow-200 font-semibold">@JonzyAutomobile The Gateway To Your Desired car Brands</p>
          <div className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1753805584524_0bac04bf.jpeg"
              alt="JonzyAutomobile Cars"
              className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-xl md:rounded-2xl shadow-2xl border-2 md:border-4 border-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Main Message */}
      <div className="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 md:mb-8 leading-tight">
            WE ARE THE #1 CHOICE FOR TOP-QUALITY USED CARS!
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed px-2">
            At JonzyAutomobile LTD, we specialize in providing reliable, affordable, and stylish 
            vehicles. The gateway to your desired car brands.
          </p>
          
          <Button 
            onClick={onEnterSite}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 sm:px-12 md:px-16 py-4 sm:py-6 md:py-8 text-lg sm:text-xl md:text-2xl font-bold rounded-xl md:rounded-2xl shadow-2xl transform hover:scale-105 md:hover:scale-110 transition-all duration-300 border-2 border-yellow-400"
          >
            🚗 SHOP NOW 🚗
          </Button>
        </div>
      </div>

      {/* Test Drive & Contact */}
      <div className="py-12 md:py-20 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                SCHEDULE YOUR TEST DRIVE TODAY!
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
                Experience our quality vehicles firsthand. Contact us to schedule your test drive.
              </p>
            </div>
            <div className="space-y-4 md:space-y-6 bg-gradient-to-br from-indigo-800 to-purple-800 p-6 md:p-8 rounded-xl md:rounded-2xl border-2 border-yellow-400">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <Phone className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <p className="font-bold text-base md:text-lg text-yellow-200">+234-812-331-1099</p>
                  <p className="font-bold text-base md:text-lg text-yellow-200">+234-903-964-6296</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <MapPin className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 flex-shrink-0" />
                <p className="font-bold text-base md:text-lg text-yellow-200 text-center sm:text-left">+234-802-139-7048</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;