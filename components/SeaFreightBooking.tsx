'use client';
import { findCustomers, createSeafreightBooking } from '@/utils/actions';
import { BookingData } from '@/utils/types';
import { redirect } from 'next/navigation';
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Toast from './Toast';

function SeaFreightBooking() {
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

  const [formData, setFormData] = useState<BookingData>({
    customerId: '',
    customerName: '',
    containerType: '',
    containerSize: '',
    containerQuantity: 0,
    commodity: '',
    weight: 0,
    dg: false,
    reefer: false,
    oog: false,
    origin: '',
    destination: '',
    pol: '',
    pod: '',
    etd: new Date(),
  });

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
    // Handle form submission
    console.log(formData);
    try {
      await createSeafreightBooking({ bookingData: formData });
      setToast({
        text: 'Booking created successfully',
        type: 'success',
        status: 'block',
      });
    } catch (error) {
      setToast({
        type: 'error',
        status: 'block',
        text: error as string,
      });
    }
  };

  return (
    <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title text-3xl mb-6">Sea Freight Booking</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Shipper Name</span>
            </label>
            <input
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

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Origin</span>
            </label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              placeholder="Enter origin"
              required
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Destination</span>
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter destination"
              required
              className="input input-bordered w-full"
            />
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

export default SeaFreightBooking;
