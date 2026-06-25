import useEmblaCarousel from "embla-carousel-react";
import "./TicketImageCarousel.css";

export default function TicketImageCarousel({ images }: { images: string[] }) {
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
  });

  const showArrows = images.length > 1;
  const enablePeek = images.length > 1; // 👈 Peek starts at 2 images

  return (
    <div
      className={`ticket-embla ${enablePeek ? "ticket-embla--peek" : ""}`}
      ref={emblaRef}
    >
      <div className="ticket-embla__container">
        {images.map((img, i) => (
          <div className="ticket-embla__slide" key={i}>
            <img src={img} alt={`ticket image ${i + 1}`} />
          </div>
        ))}
      </div>

      {showArrows && (
        <div className="ticket-embla-buttons">
          <button
            className="ticket-embla__prev"
            onClick={() => embla?.scrollPrev()}
          >
            <span className="material-symbols-outlined arrow-icon">
              arrow_back_ios
            </span>
          </button>

          <button
            className="ticket-embla__next"
            onClick={() => embla?.scrollNext()}
          >
            <span className="material-symbols-outlined arrow-icon">
              arrow_forward_ios
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
