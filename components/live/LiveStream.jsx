import Card from "../ui/Card";

export default function LiveStream() {
  return (
    <Card className="overflow-hidden p-0">

      <div className="aspect-video">

        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/jfKfPfyJRdk"
          allowFullScreen
        />

      </div>

    </Card>
  );
}