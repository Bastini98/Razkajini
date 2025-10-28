import React from 'react';
import { motion } from 'framer-motion';

interface InteractiveImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick: () => void;
}

const InteractiveImage: React.FC<InteractiveImageProps> = ({
  src,
  alt,
  className = '',
  onClick,
}) => {
  return (
    <motion.div
      className={`cursor-pointer overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        draggable={false}
      />
    </motion.div>
  );
};

export default InteractiveImage;
