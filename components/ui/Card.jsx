export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        vs-card
        p-4
        ${className}
      `}
    >
      {children}
    </div>
  );
}
