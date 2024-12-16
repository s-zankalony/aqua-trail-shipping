import { services } from '@/utils/services';
import ServiceCardHorizontal from './ServiceCardHorizontal';

function ServicesPageComponent() {
  return (
    <div className="my-8 max-w-screen-xl mx-auto">
      {services.map((service) => {
        return <ServiceCardHorizontal service={service} key={service.id} />;
      })}
    </div>
  );
}
export default ServicesPageComponent;
