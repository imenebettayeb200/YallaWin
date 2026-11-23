/** Coloured blurred blobs behind the home page. */
export default function HomeBackground() {
  return (
    <div className="home-blobs" aria-hidden="true">
      <span className="blob blob-purple" />
      <span className="blob blob-magenta" />
      <span className="blob blob-red" />
      <span className="blob blob-orange" />
      <span className="blob blob-blue" />
      <span className="blob blob-bottom-blue" />
      <span className="blob blob-bottom-pink" />
    </div>
  );
}
