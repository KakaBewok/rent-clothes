const OrderPreview = ({ data, onBack, onConfirm }: { data: any; onBack: () => void; onConfirm: () => void }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Preview Pesanan</h2>

            <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                <p>
                    <strong>Nama:</strong> {data.name}
                </p>
                <p>
                    <strong>No. WhatsApp:</strong> {data.phone_number}
                </p>
                <p>
                    <strong>Alamat:</strong> {data.address}
                </p>
                <p>
                    <strong>Ekspedisi:</strong> {data.expedition}
                </p>
            </div>

            <div>
                <h3 className="mb-2 font-semibold">Daftar Dress</h3>
                <ul className="space-y-2 text-sm">
                    {data.items.map((item: any, i: number) => (
                        <li key={i} className="rounded border bg-white p-3 shadow-sm">
                            <p>Produk ID: {item.product_id}</p>
                            <p>Ukuran ID: {item.size_id}</p>
                            <p>Tanggal Pakai: {item.use_by_date}</p>
                            <p>Durasi: {item.rent_periode} hari</p>
                            <p>Jumlah: {item.quantity}</p>
                            <p>Pengiriman: {item.shipping}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 flex gap-3">
                <button onClick={onBack} className="rounded-lg border px-4 py-2">
                    Kembali
                </button>
                <button onClick={onConfirm} className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                    Konfirmasi & Kirim ke WhatsApp
                </button>
            </div>
        </div>
    );
};

export default OrderPreview;
