function AboutPage() {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 bg-base-100 p-8">
        <figure>
          <img
            src="images/vessel-under-operation.jpeg"
            className="h-300 w-600"
            alt="Album"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Our Values!</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tenetur
            totam dolorum asperiores reiciendis cumque unde maxime officia autem
            aut iste voluptas est, quae molestiae, veniam harum error facere.
            Doloremque assumenda ratione cumque asperiores? Nobis adipisci
            facere itaque deserunt cupiditate eveniet.
          </p>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-4 bg-base-100 p-8">
        <div className="card-body">
          <h2 className="card-title">Our vision!</h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam
            explicabo impedit consequatur eligendi neque maiores consectetur
            iusto dolore vero sed reprehenderit sequi quo reiciendis, facilis
            mollitia, tempore cumque? Illum dignissimos sapiente aspernatur
            animi perferendis repudiandae nihil quibusdam ipsa, debitis hic
            aliquid corporis repellendus nostrum eum ad voluptate fuga tempore
            reprehenderit.{' '}
          </p>
        </div>
        <figure>
          <img src="images/port-arial-view.jpg" alt="Album" />
        </figure>
      </div>
      <div className="flex flex-col md:flex-row gap-4 bg-base-100 p-8">
        <figure>
          <img src="images/port-at-sunset.jpg" alt="Album" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">What We are Committed to</h2>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit quos
            iste facilis incidunt qui. Sit quos sint maxime harum recusandae nam
            error placeat illo, enim esse? Reprehenderit iure iusto repellendus
            aperiam aspernatur corrupti veniam error nesciunt exercitationem at
            rerum illo tempore repellat possimus, perferendis earum delectus
            eveniet. Minus perspiciatis dolorem eligendi commodi, deleniti
            expedita. Esse eum vitae animi aliquid neque, numquam alias
            perspiciatis id voluptatem earum? Aut alias nisi odio!
          </p>
        </div>
      </div>
    </div>
  );
}
export default AboutPage;
