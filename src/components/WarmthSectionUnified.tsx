import React from 'react';
import WarmthSectionDolls from './WarmthSectionDolls';
import WarmthSectionPillow from './WarmthSectionPillow';

interface WarmthSectionUnifiedProps {
  images: string[];
  isPillow: boolean;
  onCtaClick?: () => void;
}

const WarmthSectionUnified: React.FC<WarmthSectionUnifiedProps> = ({ images, isPillow, onCtaClick }) => {
  if (!Array.isArray(images) || images.length === 0) return null;

  if (isPillow) {
    return <WarmthSectionPillow images={images} onCtaClick={onCtaClick} />;
  }

  return <WarmthSectionDolls images={images} onCtaClick={onCtaClick} />;
};

export default WarmthSectionUnified;
