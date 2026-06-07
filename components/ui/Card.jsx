export default function Card({ children, className = "", ...props }) {
  return (
    <div
      {...props}
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
