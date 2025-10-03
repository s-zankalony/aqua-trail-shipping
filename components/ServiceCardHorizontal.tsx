import Image from 'next/image';
import { ServiceCardType } from '@/types';
import LinkButton from './LinkButton';

function ServiceCardHorizontal({ service }: { service: ServiceCardType }) {
  const { id, title, desc, img, page } = service;
  const extendedDesc = `${desc} 

  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta earum dolores dolore ex fugiat repudiandae optio veritatis at ullam cumque provident non, neque beatae ad veniam debitis ut molestiae autem harum. Tempora nemo omnis similique impedit nihil officia rerum provident?

  `;
  return (
    <div className="card lg:card-side bg-base-100 shadow-xl my-4" id={id}>
      <figure className="max-w-xl overflow-hidden rounded-lg">
        <Image
          src={`/${img}`}
          alt={title}
          width={1024}
          height={768}
          className="h-full w-full object-cover"
          sizes="(min-width: 1024px) 512px, 100vw"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{extendedDesc}</p>
        <div className="card-actions justify-end">
          <LinkButton reference={`booking/${page}`} text="Book Now!" />
          <LinkButton reference={`services/${page}`} text="More Details" />
        </div>
      </div>
    </div>
  );
}
export default ServiceCardHorizontal;
