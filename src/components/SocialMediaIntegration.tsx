import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Facebook, Instagram } from 'lucide-react';

interface SocialMediaIntegrationProps {
  productTitle?: string;
  productPrice?: string;
  productUrl?: string;
}

const SocialMediaIntegration: React.FC<SocialMediaIntegrationProps> = ({
  productTitle = "Check out this item",
  productPrice = "",
  productUrl = window.location.href
}) => {
  const handleWhatsAppShare = () => {
    const message = `Hi! I'm interested in this item: ${productTitle} ${productPrice ? `- ${productPrice}` : ''}\n\n${productUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleInstagramShare = () => {
    // Instagram doesn't support direct URL sharing, so we copy to clipboard
    navigator.clipboard.writeText(`${productTitle} ${productPrice ? `- ${productPrice}` : ''}\n\n${productUrl}`)
      .then(() => {
        alert('Link copied to clipboard! You can now paste it in your Instagram story or post.');
      })
      .catch(() => {
        alert('Please copy this link manually: ' + productUrl);
      });
  };

  const handleTikTokShare = () => {
    // TikTok doesn't support direct URL sharing, so we copy to clipboard
    navigator.clipboard.writeText(`${productTitle} ${productPrice ? `- ${productPrice}` : ''}\n\n${productUrl}`)
      .then(() => {
        alert('Link copied to clipboard! You can now share it on TikTok.');
      })
      .catch(() => {
        alert('Please copy this link manually: ' + productUrl);
      });
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      <Button
        onClick={handleWhatsAppShare}
        className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 text-xs sm:text-sm px-3 py-2"
        size="sm"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">Share on</span> WhatsApp
      </Button>
      
      <Button
        onClick={handleFacebookShare}
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 text-xs sm:text-sm px-3 py-2"
        size="sm"
      >
        <Facebook className="w-4 h-4" />
        <span className="hidden sm:inline">Share on</span> Facebook
      </Button>
      
      <Button
        onClick={handleInstagramShare}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2 text-xs sm:text-sm px-3 py-2"
        size="sm"
      >
        <Instagram className="w-4 h-4" />
        <span className="hidden sm:inline">Share on</span> Instagram
      </Button>
      
      <Button
        onClick={handleTikTokShare}
        className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 text-xs sm:text-sm px-3 py-2"
        size="sm"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
        <span className="hidden sm:inline">Share on</span> TikTok
      </Button>
    </div>
  );
};

export default SocialMediaIntegration;