import { useState } from 'react';

export default function OrderItemForm({ onAdd }: { onAdd: (item: any) => void }) {
    const [item, setItem] = useState({
        product_id: '',
        size_id: '',
        shipping: 'Same day',
        rent_periode: 1,
        quantity: 1,
        use_by_date: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setItem({ ...item, [e.target.name]: e.target.value });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(item);
        setItem({ ...item, product_id: '', size_id: '', quantity: 1 });
    };

    return (
        <div className="mt-4 border-t pt-4">
            <h3 className="mb-3 font-semibold">Tambah Item Sewa</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <input
                    type="text"
                    name="product_id"
                    placeholder="ID Produk"
                    value={item.product_id}
                    onChange={handleChange}
                    className="rounded border p-2"
                />
                <input
                    type="text"
                    name="size_id"
                    placeholder="ID Ukuran"
                    value={item.size_id}
                    onChange={handleChange}
                    className="rounded border p-2"
                />
                <select name="shipping" value={item.shipping} onChange={handleChange} className="rounded border p-2">
                    <option value="Same day">Same Day</option>
                    <option value="Next day">Next Day</option>
                </select>
                <input
                    type="number"
                    name="rent_periode"
                    placeholder="Durasi (hari)"
                    value={item.rent_periode}
                    onChange={handleChange}
                    className="rounded border p-2"
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Jumlah"
                    value={item.quantity}
                    onChange={handleChange}
                    className="rounded border p-2"
                />
                <input type="date" name="use_by_date" value={item.use_by_date} onChange={handleChange} className="rounded border p-2" />
            </div>
            <button onClick={handleAdd} className="mt-3 rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-900">
                Tambahkan Item
            </button>
        </div>
    );
}
