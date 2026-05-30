type CitaProps = {
  quote: string;
};

/** Centered pull quote for a project. */
export function Cita({ quote }: CitaProps) {
  return (
    <blockquote className="detail__quote">
      <p>{quote}</p>
    </blockquote>
  );
}
