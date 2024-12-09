import { services } from '@/utils/services';
import ServiceCard from './ServiceCard';

function ServicesBrief() {
  return (
    <section>
      <h1 className="text-5xl m-8">Services</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          return <ServiceCard key={service.id} service={service} />;
        })}
      </div>
    </section>
  );
}
export default ServicesBrief;
