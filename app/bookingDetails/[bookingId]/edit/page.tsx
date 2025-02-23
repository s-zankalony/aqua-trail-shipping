'use client';
import {
  findCustomers,
  createSeafreightBooking,
  protectRoute,
  getBookingById,
  getCustomerById,
} from '@/utils/actions';
import { BookingData } from '@/utils/types';
import { redirect } from 'next/navigation';
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Toast from '@/components/Toast';
import { Country } from '@prisma/client';
import { getUserId } from '@/utils/actions';

async function BookingEditPage({ params }: { params: { bookingId: string } }) {
  // await protectRoute();

  const { bookingId } = params;
  console.log(`booking ID: ${bookingId}`);

  const booking = await getBookingById(bookingId);

  const [toast, setToast] = useState({
    text: '',
    type: '',
    status: 'hidden',
  });
  const [search, setSearch] = useState('');

  const [filteredCustomers, setFilteredCustomers] = useState<
    {
      name: string;
      email: string;
      id: string;
      phone: string;
      address: string;
      city: string;
      country: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  >([]);

  const searchResults = async (search: string) => {
    const results = await findCustomers(search);
    setFilteredCustomers(Array.isArray(results) ? results : []);
  };

  useEffect(() => {
    searchResults(search);
  }, [search]);

  const customer = booking?.customerId
    ? await getCustomerById(booking.customerId)
    : null;

  const initialFormState: BookingData = {
    customerId: booking?.customerId ?? '',
    customerName: customer?.name,
    containerType: booking?.containerType ?? '',
    containerSize: booking?.containerSize ?? '',
    containerQuantity: booking?.containerQuantity ?? 0,
    commodity: booking?.commodity ?? '',
    weight: booking?.weight ?? 0,
    dg: booking?.dg ?? false,
    reefer: booking?.reefer ?? false,
    oog: booking?.oog ?? false,
    origin: booking?.origin ?? '',
    destination: booking?.destination ?? '',
    pol: booking?.pol ?? '',
    pod: booking?.pod ?? '',
    etd: booking?.etd ?? new Date(),
  };

  const [formData, setFormData] = useState<BookingData>(initialFormState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (type === 'datetime-local') {
      setFormData({
        ...formData,
        [name]: new Date(value),
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSearch('');
    setFilteredCustomers([]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    try {
      const userId = await getUserId();
      if (!userId) {
        redirect('/login');
      }
      const booking = await createSeafreightBooking({ bookingData: formData });
      setToast({
        text: `Booking created successfully, your booking no. <strong style="font-size: 1.2em">${booking.id}</strong>`,
        type: 'success',
        status: 'block',
      });
      resetForm();
    } catch (error) {
      setToast({
        type: 'error',
        status: 'block',
        text: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  return (
    <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl">
    <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title text-3xl mb-6">Sea Freight Booking</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Shipper Name</span>
            </label>
            <input
              required
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="input input-bordered w-full"
            />
            {(filteredCustomers.length > 0 || search) && (
              <ul className="menu bg-base-200 rounded-box mt-1">
                {filteredCustomers.length ? (
                  filteredCustomers.map((c) => (
                    <li key={c.id}>
                      <a
                        onClick={() => {
                          setFormData({
                            ...formData,
                            customerId: c.id,
                            customerName: c.name,
                          });
                          setSearch(c.name);
                          setFilteredCustomers([]);
                        }}
                      >
                        <p>{c.name}</p>
                        <p>{c.address}</p>
                        <p>{c.city}</p>
                        <p>{c.country}</p>
                      </a>
                    </li>
                  ))
                ) : (
                  <li>
                    <a onClick={() => redirect('/customer/create')}>
                      Create Customer
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Container Type</span>
            </label>
            <select
              name="containerType"
              value={formData.containerType}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="">Select Container Type</option>
              <option value="DRY">DC</option>
              <option value="HIGH_CUBE">HC</option>
              <option value="REEFER">RF</option>
              <option value="REEFER_HIGH_CUBE">RH</option>
              <option value="OPEN_TOP">OT</option>
              <option value="OPEN_TOP_HIGH_CUBE">OH</option>
              <option value="FLAT_RACK">FR</option>
              <option value="FLAT_RACK_HIGH_CUBE">FH</option>
              <option value="TANK">TK</option>
              <option value="ITkISO_TANK">ISO Tank</option>
              <option value="OPEN_SIDE">Open Side</option>
              <option value="DOUBLE_DOOR">Double Door</option>
              <option value="BULK">Bulk</option>
              <option value="VENTILATED">Ventilated</option>
              <option value="INSULATED">IN</option>
              <option value="HANGING">Hanging</option>
              <option value="PLATFORM">Platform</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Container Size</span>
            </label>
            <select
              name="containerSize"
              value={formData.containerSize}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="">Select Container Size</option>
              <option value="TWENTY_FT">20ft</option>
              <option value="FORTY_FT">40ft</option>
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Container Quantity</span>
            </label>
            <input
              type="number"
              name="containerQuantity"
              value={formData.containerQuantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              required
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Commodity</span>
            </label>
            <input
              type="text"
              name="commodity"
              value={formData.commodity}
              onChange={handleChange}
              placeholder="Enter commodity"
              required
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Weight</span>
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Enter weight"
              required
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Dangerous Goods</span>
              <input
                type="checkbox"
                name="dg"
                checked={formData.dg}
                onChange={handleChange}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>

          {formData.dg && (
            <div className="pl-6 space-y-4 border-l-2 border-primary">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">UN Number</span>
                </label>
                <input
                  type="text"
                  name="unNumber"
                  value={formData.unNumber || ''}
                  onChange={handleChange}
                  placeholder="Enter UN Number"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Class</span>
                </label>
                <input
                  type="text"
                  name="class"
                  value={formData.class || ''}
                  onChange={handleChange}
                  placeholder="Enter Class"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Packing Group</span>
                </label>
                <input
                  type="text"
                  name="packingGroup"
                  value={formData.packingGroup || ''}
                  onChange={handleChange}
                  placeholder="Enter Packing Group"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Flash Point</span>
                </label>
                <input
                  type="text"
                  name="flashPoint"
                  value={formData.flashPoint || ''}
                  onChange={handleChange}
                  placeholder="Enter Flash Point"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Marine Pollutant</span>
                  <input
                    type="checkbox"
                    name="marinePollutant"
                    checked={formData.marinePollutant || false}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
            </div>
          )}

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Reefer</span>
              <input
                type="checkbox"
                name="reefer"
                checked={formData.reefer}
                onChange={handleChange}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>

          {formData.reefer && (
            <div className="pl-6 space-y-4 border-l-2 border-primary">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Temperature</span>
                </label>
                <input
                  type="text"
                  name="temperature"
                  value={formData.temperature || ''}
                  onChange={handleChange}
                  placeholder="Enter Temperature"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Ventilation</span>
                </label>
                <input
                  type="text"
                  name="ventilation"
                  value={formData.ventilation || ''}
                  onChange={handleChange}
                  placeholder="Enter Ventilation"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Humidity</span>
                </label>
                <input
                  type="text"
                  name="humidity"
                  value={formData.humidity || ''}
                  onChange={handleChange}
                  placeholder="Enter Humidity"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          )}

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Out of Gauge</span>
              <input
                type="checkbox"
                name="oog"
                checked={formData.oog}
                onChange={handleChange}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>

          {formData.oog && (
            <div className="pl-6 space-y-4 border-l-2 border-primary">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Over Length</span>
                </label>
                <input
                  type="text"
                  name="overLength"
                  value={formData.overLength || ''}
                  onChange={handleChange}
                  placeholder="Enter Over Length"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Over Width</span>
                </label>
                <input
                  type="text"
                  name="overWidth"
                  value={formData.overWidth || ''}
                  onChange={handleChange}
                  placeholder="Enter Over Width"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Over Height</span>
                </label>
                <input
                  type="text"
                  name="overHeight"
                  value={formData.overHeight || ''}
                  onChange={handleChange}
                  placeholder="Enter Over Height"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          )}

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Origin Country</span>
            </label>
            <select
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="">Select origin country</option>
              {Object.values(Country).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Destination Country</span>
            </label>
            <select
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="">Select destination country</option>
              {Object.values(Country).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Port of Loading</span>
            </label>
            <input
              type="text"
              name="pol"
              value={formData.pol}
              onChange={handleChange}
              placeholder="Enter port of loading"
              required
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Port of Discharge</span>
            </label>
            <input
              type="text"
              name="pod"
              value={formData.pod}
              onChange={handleChange}
              placeholder="Enter port of discharge"
              required
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Estimated Time of Departure</span>
            </label>
            <input
              type="datetime-local"
              name="etd"
              value={formData.etd.toISOString().slice(0, 16)}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">
              Submit Booking
            </button>
          </div>
        </form>
        <Toast status={toast.status} text={toast.text} type={toast.type} />
      </div>
    </div>
  );
}
export default BookingEditPage;
