import { ServiceCardType } from '@/utils/types';

function ServiceCardHorizontal({ service }: { service: ServiceCardType }) {
  const { id, title, btnText, desc, img } = service;
  return (
    <div className="card lg:card-side bg-base-100 shadow-xl my-4">
      <figure>
        <img src={img} alt={title} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{desc}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">{btnText}</button>
        </div>
      </div>
    </div>
  );
}
export default ServiceCardHorizontal;
