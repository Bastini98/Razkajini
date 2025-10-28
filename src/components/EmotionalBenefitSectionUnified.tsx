import React from 'react';
import EmotionalBenefitSectionDolls from './EmotionalBenefitSectionDolls';
import EmotionalBenefitSectionPillow from './EmotionalBenefitSectionPillow';

interface EmotionalBenefitSectionUnifiedProps {
  data: {
    title: string;
    content: string;
  } | null;
  isPillow: boolean;
  onCtaClick?: () => void;
}

const EmotionalBenefitSectionUnified: React.FC<EmotionalBenefitSectionUnifiedProps> = ({ data, isPillow, onCtaClick }) => {
  if (!data) return null;

  if (isPillow) {
    return <EmotionalBenefitSectionPillow data={data} onCtaClick={onCtaClick} />;
  }

  return <EmotionalBenefitSectionDolls data={data} onCtaClick={onCtaClick} />;
};

export default EmotionalBenefitSectionUnified;
