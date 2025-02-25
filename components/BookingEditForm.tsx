'use client';

import React, {
  useState,
  FormEvent,
  ChangeEvent,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { findCustomers, updateSeafreightBooking } from '@/utils/actions';
import { BookingData, CustomerData } from '@/utils/types';
import { redirect } from 'next/navigation';
import Toast from '@/components/Toast';
import { Country } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface BookingEditFormProps {
  booking: BookingData; // Replace 'any' with your booking type
  customer: CustomerData; // Replace 'any' with your customer type
  bookingId: string;
}
const BookingEditForm: React.FC<BookingEditFormProps> = ({
  booking,
  customer,
  bookingId,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    text: '',
    type: '',
    status: 'hidden',
  });

  // Initialize form state
  const initialFormState: BookingData = useMemo(
    () => ({
      customerId: booking?.customerId ?? '',
      customerName: customer?.name ?? '',
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
      etd: booking?.etd ? new Date(booking.etd) : new Date(),
    }),
    [booking, customer]
  );

  // Initialize search state with customer name
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState<BookingData>(initialFormState);

  // Set initial search value after mount
  useEffect(() => {
    if (customer?.name) {
      setSearch(customer.name);
      setFormData((prev) => ({
        ...prev,
        customerName: customer.name,
        customerId: customer.id,
      }));
    }
  }, [customer]);

  const [filteredCustomers, setFilteredCustomers] = useState<CustomerData[]>(
    []
  );

  const searchResults = useCallback(async (searchTerm: string) => {
    if (searchTerm.trim()) {
      const results = await findCustomers(searchTerm);
      setFilteredCustomers(Array.isArray(results) ? results : []);
    } else {
      setFilteredCustomers([]);
    }
  }, []);

  useEffect(() => {
    searchResults(search);
  }, [search, searchResults]);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const updatedBooking = await updateSeafreightBooking({
        bookingId: bookingId,
        bookingData: formData,
      });

      setToast({
        text: 'Booking updated successfully',
        type: 'success',
        status: 'block',
      });

      // Add a small delay before redirect
      setTimeout(() => {
        router.push(`/bookingDetails/${bookingId}`);
        router.refresh();
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        status: 'block',
        text: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-6">
            Edit Booking #{bookingId}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipper Information Section */}
            <div className="bg-base-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Shipper Information
              </h3>
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
            </div>

            {/* Container Information Section */}
            <div className="bg-base-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Container Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              </div>
            </div>

            {/* Special Requirements Section */}
            <div className="bg-base-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Special Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label gap-2 justify-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="dg"
                      checked={formData.dg}
                      onChange={handleChange}
                      className="checkbox checkbox-primary"
                    />
                    <span className="label-text">Dangerous Goods</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label gap-2 justify-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="reefer"
                      checked={formData.reefer}
                      onChange={handleChange}
                      className="checkbox checkbox-primary"
                    />
                    <span className="label-text">Reefer</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label gap-2 justify-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="oog"
                      checked={formData.oog}
                      onChange={handleChange}
                      className="checkbox checkbox-primary"
                    />
                    <span className="label-text">Out of Gauge</span>
                  </label>
                </div>
              </div>

              {/* Rest of the conditional sections remain unchanged */}
              {formData.dg && (
                <div className="mt-4 pl-6 space-y-4 border-l-2 border-primary">
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
              {formData.reefer && (
                <div className="mt-4 pl-6 space-y-4 border-l-2 border-primary">
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
              {formData.oog && (
                <div className="mt-4 pl-6 space-y-4 border-l-2 border-primary">
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
            </div>

            {/* Route Information Section */}
            <div className="bg-base-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Route Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="form-control w-full md:col-span-2">
                  <label className="label">
                    <span className="label-text">
                      Estimated Time of Departure
                    </span>
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
              </div>
            </div>

            {/* Submit Button Section */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full max-w-xs mx-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Booking'}
              </button>
            </div>
          </form>

          {toast.status === 'block' && (
            <Toast text={toast.text} type={toast.type} status={toast.status} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingEditForm;
