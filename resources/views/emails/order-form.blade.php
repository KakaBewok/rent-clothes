{{-- <!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Baru</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f3f4f6;
            padding: 20px;
            line-height: 1.6;
        }

        .email-wrapper {
            max-width: 700px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }

        .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .header .order-id {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 8px;
        }

        .content {
            padding: 30px 20px;
        }

        .section {
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #10b981;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
        }

        .info-label {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .info-value {
            font-size: 14px;
            color: #111827;
            word-wrap: break-word;
        }

        .full-width {
            grid-column: 1 / -1;
        }

        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        .items-table th {
            background: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            border-bottom: 2px solid #e5e7eb;
        }

        .items-table td {
            padding: 12px;
            font-size: 14px;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
        }

        .items-table tr:last-child td {
            border-bottom: none;
        }

        .product-name {
            font-weight: 600;
            color: #111827;
        }

        .total-section {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .total-row.grand {
            font-size: 18px;
            font-weight: 700;
            color: #059669;
            padding-top: 10px;
            border-top: 2px solid #10b981;
            margin-top: 10px;
        }

        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }

        .timestamp {
            display: inline-block;
            background: #eff6ff;
            color: #1e40af;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            margin-top: 8px;
        }

        .identity-image {
            max-width: 200px;
            border-radius: 8px;
            margin-top: 10px;
            border: 2px solid #e5e7eb;
        }

        @media (max-width: 600px) {
            .info-grid {
                grid-template-columns: 1fr;
            }

            .items-table {
                font-size: 12px;
            }

            .items-table th,
            .items-table td {
                padding: 8px;
            }
        }
    </style>
</head>

<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="header">
            <h1>🛍️ Order Baru Masuk!</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Customer Information -->
            <div class="section">
                <h2 class="section-title">👤 Informasi Customer</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Nama Pemesan</span>
                        <span class="info-value">{{ $order->name }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Nama Penerima</span>
                        <span class="info-value">{{ $order->recipient }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">No. Telepon</span>
                        <span class="info-value">
                            <a href="tel:{{ $order->phone_number }}" style="color: #10b981; text-decoration: none;">
                                {{ $order->phone_number }}
                            </a>
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Social Media</span>
                        <span class="info-value">{{ $order->social_media ?? '-' }}</span>
                    </div>
                    <div class="info-item full-width">
                        <span class="info-label">Alamat Lengkap</span>
                        <span class="info-value">{{ $order->address }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Ekspedisi</span>
                        <span class="info-value">{{ $order->expedition }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status</span>
                        <span class="status-badge status-pending">{{ $order->status }}</span>
                    </div>
                    @if ($order->desc && $order->desc !== '-')
                        <div class="info-item full-width">
                            <span class="info-label">Catatan</span>
                            <span class="info-value">{{ $order->desc }}</span>
                        </div>
                    @endif
                </div>

                @if ($order->identity_image)
                    <div style="margin-top: 15px;">
                        <span class="info-label">Foto Identitas</span><br>
                        <img src="{{ asset('storage/' . $order->identity_image) }}" alt="Identity"
                            class="identity-image">
                    </div>
                @endif
            </div>

            <!-- Payment Information -->
            <div class="section">
                <h2 class="section-title">💳 Informasi Pembayaran</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Bank/Provider</span>
                        <span class="info-value">{{ $order->provider_name }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">No. Rekening</span>
                        <span class="info-value">{{ $order->account_number }}</span>
                    </div>
                    <div class="info-item full-width">
                        <span class="info-label">Nama Pemegang Rekening</span>
                        <span class="info-value">{{ $order->account_holder }}</span>
                    </div>
                </div>
            </div>

            <!-- Order Items -->
            <div class="section">
                <h2 class="section-title">📦 Detail Pesanan</h2>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Produk</th>
                            <th>Size</th>
                            <th>Qty</th>
                            <th>Periode</th>
                            <th>Harga Sewa</th>
                            <th>Deposit</th>
                        </tr>
                    </thead>
                    <tbody>
                        @php
                            $totalRent = 0;
                            $totalDeposit = 0;
                        @endphp
                        @foreach ($order->items as $item)
                            @php
                                $totalRent += $item->rent_price;
                                $totalDeposit += $item->deposit;
                            @endphp
                            <tr>
                                <td>
                                    <div class="product-name">{{ $item->product->name ?? 'N/A' }}</div>
                                    @if ($item->type)
                                        <small style="color: #6b7280;">Type: {{ $item->type }}</small>
                                    @endif
                                </td>
                                <td>{{ $item->size->name ?? '-' }}</td>
                                <td>{{ $item->quantity }}</td>
                                <td>{{ $item->rent_periode }} hari</td>
                                <td>Rp {{ number_format($item->rent_price, 0, ',', '.') }}</td>
                                <td>Rp {{ number_format($item->deposit, 0, ',', '.') }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

                <!-- Total -->
                <div class="total-section">
                    <div class="total-row">
                        <span>Total Harga Sewa:</span>
                        <span><strong>Rp {{ number_format($totalRent, 0, ',', '.') }}</strong></span>
                    </div>
                    <div class="total-row">
                        <span>Total Deposit:</span>
                        <span><strong>Rp {{ number_format($totalDeposit, 0, ',', '.') }}</strong></span>
                    </div>
                    <div class="total-row grand">
                        <span>TOTAL PEMBAYARAN:</span>
                        <span>Rp {{ number_format($totalRent + $totalDeposit, 0, ',', '.') }}</span>
                    </div>
                </div>
            </div>

            <!-- Rental Period Details -->
            @if ($order->items->count() > 0)
                <div class="section">
                    <h2 class="section-title">📅 Jadwal Sewa</h2>
                    <div class="info-grid">
                        @foreach ($order->items as $index => $item)
                            <div class="info-item full-width"
                                style="background: #fff; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                                <div style="font-weight: 600; color: #111827; margin-bottom: 8px;">
                                    {{ $item->product->name ?? 'Product #' . ($index + 1) }}
                                </div>
                                <div
                                    style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 13px;">
                                    <div>
                                        <span class="info-label">Tanggal Pakai</span><br>
                                        <span
                                            class="info-value">{{ \Carbon\Carbon::parse($item->use_by_date)->format('d M Y') }}</span>
                                    </div>
                                    <div>
                                        <span class="info-label">Estimasi Kirim</span><br>
                                        <span
                                            class="info-value">{{ \Carbon\Carbon::parse($item->estimated_delivery_date)->format('d M Y') }}</span>
                                    </div>
                                    <div>
                                        <span class="info-label">Estimasi Kembali</span><br>
                                        <span
                                            class="info-value">{{ \Carbon\Carbon::parse($item->estimated_return_date)->format('d M Y') }}</span>
                                    </div>
                                    <div>
                                        <span class="info-label">Pengiriman</span><br>
                                        <span class="info-value">{{ ucfirst($item->shipping) }}</span>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>{{ config('app.name') }}</strong></p>
            <div class="timestamp">
                ⏰ {{ $submittedAt }} WIB
            </div>
            <p style="margin-top: 12px;">Email ini dikirim secara otomatis oleh sistem.</p>
            <p style="margin-top: 8px; color: #059669; font-weight: 600;">Mohon proses order ini!</p>
        </div>
    </div>
</body>

</html> --}}

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <style>
        /* Standar Reset */
        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            background-color: #f8fafc;
            font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f8fafc;
            padding-bottom: 40px;
        }

        .main-card {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        /* Header */
        .header {
            background: #0f172a;
            padding: 40px 20px;
            text-align: center;
            color: #ffffff;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
        }

        /* Content */
        .content {
            padding: 30px;
        }

        .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
        }

        /* Table */
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .table th {
            text-align: left;
            font-size: 12px;
            color: #94a3b8;
            padding: 12px 8px;
            border-bottom: 2px solid #f1f5f9;
        }

        .table td {
            padding: 12px 8px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
            vertical-align: top;
        }

        /* Grid Info */
        .info-box {
            background-color: #f1f5f9;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 25px;
        }

        .info-row {
            margin-bottom: 10px;
            display: block;
        }

        .label {
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
        }

        .value {
            font-size: 14px;
            color: #1e293b;
            font-weight: 500;
        }

        /* Badges */
        .badge {
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .badge-pending {
            background-color: #fef3c7;
            color: #92400e;
        }

        /* Footer */
        .footer {
            text-align: center;
            padding: 20px;
            color: #94a3b8;
            font-size: 12px;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="main-card">
            <div class="header">
                <span style="font-size: 40px;">🛍️</span>
                <h1>ORDER BARU</h1>
                <p style="margin-top: 10px; opacity: 0.8;">ID Pesanan: #{{ str_pad($order->id, 5, '0', STR_PAD_LEFT) }}
                </p>
            </div>

            <div class="content">
                <div style="text-align: right; margin-bottom: 20px;">
                    <span class="badge badge-pending">{{ $order->status }}</span>
                    <div style="font-size: 11px; color: #94a3b8; margin-top: 10px;">{{ $submittedAt }}</div>
                </div>

                <div class="section-title">Informasi Pelanggan</div>
                <div class="info-box">
                    <table width="100%">
                        <tr>
                            <td width="50%" style="padding: 5px 0;">
                                <div class="label" style="margin-bottom: 3px;">Pemesanan Atas Nama</div>
                                <div class="value">{{ $order->name }}</div>
                            </td>
                            <td width="50%" style="padding: 5px 0;">
                                <div class="label" style="margin-bottom: 3px;">WhatsApp / Telp</div>
                                <div class="value">{{ $order->phone_number }}</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="padding: 10px 0 5px 0;">
                                <div class="label" style="margin-bottom: 3px;">Alamat Pengiriman</div>
                                <div class="value">{{ $order->address }}</div>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="section-title">Rincian Produk</div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Harga Sewa</th>
                        </tr>
                    </thead>
                    <tbody>
                        @php $grandTotal = 0; @endphp
                        @foreach ($order->items as $item)
                            @php $grandTotal += ($item->rent_price + $item->deposit); @endphp
                            <tr>
                                <td>
                                    <div style="font-weight: 600; color: #1e293b; margin-bottom: 3px;">
                                        {{ $item->product->name }}</div>
                                    <div style="font-size: 12px; color: #64748b;">Size: {{ $item->size->size }} |
                                        {{ $item->rent_periode }} Hari</div>
                                </td>
                                <td style="text-align: center;">{{ $item->quantity }}</td>
                                <td style="text-align: right; font-weight: 600;">
                                    Rp{{ number_format($item->rent_price, 0, ',', '.') }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

                <div style="background: #f8fafc; border-radius: 8px; padding: 20px;">
                    <table width="100%">
                        <tr>
                            <td style="color: #64748b; font-size: 14px;">Total Deposit</td>
                            <td style="text-align: right; font-weight: 600;">
                                Rp{{ number_format($order->items->sum('deposit'), 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td style="padding-top: 10px; font-size: 16px; font-weight: 700; color: #0f172a;">Total
                                Pembayaran</td>
                            <td
                                style="padding-top: 10px; text-align: right; font-size: 18px; font-weight: 800; color: #10b981;">
                                Rp{{ number_format($grandTotal, 0, ',', '.') }}
                            </td>
                        </tr>
                    </table>
                </div>

                <div style="margin-top: 30px; text-align: center;">
                    <a href="{{ config('app.url') }}/admin/orders/{{ $order->id }}/edit" target="_blank"
                        rel="noopener noreferrer"
                        style="background-color: #0f172a; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">
                        Lihat Detail di Dashboard
                    </a>
                </div>
            </div>

            <div class="footer">
                &copy; 2025 {{ config('app.name') }}. All rights reserved.<br>
                Email ini dikirim otomatis oleh sistem.
            </div>
        </div>
    </div>
</body>

</html>
