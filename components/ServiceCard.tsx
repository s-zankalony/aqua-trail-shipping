import Link from 'next/link';
import { ServiceCardType } from '../utils/types';

function ServiceCard({ service }: { service: ServiceCardType }) {
  const { id, title, img, desc, btnText, page } = service;
  return (
    <div className="card bg-base-100 w-96 shadow-xl p-4">
      <figure>
        <img src={img} alt={title} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{desc}</p>
        <div className="card-actions justify-end">
          <Link className="btn btn-primary" href={`/services#${page}`}>
            {btnText}
          </Link>
        </div>
      </div>
    </div>
  );
}
export default ServiceCard;
