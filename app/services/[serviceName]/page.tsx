'use client';
import Image from 'next/image';
import { services } from '@/utils/services';
import { notFound, useParams } from 'next/navigation';
import LinkButton from '@/components/LinkButton';

function ServicePage() {
  const params = useParams();

  const searchParam = params.serviceName;
  const service = services.find((s) => s.page === searchParam);
  if (!service) {
    notFound();
  }

  // const handleBooking = () => {
  //   window.location.href = `/booking/${service.page}`;
  // };

  return (
    <div className="flex flex-col gap-4 bg-base-100 p-8 m-16 items-center">
      <figure className="max-w-2xl overflow-hidden rounded-lg">
        <Image
          width={1024}
          height={768}
          src={`/${service.img}`}
          alt={service.title}
          className="h-full w-full object-cover"
          sizes="(min-width: 768px) 640px, 100vw"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{service.title}</h2>
        <p>
          {service.desc}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
          incidunt praesentium natus omnis, fugiat nobis ipsum recusandae quasi
          vitae non atque neque minus iure amet. Obcaecati saepe culpa
          voluptates quia reiciendis. Officia nulla nobis saepe possimus alias
          esse id autem? Odit, est debitis dolorum omnis placeat esse mollitia
          praesentium nam unde asperiores rem pariatur ea inventore? Similique
          esse perspiciatis voluptatibus ad veniam, fuga quam blanditiis alias
          eius quidem ducimus cum aut quia eaque ut exercitationem repellat
          dolores..
        </p>
        <div className="card-actions justify-end mt-8">
          <LinkButton text="Book Now!" reference={`booking/${service.page}`} />
        </div>
      </div>
    </div>
  );
}
export default ServicePage;
