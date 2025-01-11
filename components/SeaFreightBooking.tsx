'use client';
import { fetchAllCustomers, findCustomers } from '@/utils/actions';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';

function SeaFreightBooking() {
  const [search, setSearch] = useState('');
  const [allCustomers, setAllCustomers] = useState<
    { id: number; name: string }[]
  >([]);

  const [filteredCustomers, setFilteredCustomers] = useState<
    { id: number; name: string }[]
  >([]);

  const loadCustomers = async () => {
    let customers = await fetchAllCustomers();
    const mappedCustomers = customers.map((customer) => ({
      id: parseInt(customer.id),
      name: customer.name,
    }));
    setAllCustomers(mappedCustomers);
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const [formData, setFormData] = useState({
    customerName: [''],
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
    etd: '',
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
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-3xl mb-4">SeaFreightBooking</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span>Customer Name</span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              const results = allCustomers.filter((c) =>
                c.name.toLowerCase().includes(e.target.value.toLowerCase())
              );
              setFilteredCustomers(results);
            }}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <ul className="bg-white border rounded mt-1">
            {filteredCustomers.length ? (
              filteredCustomers.map((c) => (
                <li
                  key={c.id}
                  onClick={() => {
                    setFormData({ ...formData, customerName: [c.name] });
                    setSearch(c.name);
                    setFilteredCustomers([]);
                  }}
                  className="p-1 cursor-pointer hover:bg-gray-100"
                >
                  {c.name}
                </li>
              ))
            ) : (
              <li
                className="p-1 cursor-pointer hover:bg-gray-100"
                onClick={() => redirect('/customer/create')}
              >
                Create Customer
              </li>
            )}
          </ul>
        </label>
        <select
          name="containerType"
          value={formData.containerType}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Container Type</option>
          <option value="DC">Dry</option>
          <option value="RF">Reefer</option>
          <option value="RH">Reefer High Cube</option>
          <option value="OT">Open Top</option>
          <option value="OH">Open Top High Cube</option>
          <option value="FR">Flat Rack</option>
          <option value="FH">Flat Rack High Cube</option>
          <option value="TK">Tank</option>
          <option value="ITk">ISO Tank</option>
          <option value="HC">High Cube</option>
          <option value="Open Side">Open Side</option>
          <option value="Double Door">Double Door</option>
          <option value="Bulk">Bulk</option>
          <option value="Ventilated">Ventilated</option>
          <option value="IN">Insulated</option>
          <option value="Hanging">Hanging</option>
          <option value="PL">Platform</option>
          <option value="Other">Other</option>
        </select>
        <select
          name="containerSize"
          value={formData.containerSize}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Container Size</option>
          <option value="20ft">20ft</option>
          <option value="40ft">40ft</option>
        </select>
        <label className="block">
          Container Quantity
          <input
            type="number"
            name="containerQuantity"
            value={formData.containerQuantity}
            onChange={handleChange}
            placeholder="Container Quantity"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <input
          type="text"
          name="commodity"
          value={formData.commodity}
          onChange={handleChange}
          placeholder="Commodity"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <label className="block">
          Weight
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Weight"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="dg"
            checked={formData.dg}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span>Dangerous Goods</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="reefer"
            checked={formData.reefer}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span>Reefer</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="oog"
            checked={formData.oog}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span>Out of Gauge</span>
        </label>
        <input
          type="text"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          placeholder="Origin"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Destination"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="pol"
          value={formData.pol}
          onChange={handleChange}
          placeholder="Port of Loading"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="pod"
          value={formData.pod}
          onChange={handleChange}
          placeholder="Port of Discharge"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <label className="block">
          Estimated Time of Departure
          <input
            type="datetime-local"
            name="etd"
            value={formData.etd}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default SeaFreightBooking;
