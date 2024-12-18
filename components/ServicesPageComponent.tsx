import { services } from '@/utils/services';
import ServiceCardHorizontal from './ServiceCardHorizontal';

function ServicesPageComponent() {
  return (
    <div className="my-8 max-w-screen-xl mx-auto">
      {services.map((service) => (
        <div key={service.id} id={service.page}>
          <ServiceCardHorizontal service={service} />
        </div>
      ))}
    </div>
  );
}

export default ServicesPageComponent;
