'use client';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

function StatsComponent() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  return (
    <div className="stats stats-vertical m-auto lg:stats-horizontal shadow">
      <div className="stat">
        <div className="stat-title">Users</div>
        <div className="stat-value">
          <CountUp end={700} duration={2.5} suffix="+" enableScrollSpy />
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Customers</div>
        <div className="stat-value">
          <CountUp end={1200} duration={2.5} suffix="+" enableScrollSpy />
        </div>
      </div>
    </div>
  );
}
export default StatsComponent;
