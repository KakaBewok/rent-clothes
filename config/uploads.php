<?php

return [
    'images' => [
        'max_size' => 3000,
        'accepted_types' => [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
        ],
    ],

    'documents' => [
        'max_size' => 5000,
        'accepted_types' => [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        ],
    ]
];
