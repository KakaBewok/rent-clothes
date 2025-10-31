import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppSetting, Product } from '@/types/models';
import { formatWhatsAppNumber } from '@/utils/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { format, startOfDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronRight, Eye, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
import { route } from 'ziggy-js';
import { z } from 'zod';
import AppLogo from '../app-logo';
import OrderSummary from './order-summary';
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

const MAX_FILE_SIZE = 2048; // 2MB

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
    product_id: z.number().min(1, 'Produk wajib diisi.'),
    size_id: z.number().min(1, 'Ukuran wajib diisi.'),
    type: z.string().nullable().optional(),
    quantity: z.number().min(1, 'Minimal 1.'),
    rent_periode: z.number().min(1, 'Minimal 1 hari.'),
    shipping: z.string().min(1, 'Jenis pengiriman wajib diisi.'),
    product_name: z.string().optional(),
    size_label: z.string().optional(),

    use_by_date: z.date().min(startOfDay(addDays(new Date(), 1)), { message: 'Minimal digunakan untuk besok.' }),
    estimated_delivery_date: z.date().min(startOfDay(new Date()), { message: 'Minimal dikirim hari ini.' }),
    estimated_return_date: z.date().min(startOfDay(addDays(new Date(), 2)), { message: 'Minimal pengembalian lusa.' }),
});

const orderFormSchema = z.object({
    // shipping info
    name: z.string().min(3, 'Nama minimal 3 karakter.'),
    phone_number: z.string().regex(/^(\+62|0)\d{9,13}$/, 'Format nomor telepon tidak valid. Contoh: 0812...'),
    identity_image: z
        .union([
            z
                .instanceof(File)
                .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
                    message: ' Hanya menerima format jpg, jpeg, png atau webp.',
                })
                .refine((file) => file.size <= MAX_FILE_SIZE * 1024, {
                    message: ` Gambar lebih dari ${MAX_FILE_SIZE / 1000} kb.`,
                }),
            z.string(),
        ])
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
    agreement: z.boolean().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

export type OrderItemData = z.infer<typeof orderItemSchema>;

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
            identity_image: undefined,
            address: '',
            expedition: '',
            account_number: '',
            provider_name: '',
            desc: '',
            items: [
                {
                    product_id: 0,
                    size_id: 0,
                    type: '',
                    quantity: 1,
                    rent_periode: 1,
                    shipping: SHIPPING_OPTIONS[1].value,
                    use_by_date: startOfDay(addDays(startOfDay(new Date()), 2)),
                    estimated_delivery_date: startOfDay(new Date()),
                    estimated_return_date: startOfDay(addDays(startOfDay(new Date()), 3)),
                },
            ],
        },
    });

    const { control, handleSubmit, watch, getValues, setValue } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    const items = watch('items');
    const isAgreed = watch('agreement');
    const firstItem = items?.[0];
    const isItemFilled =
        firstItem &&
        firstItem.product_id &&
        firstItem.size_id &&
        firstItem.quantity &&
        firstItem.rent_periode &&
        firstItem.shipping &&
        firstItem.use_by_date &&
        watch('name') &&
        watch('phone_number') &&
        watch('address') &&
        watch('expedition') &&
        watch('provider_name') &&
        watch('account_number');

    const clearForm = (type: string) => {
        form.reset();
        setAvailableProducts([]);
        setPreviewImage(null);
        const fileInput = document.getElementById('identity_image') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';

        if (type == 'reset') {
            toast.info('Form berhasil direset.');
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createWhatsAppMessage = (payload: any): string => {
        const message = encodeURIComponent(
            `Halo! \nAku udah isi form order, berikut detail pesanannya:\n\n` +
                `Nama: ${payload.name}\n` +
                `No. HP: ${payload.phone_number}\n` +
                `Foto KTP: ${payload.identity_image ? `Sudah diupload` : `Belum diupload`}\n` +
                `Expedisi: ${payload.expedition}\n` +
                `Alamat: ${payload.address}\n` +
                `Catatan: ${payload.desc ?? '-'}\n` +
                `Daftar Item:\n\n` +
                payload.items
                    .map(
                        (item: OrderItemData, i: number) =>
                            `${i + 1}. Produk: ${item.product_name}\n Ukuran: ${item.size_label}\n Tipe: ${item.type ?? '-'}\n Jumlah: ${item.quantity}\n Jenis Pengiriman: ${item.shipping}\n Durasi Sewa: ${item.rent_periode} hari\n Tanggal digunakan: ${format(item.use_by_date, 'EEEE, dd MMM yyyy', { locale: id })}`,
                    )
                    .join('\n\n') +
                `\n\nMohon konfirmasinya ya, terima kasih.`,
        );

        return `https://wa.me/${formatWhatsAppNumber(setting.whatsapp_number ?? '628877935678')}?text=${message}`;
    };

    const onSubmit = (data: OrderFormData) => {
        if (!isAgreed) {
            toast.warning('Jangan lupa centang persetujuan dulu sebelum lanjut.');
            return;
        }

        setLoading(true);

        const computedItems = data.items.map((item) => {
            const delivery = item.use_by_date && item.shipping ? subDays(new Date(item.use_by_date), item.shipping === 'Same day' ? 1 : 2) : null;
            const returnDate = item.use_by_date && item.rent_periode ? addDays(new Date(item.use_by_date), item.rent_periode) : null;

            return {
                ...item,
                estimated_delivery_date: delivery ? format(delivery, 'yyyy-MM-dd') : '',
                estimated_return_date: returnDate ? format(returnDate, 'yyyy-MM-dd') : '',
                use_by_date: item.use_by_date ? format(new Date(item.use_by_date), 'yyyy-MM-dd') : '',
            };
        });

        const payload = {
            ...data,
            items: computedItems,
            agreement: data.agreement ? 1 : 0,
        };

        const formData = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
            if (key === 'identity_image' && value instanceof File) {
                formData.append(key, value);
            } else if (key !== 'items') {
                formData.append(key, String(value ?? ''));
            }
        });

        payload.items.forEach((item, index) => {
            Object.entries(item).forEach(([field, val]) => {
                formData.append(`items[${index}][${field}]`, String(val ?? ''));
            });
        });

        router.post(route('order.store'), formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.dismiss();
                setLoading(false);

                const whatsAppUrl = createWhatsAppMessage(payload);
                window.open(whatsAppUrl, '_blank');

                toast.success(<p className="text-sm font-semibold">Pesanan berhasil disimpan!</p>, {
                    description: (
                        <div className="mt-2 flex max-w-[90vw] flex-col gap-2">
                            <p className="text-xs">Jika tidak ter-redirect otomatis, klik tombol di bawah ini:</p>
                            <button
                                onClick={() => window.open(whatsAppUrl, '_blank')}
                                className="cursor-pointer rounded-sm bg-green-500 px-3 py-1.5 text-sm text-white transition-all duration-400 hover:bg-green-600"
                            >
                                Konfirmasi via WhatsApp
                            </button>
                        </div>
                    ),
                    duration: 60000,
                });

                clearForm('submit');
            },
            onError: (errors) => {
                toast.dismiss();
                setLoading(false);
                toast.error('Terjadi kesalahan, periksa kembali data.');
                console.error('Error:', errors);
            },
            onFinish: () => setLoading(false),
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
                toast.warning('Tidak ada produk tersedia untuk jadwal tersebut.');
            }

            setAvailableProducts(res.data);
        } catch (err) {
            console.error('Error retrieving products data:', err);
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

    const formatDateForInput = (d?: Date | null) => (d ? format(d, 'yyyy-MM-dd') : '');

    const updateItem = (index: number, data: Partial<OrderItemData>) => {
        const items = getValues('items');
        const updated = { ...items[index], ...data };
        setValue(`items.${index}`, updated);
    };

    return (
        <div className="w-full max-w-[100vw] py-10 md:w-xl lg:w-2xl">
            <Toaster richColors position="top-center" />
            <Card className="rounded-sm border-none bg-white text-slate-800 shadow-none md:border md:border-slate-100 md:shadow-md">
                <CardHeader>
                    <CardTitle>
                        <AppLogo setting={setting} logoSize={150} />
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-600">Lengkapi informasi pengiriman, deposit dan detail pesanan</CardDescription>
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
                                        <FieldLabel className="text-slate-700" htmlFor="name">
                                            Nama <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="name"
                                            placeholder="Yuri Chan"
                                            className="rounded-none border border-slate-300 text-sm shadow-none"
                                        />
                                        {fieldState.invalid && <FieldError className="text-red-500" errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            {/* phone */}
                            <Controller
                                name="phone_number"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-slate-700" htmlFor="phone_number">
                                            No. Telepon <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="phone_number"
                                            placeholder="08129827378"
                                            className="rounded-none border border-slate-300 text-sm shadow-none"
                                        />
                                        {fieldState.invalid && <FieldError className="text-red-500" errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            {/* expedition */}
                            <Controller
                                name="expedition"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-slate-700" htmlFor="expedition">
                                            Ekspedisi <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value} name={field.name}>
                                            <SelectTrigger
                                                id="expedition"
                                                className="cursor-pointer rounded-none border border-slate-300 shadow-none"
                                            >
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
                                        {fieldState.invalid && <FieldError className="text-red-500" errors={[fieldState.error]} />}
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
                                            <FieldLabel className="text-slate-700" htmlFor="identity_image">
                                                Upload foto KTP
                                            </FieldLabel>
                                            <Input
                                                {...fieldProps}
                                                id="identity_image"
                                                type="file"
                                                onChange={handleFileChange}
                                                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                                className="cursor-pointer rounded-none border border-slate-300 text-xs shadow-none"
                                            />
                                            <FieldDescription className="text-xs text-slate-400">
                                                Maks. 2MB dalam format jpg/jpeg/png
                                                <br className="my-1" />
                                                🔒 Data kamu aman dan hanya digunakan untuk verifikasi.
                                            </FieldDescription>
                                            {fieldState.invalid && <FieldError className="text-red-500" errors={[fieldState.error]} />}

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
                                    <FieldLabel className="text-slate-700" htmlFor="address">
                                        Alamat Lengkap <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <InputGroup className="rounded-none border border-slate-300 shadow-none">
                                        <InputGroupTextarea
                                            {...field}
                                            id="address"
                                            placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan, Kota..."
                                            rows={3}
                                            className="min-h-24 resize-none !bg-white text-sm"
                                        />
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError className="text-red-500" errors={[fieldState.error]} />}
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
                                        <FieldLabel className="text-slate-700" htmlFor="provider_name">
                                            Bank/Provider <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value} name={field.name}>
                                            <SelectTrigger id="provider_name" className="rounded-none border border-slate-300 shadow-none">
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
                                        {fieldState.invalid && <FieldError className="text-red-500" errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            {/* Account Number */}
                            <Controller
                                name="account_number"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-slate-700" htmlFor="account_number">
                                            No. Rekening/No. E-Wallet <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="account_number"
                                            placeholder="23942477773"
                                            className="rounded-none border border-slate-300 text-sm shadow-none"
                                        />
                                        {fieldState.invalid && <FieldError className="text-red-500" errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        {/* ======================================= */}
                        {/* ## items    */}
                        {/* ======================================= */}
                        <h3 className="mt-8 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-700">Item Pesanan</h3>
                        <div className="space-y-3 md:space-y-6">
                            {fields.map((field, index) => {
                                const item = items?.[index];
                                return (
                                    <Collapsible key={field.id} className="rounded-none border border-slate-300 bg-slate-50">
                                        <CollapsibleTrigger asChild>
                                            <div className="group flex items-center justify-between p-2 md:p-4">
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
                                                        className="cursor-pointer rounded-none !bg-red-500 text-xs"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </CollapsibleTrigger>

                                        <CollapsibleContent className="space-y-6 border-t border-slate-200 bg-white p-4">
                                            <div key={field.id} className="space-y-4 rounded-none border border-slate-300 bg-slate-50 p-4">
                                                <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    {/* Shipping */}
                                                    <Controller
                                                        name={`items.${index}.shipping`}
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <FieldLabel className="text-slate-700" htmlFor="shipping">
                                                                    Jenis Pengiriman <span className="text-red-500">*</span>
                                                                </FieldLabel>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value ? field.value.toString() : undefined}
                                                                    name={field.name}
                                                                >
                                                                    <SelectTrigger
                                                                        id="shipping"
                                                                        className="cursor-pointer rounded-none border border-slate-300 shadow-none"
                                                                    >
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
                                                                {fieldState.invalid && (
                                                                    <FieldError className="text-red-500" errors={[fieldState.error]} />
                                                                )}
                                                            </Field>
                                                        )}
                                                    />

                                                    {/* Use By Date */}
                                                    <Controller
                                                        name={`items.${index}.use_by_date`}
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <FieldLabel className="text-slate-700" htmlFor="use_by_date">
                                                                    Tanggal digunakan <span className="text-red-500">*</span>
                                                                </FieldLabel>
                                                                <Input
                                                                    type="date"
                                                                    id="use_by_date"
                                                                    value={formatDateForInput(field.value as Date | undefined)}
                                                                    onChange={(e) =>
                                                                        field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                                                                    }
                                                                    className="cursor-pointer rounded-none border border-slate-300 text-sm shadow-none"
                                                                />
                                                                {fieldState.invalid && (
                                                                    <FieldError className="text-red-500" errors={[fieldState.error]} />
                                                                )}
                                                            </Field>
                                                        )}
                                                    />

                                                    {/* Rent Periode */}
                                                    <Controller
                                                        name={`items.${index}.rent_periode`}
                                                        control={control}
                                                        render={({ field: itemField, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid} className="col-span-1">
                                                                <FieldLabel className="text-slate-700" htmlFor="rent_periode">
                                                                    Lama Sewa (Hari) <span className="text-red-500">*</span>
                                                                </FieldLabel>
                                                                <Input
                                                                    id="rent_periode"
                                                                    type="number"
                                                                    min={1}
                                                                    onChange={(e) => itemField.onChange(e.target.valueAsNumber)}
                                                                    value={itemField.value}
                                                                    className="cursor-pointer rounded-none border border-slate-300 text-sm shadow-none"
                                                                />
                                                                {fieldState.invalid && (
                                                                    <FieldError className="text-red-500" errors={[fieldState.error]} />
                                                                )}
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
                                                                    const estimatedDelivery =
                                                                        item.use_by_date && item.shipping
                                                                            ? subDays(item.use_by_date, item.shipping === 'Same day' ? 1 : 2)
                                                                            : null;

                                                                    return (
                                                                        <Field data-invalid={fieldState.invalid}>
                                                                            <FieldLabel className="text-slate-700" htmlFor="estimated_delivery_date">
                                                                                Estimasi Pengiriman
                                                                            </FieldLabel>
                                                                            <Input
                                                                                type="date"
                                                                                id="estimated_delivery_date"
                                                                                value={
                                                                                    estimatedDelivery
                                                                                        ? formatDateForInput(estimatedDelivery as Date | undefined) // format yyyy-MM-dd
                                                                                        : ''
                                                                                }
                                                                                readOnly
                                                                                className="cursor-not-allowed rounded-none border border-slate-300 bg-slate-100 text-sm shadow-none"
                                                                            />
                                                                            {fieldState.invalid && (
                                                                                <FieldError className="text-red-500" errors={[fieldState.error]} />
                                                                            )}
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
                                                                            <FieldLabel className="text-slate-700" htmlFor="estimated_return_date">
                                                                                Estimasi Pengembalian
                                                                            </FieldLabel>
                                                                            <Input
                                                                                type="date"
                                                                                id="estimated_return_date"
                                                                                value={
                                                                                    estimatedReturn
                                                                                        ? formatDateForInput(estimatedReturn as Date | undefined)
                                                                                        : ''
                                                                                }
                                                                                readOnly
                                                                                className="cursor-not-allowed rounded-none border border-slate-300 bg-slate-100 text-sm shadow-none"
                                                                            />
                                                                            {fieldState.invalid && (
                                                                                <FieldError className="text-red-500" errors={[fieldState.error]} />
                                                                            )}
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
                                                        className="col-span-full cursor-pointer rounded-none bg-slate-700 text-white shadow-none hover:bg-slate-700"
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
                                                                className="rounded-none border-l-4 border-teal-400 bg-teal-100 px-4 py-3 text-xs text-teal-800 shadow-none md:text-sm"
                                                                role="alert"
                                                            >
                                                                <div className="flex">
                                                                    <div>
                                                                        Menampilkan dress yang dapat dikirim pada{' '}
                                                                        <span className="font-semibold">{formatDate(item).shipDate}</span> dipakai
                                                                        pada <span className="font-semibold">{formatDate(item).useByDate}</span> dan
                                                                        perlu dikembalikan pada{' '}
                                                                        <span className="font-semibold">{formatDate(item).returnDate}</span>.
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
                                                                    // onChange={(val) => field.onChange(val)}
                                                                    onChange={(val) => {
                                                                        field.onChange(val);
                                                                        const selected = availableProducts.find((p) => p.id === val);
                                                                        if (selected) {
                                                                            updateItem(index, {
                                                                                product_name: selected.name,
                                                                            });
                                                                        }
                                                                    }}
                                                                    availableProducts={availableProducts ?? []}
                                                                    loading={loading}
                                                                />
                                                                {fieldState.invalid && (
                                                                    <FieldError className="text-red-500" errors={[fieldState.error]} />
                                                                )}
                                                            </Field>
                                                        )}
                                                    />
                                                    {/* Size  */}
                                                    <Controller
                                                        name={`items.${index}.size_id`}
                                                        control={control}
                                                        render={({ field: itemField, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <FieldLabel htmlFor="ukuran" className="text-slate-700">
                                                                    Ukuran <span className="text-red-500">*</span>
                                                                </FieldLabel>
                                                                <Select
                                                                    // onValueChange={(val) => itemField.onChange(Number(val))}
                                                                    onValueChange={(val) => {
                                                                        itemField.onChange(Number(val));

                                                                        const selectedProduct = getSelectedProduct(item);
                                                                        const selectedSize = selectedProduct?.sizes?.find(
                                                                            (s) => s.id === Number(val),
                                                                        );
                                                                        if (selectedSize) {
                                                                            updateItem(index, {
                                                                                size_label: selectedSize.size,
                                                                            });
                                                                        }
                                                                    }}
                                                                    value={itemField.value ? itemField.value.toString() : undefined}
                                                                    name={itemField.name}
                                                                    disabled={!item?.product_id}
                                                                >
                                                                    <SelectTrigger
                                                                        id="ukuran"
                                                                        className="cursor-pointer rounded-none border border-slate-300 shadow-none"
                                                                    >
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
                                                                {fieldState.invalid && (
                                                                    <FieldError className="text-red-500" errors={[fieldState.error]} />
                                                                )}
                                                            </Field>
                                                        )}
                                                    />
                                                    {/* Type */}
                                                    {/* <Controller
                                                        name={`items.${index}.type`}
                                                        control={control}
                                                        render={({ field: itemField, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <FieldLabel htmlFor="type" className="text-slate-700">
                                                                    Tipe
                                                                </FieldLabel>
                                                                <Select
                                                                    onValueChange={(val) => itemField.onChange(val === '0' ? null : val)}
                                                                    value={itemField.value ? itemField.value : '0'}
                                                                    name={itemField.name}
                                                                    disabled={!item?.product_id}
                                                                >
                                                                    <SelectTrigger
                                                                        id="type"
                                                                        className="cursor-pointer rounded-none border border-slate-300 shadow-none"
                                                                    >
                                                                        <SelectValue placeholder="Pilih Tipe" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="rounded-none text-sm shadow-none">
                                                                        <SelectItem value={'0'} className="text-slate-700">
                                                                            Pilih tipe
                                                                        </SelectItem>
                                                                        {getSelectedProduct(item) &&
                                                                            (getSelectedProduct(item)?.types?.length ?? 0) > 0 &&
                                                                            getSelectedProduct(item)?.types?.map((type) => (
                                                                                <SelectItem key={type.id} value={type.name}>
                                                                                    {type.name}
                                                                                </SelectItem>
                                                                            ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                {fieldState.invalid && (
                                                                    <FieldError className="text-red-500" errors={[fieldState.error]} />
                                                                )}
                                                            </Field>
                                                        )}
                                                    /> */}
                                                    {/* Type */}
                                                    <Controller
                                                        name={`items.${index}.type`}
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <FieldLabel className="text-slate-700" htmlFor="type">
                                                                    Tipe
                                                                </FieldLabel>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value ? field.value.toString() : undefined}
                                                                    name={field.name}
                                                                >
                                                                    <SelectTrigger
                                                                        id="type"
                                                                        className="cursor-pointer rounded-none border border-slate-300 shadow-none"
                                                                    >
                                                                        <SelectValue placeholder="Pilih Tipe" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="rounded-none text-sm shadow-none">
                                                                        <SelectItem value="-">Pilih Tipe</SelectItem>
                                                                        <SelectItem value="Hijab">Hijab</SelectItem>
                                                                        <SelectItem value="Non Hijab">Non Hijab</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                {fieldState.invalid && (
                                                                    <FieldError className="text-red-500" errors={[fieldState.error]} />
                                                                )}
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
                                                                    <FieldLabel htmlFor={`qty-${index}`} className="text-slate-700">
                                                                        Jumlah <span className="text-red-500">*</span>
                                                                    </FieldLabel>
                                                                    <Input
                                                                        className="cursor-pointer rounded-none border border-slate-300 text-sm shadow-none"
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
                                                                    {fieldState.invalid && (
                                                                        <FieldError className="text-red-500" errors={[fieldState.error]} />
                                                                    )}
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
                                    type: '',
                                    quantity: 1,
                                    rent_periode: 1,
                                    shipping: SHIPPING_OPTIONS[1].value,
                                    use_by_date: startOfDay(addDays(startOfDay(new Date()), 2)),
                                    estimated_delivery_date: startOfDay(new Date()),
                                    estimated_return_date: startOfDay(addDays(startOfDay(new Date()), 3)),
                                })
                            }
                            className="mt-4 w-full cursor-pointer rounded-none border-1 border-dashed border-slate-400 !bg-white text-sm text-slate-700 transition duration-500 hover:bg-slate-100 hover:text-slate-700"
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
                                    <InputGroup className="rounded-none border border-slate-300 shadow-none">
                                        <InputGroupTextarea {...field} id="desc" rows={3} className="min-h-24 resize-none !bg-white text-sm" />
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {isItemFilled ? (
                            <OrderSummary fields={fields} watch={watch} getSelectedProduct={getSelectedProduct} addDays={addDays} subDays={subDays} />
                        ) : (
                            <p className="mt-8 text-center text-xs text-slate-700 italic">
                                Lengkapi data penyewaan terlebih dahulu untuk melihat ringkasan pesanan.
                            </p>
                        )}

                        <Controller
                            name="agreement"
                            control={control}
                            render={({ field }) => (
                                <div className="mt-10 flex items-start space-x-2">
                                    <div className="relative">
                                        <input
                                            id="agreement"
                                            type="checkbox"
                                            checked={field.value || false}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded-sm border border-slate-400 transition-colors checked:border-slate-700 checked:bg-slate-700"
                                        />
                                        <span className="pointer-events-none absolute top-0 left-0 hidden h-5 w-5 items-center justify-center peer-checked:flex">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="white"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-5 w-5"
                                            >
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                    </div>

                                    <label htmlFor="agreement" className="cursor-pointer text-xs leading-snug text-slate-700 md:text-sm">
                                        Saya setuju dengan syarat dan ketentuan serta memastikan data di atas sudah benar
                                    </label>
                                </div>
                            )}
                        />
                    </CardContent>

                    <CardFooter className="mt-5 w-full flex-col gap-2 md:flex-row">
                        <Button
                            type="button"
                            onClick={() => clearForm('reset')}
                            className="w-full flex-1 cursor-pointer rounded-none border-none bg-slate-200 text-slate-800 transition-all duration-600 hover:bg-slate-300"
                        >
                            Reset Formulir
                        </Button>
                        <Button
                            type="submit"
                            form="order-form-rhf"
                            className="w-full flex-1 cursor-pointer rounded-none bg-slate-800 text-slate-50 transition-all duration-400 hover:bg-slate-900"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin text-white" /> <span>Memproses...</span>
                                </>
                            ) : (
                                'Proses Pesanan'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
