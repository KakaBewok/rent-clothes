import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppSetting, Product } from '@/types/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form'; // Import useFieldArray
import { toast } from 'sonner';
import { z } from 'zod';
import AppLogo from '../app-logo';

const EXPEDITION_OPTIONS = ['shopee express', 'jne', 'tiki', 'pos indonesia', 'sicepat', 'jnt', 'anteraja', 'wahana'];

const PROVIDER_OPTIONS = [
    'bca',
    'mandiri',
    'bri',
    'bni',
    'bsi',
    'btn',
    'gopay',
    'ovo',
    'dana',
    'link aja',
    'shopeepay',
    'jenius',
    'bjb',
    'cimb niaga',
    'maybank',
    'bank permata',
    'bank cimb',
];

const SHIPPING_OPTIONS = [
    { value: 'same day', label: 'Same Day' },
    { value: 'next day', label: 'Next Day' },
];

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const MAX_FILE_SIZE = 2000; // 2MB

// --- utils ---
const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// --- zod schema ---
const orderItemSchema = z.object({
    id: z.string().optional(),
    product_id: z.number().min(1, 'Pilih produk.'),
    size_id: z.number().min(1, 'Pilih ukuran.'),
    type_id: z.number().min(1, 'Pilih tipe.'),
    quantity: z.number().min(1, 'Minimal 1.'),
    rent_periode: z.number().min(1, 'Minimal 1 hari.'),
    shipping: z.string().min(1, 'Tipe pengiriman wajib diisi.'),
    use_by_date: z.date().min(addDays(new Date(), 1), { error: 'Maksimal digunakan untuk besok.' }),
    estimated_delivery_date: z.date().optional(),
    estimated_return_date: z.date().optional(),
});

const orderFormSchema = z.object({
    // shipping info
    name: z.string().min(3, 'Nama minimal 3 karakter.'),
    phone_number: z.string().regex(/^(\+62|0)\d{9,13}$/, 'Format nomor telepon tidak valid. Contoh: 0812...'),
    identity_image: z
        .array(
            z.union([
                z
                    .instanceof(File)
                    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
                        message: ' Hanya menerima format jpg, jpeg, png atau webp.',
                    })
                    .refine((file) => file.size > MAX_FILE_SIZE * 1024, {
                        message: ` Gambar lebih dari ${MAX_FILE_SIZE / 1000} MB.`,
                    }),
                z.string(),
            ]),
        )
        .optional(),
    address: z.string().min(10, 'Alamat harus lengkap, minimal 10 karakter.'),
    expedition: z.string().min(1, 'Jasa ekspedisi wajib diisi.'),

    // deposit return info
    account_number: z.string().min(5, 'Nomor rekening/akun minimal 5 digit.'),
    provider_name: z.string().min(1, 'Nama provider wajib diisi.'),

    // items
    items: z.array(orderItemSchema).min(1, 'Minimal 1 item.'),

    // order notes
    desc: z.string().max(500, 'Catatan maksimal 500 karakter.').optional().or(z.literal('')),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
    setting: AppSetting;
    product: Product;
}

export default function OrderForm({ setting, product }: OrderFormProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const form = useForm<OrderFormData>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            name: '',
            phone_number: '',
            identity_image: [],
            address: '',
            expedition: '',
            account_number: '',
            provider_name: '',
            desc: '',
            items: [
                {
                    product_id: 0,
                    size_id: 0,
                    type_id: 0,
                    quantity: 1,
                    rent_periode: 1,
                    shipping: '',
                    use_by_date: addDays(new Date(), 1),
                    estimated_delivery_date: new Date(),
                    estimated_return_date: new Date(),
                },
            ],
        },
    });

    const { control, handleSubmit, watch } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    const desc = watch('desc', '');

    // const useByDate = watch('use_by_date');
    // const shipping = watch('shipping');
    // const currentDesc = watch('desc') || '';
    // Gunakan watch('items') untuk mendapatkan periode sewa terpanjang secara dinamis jika diperlukan
    // const watchedItems = watch('items');

    const onSubmit = (data: OrderFormData) => {
        // --- Hitung tanggal estimasi pengiriman & pengembalian ---
        const cleanedItems = data.items.map((item) => {
            let estimatedDeliveryDate: Date | undefined;
            let estimatedReturnDate: Date | undefined;

            if (item.use_by_date) {
                const deliveryOffset = item.shipping === 'same day' ? -1 : -2;
                estimatedDeliveryDate = addDays(item.use_by_date, deliveryOffset);

                // Hitung tanggal kembali berdasarkan rent_periode item ini
                estimatedReturnDate = addDays(item.use_by_date, item.rent_periode);
            }

            return {
                ...item,
                estimated_delivery_date: estimatedDeliveryDate,
                estimated_return_date: estimatedReturnDate,
            };
        });

        // --- Hilangkan file untuk keperluan JSON preview ---
        const { identity_image, ...dataWithoutFile } = data;

        const finalData = {
            ...dataWithoutFile,
            items: cleanedItems.map(({ id, ...rest }) => rest),
            identity_image_status: identity_image?.[0] instanceof File ? `File uploaded: ${identity_image[0].name}` : 'No file',
        };

        // --- Tampilkan hasil submit (preview di toast) ---
        toast.success('Formulir Pemesanan berhasil disubmit!', {
            description: (
                <pre className="mt-2 w-[400px] overflow-x-auto rounded-md bg-gray-100 p-4 text-sm">
                    <code>{JSON.stringify(finalData, null, 2)}</code>
                </pre>
            ),
            position: 'bottom-right',
        });

        // --- Contoh pengiriman data ke backend (Laravel API) ---
        const formData = new FormData();

        // Gabungkan file (jika ada)
        if (identity_image && identity_image[0] instanceof File) {
            formData.append('identity_image', identity_image[0]);
        }

        // Gabungkan data lain (non-file)
        formData.append('payload', JSON.stringify(finalData));

        // Kirim ke endpoint Laravel kamu
        fetch('/orders', {
            method: 'POST',
            body: formData,
        })
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text());
                toast.success('Pemesanan berhasil disimpan ke server!');
            })
            .catch((err) => {
                toast.error('Gagal menyimpan pemesanan.', {
                    description: err.message,
                });
            });
    };

    return (
        <div className="w-full max-w-2xl py-10">
            <Card className="rounded-sm border border-slate-100 bg-white text-slate-800 shadow-md">
                <CardHeader>
                    <CardTitle>
                        <AppLogo setting={setting} logoSize={150} />
                    </CardTitle>
                    <CardDescription className="text-slate-600">Lengkapi informasi pengiriman, deposit dan detail pesanan</CardDescription>
                </CardHeader>
                <form id="order-form-rhf" onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="my-5 space-y-6">
                        {/* ======================================= */}
                        {/* ## shipping info                 */}
                        {/* ======================================= */}
                        <h3 className="border-b border-slate-200 pb-2 text-lg font-semibold text-slate-700">Info Pengiriman</h3>
                        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* name */}
                            <Controller
                                name="name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name">Nama</FieldLabel>
                                        <Input {...field} id="name" placeholder="Fairuz Ummi Cincayo" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            {/* phone */}
                            <Controller
                                name="phone_number"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="phone_number">No. Telepon</FieldLabel>
                                        <Input {...field} id="phone_number" placeholder="08129827378" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            {/* expedition */}
                            <Controller
                                name="expedition"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="expedition">Ekspedisi</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value} name={field.name}>
                                            <SelectTrigger id="expedition">
                                                <SelectValue placeholder="JNE" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {EXPEDITION_OPTIONS.map((exp, i) => (
                                                    <SelectItem key={i} value={exp}>
                                                        {exp.toUpperCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            {/* identity image  TODO*/}
                            {/* <Controller
                                name="identity_image"
                                control={control}
                                render={({ field: { value, onChange, ...fieldProps }, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="identity_image">Upload KTP</FieldLabel>
                                        <Input
                                            {...fieldProps}
                                            id="identity_image"
                                            type="file"
                                            onChange={(e) => {
                                                onChange(e.target.files);
                                            }}
                                            accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                        />
                                        <FieldDescription>Maksimal 2MB, format jpg, jpeg atau png</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            /> */}
                            <Controller
                                name="identity_image"
                                control={control}
                                render={({ field: { value, onChange, ...fieldProps }, fieldState }) => {
                                    const currentImageUrl =
                                        value instanceof File ? URL.createObjectURL(value) : typeof value === 'string' ? value : null;

                                    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            onChange(file);
                                            setPreviewImage(URL.createObjectURL(file));
                                        } else {
                                            onChange(undefined);
                                            setPreviewImage(null);
                                        }
                                    };

                                    const handleCancelImage = () => {
                                        onChange(undefined);
                                        setPreviewImage(null);

                                        const fileInput = document.getElementById('identity_image') as HTMLInputElement | null;
                                        if (fileInput) {
                                            fileInput.value = '';
                                        }
                                    };

                                    return (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="identity_image">Upload foto KTP</FieldLabel>
                                            <Input
                                                {...fieldProps}
                                                id="identity_image"
                                                type="file"
                                                onChange={handleFileChange}
                                                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                            />
                                            <FieldDescription>Upload 1 foto, maksimal 2MB format jpg, jpeg atau png</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                                            {/* preview image */}
                                            {(previewImage || currentImageUrl) && (
                                                <div className="relative w-full max-w-sm rounded-none border border-slate-200 p-1">
                                                    <img
                                                        src={previewImage || currentImageUrl || ''}
                                                        alt="Preview KTP"
                                                        className="h-auto w-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelImage}
                                                        className="absolute -top-2 -right-2 m-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-600 p-2 text-xl text-white transition duration-500 hover:bg-red-700"
                                                        aria-label="Batalkan Upload Gambar"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                        </FieldGroup>
                        {/* address */}
                        <Controller
                            name="address"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="address">Alamat Lengkap</FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            id="address"
                                            placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan, Kota..."
                                            rows={3}
                                            className="min-h-24 resize-none"
                                        />
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* ======================================= */}
                        {/* ## return info            */}
                        {/* ======================================= */}
                        <h3 className="mt-8 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-700">Pengembalian Deposit</h3>
                        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Provider */}
                            <Controller
                                name="provider_name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="provider_name">Bank/Provider</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value} name={field.name}>
                                            <SelectTrigger id="provider_name">
                                                <SelectValue placeholder="Pilih Bank/Provider" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PROVIDER_OPTIONS.map((prov, i) => (
                                                    <SelectItem key={i} value={prov}>
                                                        {prov.toUpperCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            {/* Account Number */}
                            <Controller
                                name="account_number"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="account_number">No. Rekening/No. E-Wallet</FieldLabel>
                                        <Input {...field} id="account_number" placeholder="23942477773" />
                                        {/* <FieldDescription>Pastikan nomor sudah benar.</FieldDescription> */}
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        {/* ======================================= */}
                        {/* ## items    */}
                        {/* ======================================= */}
                        <h3 className="mt-8 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-700">Detail Item Pesanan</h3>
                        <div className="space-y-6">
                            {fields.map((field, index) => (
                                <div key={field.id} className="space-y-4 rounded-md border bg-gray-50 p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <h4 className="font-medium text-indigo-600">Item #{index + 1}</h4>
                                        {fields.length > 1 && (
                                            <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                                Hapus
                                            </Button>
                                        )}
                                    </div>

                                    <FieldGroup className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        {/* Product ID (Simulasi) */}
                                        <Controller
                                            name={`items.${index}.product_id`}
                                            control={control}
                                            render={({ field: itemField, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel>Produk</FieldLabel>
                                                    <Select
                                                        onValueChange={(val) => itemField.onChange(Number(val))}
                                                        value={itemField.value.toString()}
                                                        name={itemField.name}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Produk" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1">Produk A</SelectItem>
                                                            <SelectItem value="2">Produk B</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                            )}
                                        />
                                        {/* Size ID (Simulasi) */}
                                        <Controller
                                            name={`items.${index}.size_id`}
                                            control={control}
                                            render={({ field: itemField, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel>Ukuran</FieldLabel>
                                                    <Select
                                                        onValueChange={(val) => itemField.onChange(Number(val))}
                                                        value={itemField.value.toString()}
                                                        name={itemField.name}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Ukuran" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="101">S</SelectItem>
                                                            <SelectItem value="102">M</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                            )}
                                        />
                                        {/* Use By Date */}
                                        <Controller
                                            name={`items.${index}.use_by_date`}
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="use_by_date">Tanggal Penggunaan (Use By Date)</FieldLabel>
                                                    {/* Ganti dengan komponen DatePicker yang mengembalikan Date object */}
                                                    <Input
                                                        type="date"
                                                        id="use_by_date"
                                                        value={field.value ? field.value.toISOString().substring(0, 10) : ''}
                                                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                                    />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                        {/* Rent Periode */}
                                        <Controller
                                            name={`items.${index}.rent_periode`}
                                            control={control}
                                            render={({ field: itemField, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid} className="col-span-1">
                                                    <FieldLabel>Periode Sewa (Hari)</FieldLabel>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        onChange={(e) => itemField.onChange(e.target.valueAsNumber)}
                                                        value={itemField.value}
                                                    />
                                                    {/* <FieldDescription>
                                                        Kembali:{' '}
                                                        <span className="font-semibold">
                                                            {useByDate && itemField.value > 0
                                                                ? addDays(useByDate, itemField.value).toLocaleDateString('id-ID')
                                                                : 'N/A'}
                                                        </span>
                                                    </FieldDescription> */}
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                        {/* Shipping */}
                                        <Controller
                                            name={`items.${index}.shipping`}
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="shipping">Jenis Pengiriman</FieldLabel>
                                                    <Select onValueChange={field.onChange} value={field.value} name={field.name}>
                                                        <SelectTrigger id="shipping">
                                                            <SelectValue placeholder="Pilih Jenis Pengiriman" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {SHIPPING_OPTIONS.map((opt) => (
                                                                <SelectItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {/* <FieldDescription>
                                                        Estimasi Kirim:{' '}
                                                        <span className="font-semibold">
                                                            {useByDate && shipping
                                                                ? addDays(form.useByDate, field.value === 'same day' ? -1 : -2).toLocaleDateString('id-ID')
                                                                : 'N/A'}
                                                        </span>
                                                    </FieldDescription> */}
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                        {/* Type */}
                                        <Controller
                                            name={`items.${index}.type_id`}
                                            control={control}
                                            render={({ field: itemField, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel>Tipe</FieldLabel>
                                                    <Select
                                                        onValueChange={(val) => itemField.onChange(Number(val))}
                                                        value={itemField.value.toString()}
                                                        name={itemField.name}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Tipe" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="tipe a">Tipe a</SelectItem>
                                                            <SelectItem value="tipe b">Tipe b</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                            )}
                                        />
                                        {/* Quantity */}
                                        <Controller
                                            name={`items.${index}.quantity`}
                                            control={control}
                                            render={({ field: itemField, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel>Jumlah</FieldLabel>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        onChange={(e) => itemField.onChange(e.target.valueAsNumber)}
                                                        value={itemField.value}
                                                    />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                    </FieldGroup>
                                </div>
                            ))}
                        </div>

                        {/* button add item */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                append({
                                    product_id: 0,
                                    size_id: 0,
                                    shipping: 'jne',
                                    type_id: 0,
                                    quantity: 1,
                                    rent_periode: 1,
                                    use_by_date: addDays(new Date(), 2),
                                })
                            }
                            className="mt-4 w-full border-2 border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        >
                            + Tambah Item Lain
                        </Button>

                        {/* notes */}
                        <Controller
                            name="desc"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="desc" className="mt-8">
                                        Catatan Order Keseluruhan (Opsional)
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea {...field} id="desc" rows={3} className="min-h-24 resize-none" />
                                        <InputGroupAddon align="block-end">
                                            <InputGroupText className="tabular-nums">{desc?.length}/500 karakter</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </CardContent>

                    <CardFooter className="mt-12 w-full flex-col gap-3 md:flex-row">
                        <Button
                            type="button"
                            onClick={() => form.reset()}
                            className="w-full cursor-pointer rounded-none border-none bg-slate-200 text-slate-800 transition-all duration-600 hover:bg-slate-300 md:w-1/2"
                        >
                            Reset Formulir
                        </Button>
                        <Button
                            type="submit"
                            form="order-form-rhf"
                            className="w-full cursor-pointer rounded-none bg-slate-800 text-slate-50 transition-all duration-400 hover:bg-slate-900 md:w-1/2"
                        >
                            Proses Pesanan
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
