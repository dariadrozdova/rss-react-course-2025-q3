import { NextResponse } from 'next/server';

interface Item {
  id: number;
  imageUrl?: string;
  name: string;
}

export async function POST(request: Request) {
  try {
    const { items } = (await request.json()) as { items: Item[] };

    const csvHeaders = ['ID', 'Name', 'Image URL', 'Details URL'];
    const csvRows = items.map((item) => [
      item.id.toString(),
      `"${item.name}"`,
      `"${item.imageUrl || ''}"`,
      `"${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pokemon/${item.id}"`,
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map((row) => row.join(',')),
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Disposition': 'attachment; filename="items.csv"',
        'Content-Type': 'text/csv; charset=utf-8',
      },
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { error: 'CSV generation failed' },
      { status: 500 }
    );
  }
}
