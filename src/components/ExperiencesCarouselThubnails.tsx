import useEmblaCarousel from "embla-carousel-react";
import "./ExperiencesCarousel.css";

type CarouselItem = {
  label: string;
  image: string;
  time?: string;
};

export function ExperiencesCarouselThumb({
  items,
}: {
  items: CarouselItem[];
}) {
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
  });

  return (
    <div className="fs-experiences-carousel-combined">
      <div className="fs-experiences-label fs-label-global-sm">Concerts & Experiences</div>

      <div className="embla" ref={emblaRef}>
        <div className="embla__container embla__container-thumb">
          {items.map((item, i) => (
            <div className="embla__slide_thumb" key={i}>
              <div className="fs-experience-card">
                <div className="fs-experience-thumb">
                   {item.image &&  <img src={item.image} alt={item.label} /> }
                </div>

                <div className="fs-experience-header_thumb">
                  <div className="fs-experience-name">{item.label}</div>
                  {/* {item.time && (
                    <span className="fs-experience-time">{item.time}</span>
                  )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla-buttons">
        <button className="embla__prev" onClick={() => embla?.scrollPrev()}>
          ‹
        </button>
        <button className="embla__next" onClick={() => embla?.scrollNext()}>
          ›
        </button>
      </div>
    </div>
  );
}
