export default function SectionTitle({
  title,
  subtitle,
  align = "left",
}) {
  return (
    <div
      className={`mb-8 ${
        align === "center" ? "text-center" : ""
      }`}
    >
      <h2 className="text-3xl md:text-4xl font-black text-white">
        {title}
      </h2>

      {subtitle && (
        <p className="vs-muted mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}
