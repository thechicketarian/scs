import "./Loading.css";

export default function Loading({ label = "Loading…" }) {
  return (
    <div className="scs-loading-wrapper">
      <div className="scs-loading-ball">
        <img
          src="https://scs-ochre.vercel.app/icons/26-SCS-SoccerBall.svg"
          alt="loading"
        />
      </div>
      <div className="scs-loading-text">{label}</div>
    </div>
  );
}
