import useEmblaCarousel from "embla-carousel-react";
import "./ExperiencesCarousel.css";
export function ExperiencesCarousel({
  experiences,
}: {
  experiences: { experience: string }[];
}) {
    const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
  });

  return (
    <div className="fs-experiences-carousel">
                <div className="fs-experiences-label fs-label-global-sm">Experiences</div>
      <div className="embla embla-sm-carousel" ref={emblaRef}>
        <div className="embla__container">
          {experiences.map((exp, i) => (
            <div className="embla__slide" key={i}>
              <div className="fs-experience-card">
                <div className="fs-experience-header">
                  <div className="fs-experience-name">{exp.experience}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    <div className="embla-buttons">
          <button className="embla__prev" onClick={() => embla?.scrollPrev()}>
        <span className="material-symbols-outlined">
chevron_backward
</span>
      </button>
      <button className="embla__next" onClick={() => embla?.scrollNext()}>
        <span className="material-symbols-outlined">
chevron_forward
</span>
      </button>
    </div>
    </div>
  );
}
