import React from "react";
import { motion } from "framer-motion";

// Full-bleed, alternating text/image layout in 3 rows

const IMG_1 = "https://i.ibb.co/390YKQ7Q/podari.webp";       // right img
const IMG_2 = "https://i.ibb.co/d44pSKXC/razkajete1.webp";   // left img
const IMG_3 = "https://i.ibb.co/VcPXsVgP/istorii.webp";      // right img

const SectionBlock: React.FC<{
  side: "image-left" | "image-right";
  title: string;
  subtitle: string;
  image: string;
}> = ({ side, title, subtitle, image }) => {
  const ImagePane = (
    <div className="relative w-full overflow-visible -mb-8 md:-mb-12">
      <img
        src={image}
        alt=""
        loading="lazy"
        className="block w-full h-auto pointer-events-none select-none"
      />
    </div>
  );

  const TextPane = (
    <div className="flex items-center w-full">
      <div className="mx-auto md:mx-0 px-6 sm:px-10 md:px-12 lg:px-16 py-12 md:py-0 max-w-2xl">
        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-colus font-extrabold tracking-tight text-[#2d261e]"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-4 text-lg sm:text-xl md:text-2xl leading-relaxed text-black/85 font-colus"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 w-full">
      {side === "image-left" ? (
        <>
          {ImagePane}
          {TextPane}
        </>
      ) : (
        <>
          {TextPane}
          {ImagePane}
        </>
      )}
    </section>
  );
};

const HowItWorks: React.FC = () => {
  return (
    <>
      {/* z-10: под навбара (z-50), над следващата секция (z-0) */}
      <div className="relative w-full z-10 -mb-24 md:-mb-32 lg:-mb-40">
        {/* Pattern overlay под съдържанието */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `url(https://i.ibb.co/3yvr1Hbt/wallpaper.webp)`,
            backgroundRepeat: "repeat",
            backgroundSize: "520px auto",
            opacity: 0.22,
          }}
        />

        {/* Съдържанието е над overlay-а */}
        <div className="relative z-10 w-full">
          <div className="w-full py-16 md:py-20">
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5 }}
              className="text-center text-5xl sm:text-6xl md:text-7xl font-pudelinka tracking-tight text-[#2d261e]"
            >
              Как работи?
            </motion.h2>
          </div>

          <SectionBlock
            side="image-right"
            image={IMG_1}
            title="1. Подари книгата"
            subtitle="Въпросите пробуждат носталгия с усмивка и спомени, които дълго време са били скрити в сърцето."
          />

          <SectionBlock
            side="image-left"
            image={IMG_2}
            title="2. Разкажете заедно"
            subtitle="Истински разговори, които ви свързват по начин, какъвто не може нито един екран."
          />

          <SectionBlock
            side="image-right"
            image={IMG_3}
            title="3. Истории, които се предават"
            subtitle="Записаните спомени стават наследство, което децата и внуците ще съхраняват завинаги."
          />
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
