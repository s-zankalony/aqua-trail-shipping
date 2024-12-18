import { ServiceCardType } from '@/utils/types';
import Link from 'next/link';

function ServiceCardHorizontal({ service }: { service: ServiceCardType }) {
  const { id, title, btnText, desc, img, page } = service;
  const extendedDesc = `${desc} 

  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta earum dolores dolore ex fugiat repudiandae optio veritatis at ullam cumque provident non, neque beatae ad veniam debitis ut molestiae autem harum. Tempora nemo omnis similique impedit nihil officia rerum provident?

  `;
  return (
    <div className="card lg:card-side bg-base-100 shadow-xl my-4">
      <figure>
        <img src={img} alt={title} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{extendedDesc}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">
            <Link href={`/${page}`}>{btnText}</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
export default ServiceCardHorizontal;
