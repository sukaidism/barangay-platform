import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Pencil } from 'lucide-react';

interface Props {
    payment: { id: number; amount: string; or_number: string | null; status: string; remarks: string | null; paid_at: string | null; created_at: string; resident?: { first_name: string; last_name: string } };
}

export default function Show({ payment }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Payment Details</h2>}>
            <Head title="Payment Details" />
            <div className="max-w-2xl">
                <div className="flex gap-2 mb-4">
                    <Button variant="ghost" size="sm" asChild><Link href={route('payment.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                    <Button variant="outline" size="sm" asChild><Link href={route('payment.edit', payment.id)}><Pencil className="mr-2 h-4 w-4" />Edit</Link></Button>
                </div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between"><CardTitle>₱{Number(payment.amount).toFixed(2)}</CardTitle><Badge variant={payment.status === 'Paid' ? 'default' : payment.status === 'Cancelled' ? 'destructive' : 'secondary'}>{payment.status}</Badge></CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div><dt className="text-sm text-muted-foreground">Resident</dt><dd className="text-sm font-medium">{payment.resident ? `${payment.resident.first_name} ${payment.resident.last_name}` : '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">OR Number</dt><dd className="text-sm font-medium">{payment.or_number || '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Paid At</dt><dd className="text-sm font-medium">{payment.paid_at || '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Recorded</dt><dd className="text-sm font-medium">{payment.created_at}</dd></div>
                            {payment.remarks && <div className="col-span-2"><dt className="text-sm text-muted-foreground">Remarks</dt><dd className="text-sm font-medium">{payment.remarks}</dd></div>}
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
