import Image from 'next/image';
import { ServiceCardType } from '../types';
import LinkButton from './LinkButton';

function ServiceCard({ service }: { service: ServiceCardType }) {
  const { id, title, img, desc, page } = service;
  return (
    <div className="card bg-base-100 w-96 shadow-xl p-4" id={id}>
      <figure className="h-56 w-full overflow-hidden rounded-lg">
        <Image
          src={`/${img}`}
          alt={title}
          width={1024}
          height={768}
          className="h-full w-full object-cover"
          sizes="(min-width: 1024px) 384px, 100vw"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{desc}</p>
        <div className="card-actions justify-end pt-4">
          <LinkButton reference={`booking/${page}`} text="Book Now!" />
          <LinkButton reference={`services/${page}`} text="Learn More" />
        </div>
      </div>
    </div>
  );
}
export default ServiceCard;
