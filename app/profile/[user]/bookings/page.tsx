import { getUserDataById, protectRoute } from '@/utils/actions';
import { getUserBookings } from '@/utils/actions';

async function UserBookingsPage({ params }: { params: { user: string } }) {
  await protectRoute();

  const { user } = params;
  // console.log(`Params: ${params}`);
  // console.log(`user Id: ${user}`);
  const userData = await getUserDataById(user);
  const bookings = await getUserBookings(user);

  return (
    <>
      <h1 className="text-3xl my-8">Hello, {userData?.name}</h1>
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking) => {
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
                      className="checkbox"
                      checked={booking.dg}
                      disabled
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={booking.reefer}
                      disabled
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={booking.oog}
                      disabled
                    />
                  </td>
                  <td>{booking.pol}</td>
                  <td>{booking.pod}</td>
                  <td>{booking.etd.toLocaleDateString()}</td>
                  <td>{booking.createdAt.toLocaleDateString()}</td>
                  <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                  </th>
                </tr>
              );
            })}
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
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
export default UserBookingsPage;
