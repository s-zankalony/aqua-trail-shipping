function ServicesHero() {
  return (
    <div
      className="hero max-h-80"
      style={{
        backgroundImage: 'url(images/servicesHero.jpeg)',
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content">
        <div className="max-w-4xl w-full flex flex-col justify-between lg:h-full">
          <h1 className="mb-5 text-5xl font-bold text-left">Services</h1>
          <p className="mb-5 lg:w-2/3 self-end text-lg">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
      </div>
    </div>
  );
}
export default ServicesHero;
