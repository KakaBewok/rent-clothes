import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppSetting, Product } from '@/types/models';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronRight, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
import { z } from 'zod';
import AppLogo from '../app-logo';
import { ProductSelect } from './product-select';

const EXPEDITION_OPTIONS = [
    'Self Pickup',
    'Paxel',
    'JNE',
    'J&T Express',
    'TIKI',
    'POS Indonesia',
    'SiCepat',
    'Lion Parcel',
    'AnterAja',
    'Shopee Express',
    'Grab Express',
    'Gojek (GoSend)',
];

const PROVIDER_OPTIONS = ['Mandiri', 'BCA', 'BNI', 'BRI', 'CIMB Niaga', 'Permata', 'Danamon', 'Gopay', 'OVO', 'DANA', 'ShopeePay'];

const SHIPPING_OPTIONS = [
    { value: 'Same day', label: 'Same Day' },
    { value: 'Next day', label: 'Next Day' },
];

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const MAX_FILE_SIZE = 2000; // 2MB

// --- utils ---
const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const subDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
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
    shipping: z.string().min(1, 'Jenis pengiriman wajib diisi.'),
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

type OrderItemData = z.infer<typeof orderItemSchema>;

interface OrderFormProps {
    setting: AppSetting;
    product: Product;
}

export default function OrderForm({ setting }: OrderFormProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

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
                    shipping: SHIPPING_OPTIONS[0].value,
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

    const items = watch('items');

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
            items: cleanedItems.map(({ ...rest }) => rest),
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

    const formatDateDMY = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleSearchProducts = async (item: OrderItemData) => {
        if (!item.use_by_date || !item.shipping || !item.rent_periode) {
            toast.error('Mohon isi dulu Tanggal digunakan, Lama Sewa dan Jenis Pengiriman.');
            return;
        }

        setLoading(true);
        try {
            const params = {
                useByDate: formatDateDMY(item.use_by_date),
                shippingType: item.shipping,
                duration: item.rent_periode,
            };

            const res = await axios.get('/api/products/available', { params });

            if (res.data.length === 0) {
                toast.warning('Tidak ada produk yang tersedia untuk jadwal tersebut.');
            }

            setAvailableProducts(res.data);
        } catch (err) {
            console.error('Gagal ambil produk:', err);
        } finally {
            setLoading(false);
        }
    };

    const getSelectedProduct = (item: OrderItemData) => {
        return availableProducts.find((p) => p.id === item.product_id);
    };

    const formatDate = (item: OrderItemData) => {
        const shipDate = item.shipping === 'Next day' ? subDays(item.use_by_date, 2) : subDays(item.use_by_date, 1);
        const formattedShipDate = format(shipDate, 'dd MMMM yyyy', { locale: id });

        const returnDate = addDays(item.use_by_date, item.rent_periode);
        const formattedReturnDate = format(returnDate, 'dd MMMM yyyy', { locale: id });

        const formattedUseByDate = format(item.use_by_date, 'dd MMMM yyyy', { locale: id });

        return {
            shipDate: formattedShipDate,
            returnDate: formattedReturnDate,
            useByDate: formattedUseByDate,
        };
    };

    return (
        <div className="w-full max-w-2xl py-10">
            <Toaster richColors position="top-center" />
            <Card className="rounded-sm border-none bg-white text-slate-800 shadow-none md:border md:border-slate-100 md:shadow-md">
                <CardHeader>
                    <CardTitle>
                        <AppLogo setting={setting} logoSize={150} />
                    </CardTitle>
                    <CardDescription className="text-slate-600">Lengkapi informasi pengiriman, deposit dan detail pesanan</CardDescription>
                </CardHeader>
                <form id="order-form-rhf" onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4 md:my-5">
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
                                        <FieldLabel htmlFor="name">
                                            Nama <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input {...field} id="name" placeholder="Fairuz Ummi Cincayo" className="rounded-none text-sm shadow-none" />
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
                                        <FieldLabel htmlFor="phone_number">
                                            No. Telepon <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input {...field} id="phone_number" placeholder="08129827378" className="rounded-none text-sm shadow-none" />
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
                                        <FieldLabel htmlFor="expedition">
                                            Ekspedisi <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value} name={field.name}>
                                            <SelectTrigger id="expedition" className="cursor-pointer rounded-none shadow-none">
                                                <SelectValue placeholder="JNE" />
                                            </SelectTrigger>
                                            <SelectContent className="cursor-pointer rounded-none text-sm shadow-none">
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
                            {/* KTP */}
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
                                                className="cursor-pointer rounded-none text-xs shadow-none"
                                            />
                                            <FieldDescription className="text-xs text-slate-400">
                                                Maks. 2MB dalam format jpg/jpeg/png
                                                <br className="my-1" />
                                                🔒 Data kamu aman dan hanya digunakan untuk verifikasi.
                                            </FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                                            {/* preview image */}
                                            {(previewImage || currentImageUrl) && (
                                                <div className="relative w-full max-w-sm rounded-none border border-slate-100 p-1">
                                                    <img
                                                        src={previewImage || currentImageUrl || ''}
                                                        alt="Preview KTP"
                                                        className="h-auto w-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelImage}
                                                        className="absolute -top-2 -right-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-600 p-2 text-xl text-white transition duration-500 hover:bg-red-700"
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
                                    <FieldLabel htmlFor="address">
                                        Alamat Lengkap <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <InputGroup className="rounded-none shadow-none">
                                        <InputGroupTextarea
                                            {...field}
                                            id="address"
                                            placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan, Kota..."
                                            rows={3}
                                            className="min-h-24 resize-none text-sm"
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
                                        <FieldLabel htmlFor="provider_name">
                                            Bank/Provider <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value} name={field.name}>
                                            <SelectTrigger id="provider_name" className="rounded-none shadow-none">
                                                <SelectValue placeholder="Pilih Bank/Provider" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none text-sm shadow-none">
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
                                        <FieldLabel htmlFor="account_number">
                                            No. Rekening/No. E-Wallet <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="account_number"
                                            placeholder="23942477773"
                                            className="rounded-none text-sm shadow-none"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        {/* ======================================= */}
                        {/* ## items    */}
                        {/* ======================================= */}
                        <h3 className="mt-8 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-700">Item Pesanan</h3>
                        <div className="space-y-6">
                            {fields.map((field, index) => {
                                const item = items?.[index];
                                return (
                                    <Collapsible key={field.id} className="rounded-none border bg-slate-50">
                                        <div className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-2">
                                                <CollapsibleTrigger asChild>
                                                    <button type="button" className="group flex items-center gap-2">
                                                        <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                                                        <h4 className="font-semibold text-slate-700">Item {index + 1}</h4>
                                                    </button>
                                                </CollapsibleTrigger>
                                            </div>

                                            {fields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                    className="cursor-pointer rounded-none text-xs"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <CollapsibleContent className="space-y-6 border-t bg-white p-4">
                                            <div key={field.id} className="space-y-4 rounded-none border bg-slate-50 p-4">
                                                <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    {/* Shipping */}
                                                    <Controller
                                                        name={`items.${index}.shipping`}
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <FieldLabel htmlFor="shipping">
                                                                    Jenis Pengiriman <span className="text-red-500">*</span>
                                                                </FieldLabel>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value ? field.value.toString() : undefined}
                                                                    name={field.name}
                                                                >
                                                                    <SelectTrigger id="shipping" className="cursor-pointer rounded-none shadow-none">
                                                                        <SelectValue placeholder="Pilih Jenis Pengiriman" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="rounded-none text-sm shadow-none">
                                                                        {SHIPPING_OPTIONS.map((opt, i) => (
                                                                            <SelectItem key={i} value={opt.value}>
                                                                                {opt.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                            </Field>
                                                        )}
                                                    />

                                                    {/* Use By Date */}
                                                    <Controller
                                                        name={`items.${index}.use_by_date`}
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <FieldLabel htmlFor="use_by_date">
                                                                    Tanggal digunakan <span className="text-red-500">*</span>
                                                                </FieldLabel>
                                                                <Input
                                                                    type="date"
                                                                    id="use_by_date"
                                                                    value={field.value ? field.value.toISOString().substring(0, 10) : ''}
                                                                    onChange={(e) =>
                                                                        field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                                                                    }
                                                                    className="cursor-pointer rounded-none text-sm shadow-none"
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
                                                                <FieldLabel htmlFor="rent_periode">
                                                                    Lama Sewa (Hari) <span className="text-red-500">*</span>
                                                                </FieldLabel>
                                                                <Input
                                                                    id="rent_periode"
                                                                    type="number"
                                                                    min={1}
                                                                    onChange={(e) => itemField.onChange(e.target.valueAsNumber)}
                                                                    value={itemField.value}
                                                                    className="cursor-pointer rounded-none text-sm shadow-none"
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

                                                    {/* estimated delivery & return date */}
                                                    <div className="col-span-full w-full">
                                                        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                                                            {/* estimated_delivery_date */}
                                                            <Controller
                                                                name={`items.${index}.estimated_delivery_date`}
                                                                control={control}
                                                                render={({ fieldState }) => {
                                                                    const estimatedDate =
                                                                        item.use_by_date && item.shipping
                                                                            ? subDays(item.use_by_date, item.shipping === 'Same day' ? 1 : 2)
                                                                            : null;

                                                                    return (
                                                                        <Field data-invalid={fieldState.invalid}>
                                                                            <FieldLabel htmlFor="estimated_delivery_date">
                                                                                Estimasi Pengiriman
                                                                            </FieldLabel>
                                                                            <Input
                                                                                type="date"
                                                                                id="estimated_delivery_date"
                                                                                value={
                                                                                    estimatedDate
                                                                                        ? estimatedDate.toISOString().substring(0, 10) // format yyyy-MM-dd
                                                                                        : ''
                                                                                }
                                                                                readOnly
                                                                                className="cursor-not-allowed rounded-none bg-slate-100 text-sm shadow-none"
                                                                            />
                                                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                                        </Field>
                                                                    );
                                                                }}
                                                            />

                                                            {/* estimated_return_date */}
                                                            <Controller
                                                                name={`items.${index}.estimated_return_date`}
                                                                control={control}
                                                                render={({ fieldState }) => {
                                                                    const estimatedReturn =
                                                                        item.use_by_date && item.rent_periode
                                                                            ? addDays(item.use_by_date, item.rent_periode)
                                                                            : null;

                                                                    return (
                                                                        <Field data-invalid={fieldState.invalid}>
                                                                            <FieldLabel htmlFor="estimated_return_date">
                                                                                Estimasi Pengembalian
                                                                            </FieldLabel>
                                                                            <Input
                                                                                type="date"
                                                                                id="estimated_return_date"
                                                                                value={
                                                                                    estimatedReturn
                                                                                        ? estimatedReturn.toISOString().substring(0, 10)
                                                                                        : ''
                                                                                }
                                                                                readOnly
                                                                                className="cursor-not-allowed rounded-none bg-slate-100 text-sm shadow-none"
                                                                            />
                                                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                                        </Field>
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        onClick={() => handleSearchProducts(item)}
                                                        disabled={loading}
                                                        className="col-span-full cursor-pointer rounded-none bg-slate-700 text-white shadow-none"
                                                    >
                                                        {loading ? (
                                                            <span>Mencari...</span>
                                                        ) : (
                                                            <div className="flex items-center justify-center gap-3">
                                                                <Eye className="h-10 w-10" /> <span>Lihat Produk Tersedia</span>
                                                            </div>
                                                        )}
                                                    </Button>

                                                    {availableProducts.length > 0 && item.shipping && loading === false && (
                                                        <div className="col-span-full">
                                                            <div
                                                                className="rounded-none border-t-4 border-teal-400 bg-teal-100 px-4 py-3 text-xs text-teal-800 shadow-none md:text-sm"
                                                                role="alert"
                                                            >
                                                                <div className="flex">
                                                                    <div>
                                                                        Menampilkan dress yang dapat dikirim pada{' '}
                                                                        <span className="font-semibold">{formatDate(item).shipDate}</span> dipakai
                                                                        pada <span className="font-semibold">{formatDate(item).useByDate}</span> dan
                                                                        perlu dikembalikan pada{' '}
                                                                        <span className="font-semibold">{formatDate(item).returnDate}</span>
                                                                        {/* dengan
                                                            pengiriman dari area <span className="font-semibold">{branchName}</span> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </FieldGroup>

                                                <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {/* Product */}
                                                    <Controller
                                                        name={`items.${index}.product_id`}
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <ProductSelect
                                                                    value={field.value}
                                                                    onChange={(val) => field.onChange(val)}
                                                                    availableProducts={availableProducts ?? []}
                                                                    loading={loading}
                                                                />
                                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                            </Field>
                                                        )}
                                                    />
                                                    {/* Size  */}
                                                    <Controller
                                                        name={`items.${index}.size_id`}
                                                        control={control}
                                                        render={({ field: itemField, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <FieldLabel htmlFor="ukuran">
                                                                    Ukuran <span className="text-red-500">*</span>
                                                                </FieldLabel>
                                                                <Select
                                                                    onValueChange={(val) => itemField.onChange(Number(val))}
                                                                    value={itemField.value ? itemField.value.toString() : undefined}
                                                                    name={itemField.name}
                                                                    disabled={!item?.product_id}
                                                                >
                                                                    <SelectTrigger id="ukuran" className="cursor-pointer rounded-none shadow-none">
                                                                        <SelectValue placeholder="Pilih Ukuran" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="rounded-none text-sm shadow-none">
                                                                        {getSelectedProduct(item) ? (
                                                                            getSelectedProduct(item)?.sizes?.map((size) => (
                                                                                <SelectItem key={size.id} value={size.id.toString()}>
                                                                                    {size.size}
                                                                                </SelectItem>
                                                                            ))
                                                                        ) : (
                                                                            <SelectItem disabled value={'0'} className="text-slate-700">
                                                                                Tidak ada ukuran tersedia
                                                                            </SelectItem>
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
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
                                                                <FieldLabel htmlFor="type">Tipe</FieldLabel>
                                                                <Select
                                                                    onValueChange={(val) => itemField.onChange(Number(val))}
                                                                    value={itemField.value ? itemField.value.toString() : undefined}
                                                                    name={itemField.name}
                                                                    disabled={!item?.product_id}
                                                                >
                                                                    <SelectTrigger id="type" className="cursor-pointer rounded-none shadow-none">
                                                                        <SelectValue placeholder="Pilih Tipe" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="rounded-none text-sm shadow-none">
                                                                        {getSelectedProduct(item) &&
                                                                        (getSelectedProduct(item)?.types?.length ?? 0) > 0 ? (
                                                                            getSelectedProduct(item)?.types?.map((type) => (
                                                                                <SelectItem key={type.id} value={type.id.toString()}>
                                                                                    {type.name}
                                                                                </SelectItem>
                                                                            ))
                                                                        ) : (
                                                                            <SelectItem disabled value={'0'} className="text-slate-700">
                                                                                Tidak ada tipe tersedia
                                                                            </SelectItem>
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                            </Field>
                                                        )}
                                                    />
                                                    {/* Quantity */}
                                                    <Controller
                                                        name={`items.${index}.quantity`}
                                                        control={control}
                                                        render={({ field: itemField, fieldState }) => {
                                                            const selectedProduct = getSelectedProduct(item);
                                                            const selectedSize = selectedProduct?.sizes?.find((s) => s.id === item?.size_id);
                                                            const maxQty = selectedSize?.quantity;

                                                            return (
                                                                <Field data-invalid={fieldState.invalid}>
                                                                    <FieldLabel htmlFor={`qty-${index}`}>
                                                                        Jumlah <span className="text-red-500">*</span>
                                                                    </FieldLabel>
                                                                    <Input
                                                                        className="cursor-pointer rounded-none text-sm shadow-none"
                                                                        id={`qty-${index}`}
                                                                        type="number"
                                                                        min={1}
                                                                        disabled={!item?.size_id}
                                                                        max={maxQty ?? undefined}
                                                                        onChange={(e) => itemField.onChange(e.target.valueAsNumber)}
                                                                        value={itemField.value ?? 1}
                                                                    />
                                                                    {item?.product_id != 0 && item?.size_id != 0 && (
                                                                        <FieldDescription className="text-xs">
                                                                            Jumlah maksimal untuk ukuran terpilih adalah{' '}
                                                                            <span className="font-semibold">{maxQty}</span>
                                                                        </FieldDescription>
                                                                    )}
                                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                                </Field>
                                                            );
                                                        }}
                                                    />
                                                </FieldGroup>
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                );
                            })}
                        </div>

                        {/* button add item */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                append({
                                    product_id: 0,
                                    size_id: 0,
                                    shipping: SHIPPING_OPTIONS[0].value,
                                    type_id: 0,
                                    quantity: 1,
                                    rent_periode: 1,
                                    use_by_date: addDays(new Date(), 1),
                                })
                            }
                            className="mt-4 w-full cursor-pointer rounded-none border-1 border-dashed border-slate-400 text-sm text-slate-700 transition duration-500 hover:bg-slate-100"
                        >
                            <Plus /> Tambah Item
                        </Button>

                        {/* notes */}
                        <Controller
                            name="desc"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="desc" className="mt-3 leading-none italic">
                                        Catatan
                                    </FieldLabel>
                                    <InputGroup className="rounded-none shadow-none">
                                        <InputGroupTextarea {...field} id="desc" rows={3} className="min-h-24 resize-none text-sm" />
                                        {/* <InputGroupAddon align="block-end">
                                            <InputGroupText className="text-xs tabular-nums">{desc?.length}/500 karakter</InputGroupText>
                                        </InputGroupAddon> */}
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </CardContent>

                    <CardFooter className="mt-12 w-full flex-col gap-2 md:flex-row">
                        <Button
                            type="button"
                            onClick={() => {
                                form.reset();
                                setAvailableProducts([]);
                            }}
                            className="w-full flex-1 cursor-pointer rounded-none border-none bg-slate-200 text-slate-800 transition-all duration-600 hover:bg-slate-300"
                        >
                            Reset Formulir
                        </Button>
                        <Button
                            type="submit"
                            form="order-form-rhf"
                            className="w-full flex-1 cursor-pointer rounded-none bg-slate-800 text-slate-50 transition-all duration-400 hover:bg-slate-900"
                        >
                            Proses Pesanan
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
