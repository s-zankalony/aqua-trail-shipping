'use client';

import { getUserDataById, protectRoute } from '@/utils/actions';
import { getUserBookings } from '@/utils/actions';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Country, ContainerSize, ContainerType } from '@prisma/client';

type UserData = {
  phone?: string;
  city?: string;
  country?: Country | null;
  image?: string;
  name: string;
  id: string;
  email: string;
  active: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
} | null;

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: Country;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

type Booking = {
  id: string;
  userId: string;
  customerId: string;
  containerSize: ContainerSize;
  containerType: ContainerType;
  containerQuantity: number;
  commodity: string;
  weight: number;
  dg: boolean;
  unNumber: string | null;
  class: string | null;
  packingGroup: string | null;
  flashPoint: string | null;
  marinePollutant: boolean | null;
  reefer: boolean;
  temperature: string | null;
  ventilation: string | null;
  humidity: string | null;
  oog: boolean;
  overLength: string | null;
  overWidth: string | null;
  overHeight: string | null;
  origin: Country;
  destination: Country;
  pol: string;
  pod: string;
  etd: Date;
  createdAt: Date;
  updatedAt: Date;
  shipper: Customer;
};

function UserBookingsPage() {
  useEffect(() => {
    const checkAuth = async () => {
      await protectRoute();
    };

    checkAuth();
  }, []);
  const params = useParams();
  const user = params.user as string;

  const [userData, setUserData] = useState<UserData>(null);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserDataById(user);
        const bookings = await getUserBookings(user);

        setUserData(userData);
        setBookings(bookings as Booking[] | null);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <>
      <h1 className="text-3xl my-8 p-4">Hello, {userData?.name}</h1>
      <h1 className="text-4xl mb-4 text-center font-bold">My Bookings</h1>

      <div className="overflow-x-auto">
        <table className="table my-4">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Booking ID</th>
              <th>Shipper Name</th>
              <th>No. of Units</th>
              <th>Container Type & size</th>
              <th>Commodity</th>
              <th>Weight</th>
              <th>DG</th>
              <th>Reefer</th>
              <th>OOG</th>
              <th>POL</th>
              <th>POD</th>
              <th>ETD</th>
              <th>Created</th>
              <th>More Details</th>
              <th>Edit</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={17} className="text-center py-4">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : (
              bookings?.map((booking) => {
                return (
                  <tr key={booking.id}>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>{booking.id}</td>
                    <td>{booking.shipper.name}</td>
                    <td>{booking.containerQuantity}</td>
                    <td>{`${
                      booking.containerSize === 'TWENTY_FT' ? "20'" : "40'"
                    } ${booking.containerType}`}</td>
                    <td>{booking.commodity}</td>
                    <td>{booking.weight}</td>
                    <td>
                      <input
                        type="checkbox"
                        className={`checkbox ${booking.dg && 'checkbox-error'}`}
                        checked={booking.dg}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className={`checkbox ${
                          booking.reefer && 'checkbox-success'
                        }`}
                        checked={booking.reefer}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className={`checkbox ${
                          booking.oog && 'checkbox-warning'
                        }`}
                        checked={booking.oog}
                        disabled
                      />
                    </td>
                    <td>{booking.pol}</td>
                    <td>{booking.pod}</td>
                    <td>{booking.etd.toLocaleDateString()}</td>
                    <td>{booking.createdAt.toLocaleDateString()}</td>
                    <th>
                      <button className="btn  btn-xs btn-info">
                        <a href={`/bookingDetails/${booking.id}`}>details</a>
                      </button>
                    </th>
                    <th>
                      <button className="btn  btn-xs btn-warning">
                        <a href={`/bookingDetails/${booking.id}/edit`}>edit</a>
                      </button>
                    </th>
                  </tr>
                );
              })
            )}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Booking ID</th>
              <th>Shipper Name</th>
              <th>No. of Units</th>
              <th>Container Type & size</th>
              <th>Commodity</th>
              <th>Weight</th>
              <th>DG</th>
              <th>Reefer</th>
              <th>OOG</th>
              <th>POL</th>
              <th>POD</th>
              <th>ETD</th>
              <th>Created</th>
              <th>More Details</th>
              <th>Edit</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
export default UserBookingsPage;
