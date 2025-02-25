import {
  getUserCustomers,
  getUserDataById,
  protectRoute,
} from '@/utils/actions';
import CustomerActions from '@/components/CustomerActions';
import AddCustomerButton from '@/components/AddCustomerButton';

async function UserCustomersPage({ params }: { params: { user: string } }) {
  await protectRoute();

  const user = params.user;

  const userData = await getUserDataById(user);
  if (!userData) {
    throw new Error('User not found');
  }
  const { name } = userData;
  const customers = await getUserCustomers(user);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl mb-8">Hello, {name}</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">My Customers</h2>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers?.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="font-bold">{customer.name}</div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="font-normal">{customer.email}</div>
                      </div>
                    </td>
                    <td>{customer.phone}</td>
                    <td>
                      <div className="flex flex-col">
                        <span>{customer.city}</span>
                        <span className="badge badge-ghost badge-sm">
                          {customer.country}
                        </span>
                      </div>
                    </td>
                    <td>
                      <CustomerActions customerId={customer.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {customers?.length === 0 && (
            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                No customers found. Add your first customer to get started!
              </span>
            </div>
          )}

          <div className="card-actions justify-end mt-6">
            <AddCustomerButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCustomersPage;
