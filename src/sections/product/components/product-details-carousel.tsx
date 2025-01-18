import { useEffect } from 'react';

import Box from '@mui/material/Box';

import { CONFIG } from 'src/config-global';

import { Image } from 'src/components/image';
import LightBox from 'src/components/lightbox/lightbox';
import { useLightBox } from 'src/components/lightbox/use-lightbox';
import {
  Carousel,
  useCarousel,
  CarouselThumb,
  CarouselThumbs,
  CarouselArrowNumberButtons,
} from 'src/components/carousel';

// ----------------------------------------------------------------------

type Props = {
  images?: string[];
};

export function ProductDetailsCarousel({ images }: Props) {
  const carousel = useCarousel({
    thumbs: {
      slidesToShow: 'auto',
    },
  });

  const slides =
    images?.map((img) => ({ src: `${CONFIG.bucket.url}/${CONFIG.bucket.name}/${img}` })) || [];

  const lightbox = useLightBox(slides);

  useEffect(() => {
    if (lightbox.open) {
      carousel.mainApi?.scrollTo(lightbox.selected, true);
    }
  }, [carousel.mainApi, lightbox.open, lightbox.selected]);

  return (
    <>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        <Box
          sx={{ mb: 2.5, position: 'relative', borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <CarouselArrowNumberButtons
            {...carousel.arrows}
            options={carousel.options}
            totalSlides={carousel.dots.dotCount}
            selectedIndex={carousel.dots.selectedIndex + 1}
            sx={{ right: 16, bottom: 16, position: 'absolute' }}
          />

          <Carousel carousel={carousel} sx={{ borderRadius: 2 }}>
            {slides.map((slide) => (
              <Image
                key={slide.src}
                alt={slide.src}
                src={slide.src}
                ratio="1/1"
                onClick={() => lightbox.onOpen(slide.src)}
                sx={{ cursor: 'zoom-in' }}
              />
            ))}
          </Carousel>
        </Box>

        <CarouselThumbs
          ref={carousel.thumbs.thumbsRef}
          options={carousel.options?.thumbs}
          slotProps={{ disableMask: true }}
          sx={{ width: 360 }}
        >
          {slides.map((item, index) => (
            <CarouselThumb
              key={item.src}
              index={index}
              src={item.src}
              selected={index === carousel.thumbs.selectedIndex}
              onClick={() => carousel.thumbs.onClickThumb(index)}
            />
          ))}
        </CarouselThumbs>
      </Box>
      <LightBox
        index={lightbox.selected}
        open={lightbox.open}
        close={lightbox.onClose}
        slides={slides}
        onGetCurrentIndex={(index) => lightbox.setSelected(index)}
      />
    </>
  );
}
