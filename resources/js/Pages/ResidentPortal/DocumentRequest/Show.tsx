import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft } from 'lucide-react';

interface Props {
    documentRequest: {
        id: number; document_type: string; purpose: string; status: string;
        fee: string | null; or_number: string | null; remarks: string | null;
        released_at: string | null; created_at: string;
        payments?: Array<{ id: number; amount: string; status: string; paid_at: string | null }>;
    };
}

const statusVariant = (s: string) => { switch (s) { case 'Approved': case 'Released': return 'default' as const; case 'Rejected': return 'destructive' as const; default: return 'secondary' as const; } };

export default function Show({ documentRequest: dr }: Props) {
    const handleCancel = () => {
        if (confirm('Cancel this request?')) {
            router.delete(route('resident-portal.document-requests.cancel', dr.id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Request Details</h2>}>
            <Head title="Request Details" />
            <div className="max-w-2xl">
                <Button variant="ghost" size="sm" className="mb-4" asChild><Link href={route('resident-portal.document-requests.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{dr.document_type}</CardTitle>
                        <Badge variant={statusVariant(dr.status)}>{dr.status}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <dl className="grid grid-cols-2 gap-4">
                            <div className="col-span-2"><dt className="text-sm text-muted-foreground">Purpose</dt><dd className="text-sm font-medium">{dr.purpose}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Fee</dt><dd className="text-sm font-medium">{dr.fee ? `₱${Number(dr.fee).toFixed(2)}` : 'Not yet set'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">OR Number</dt><dd className="text-sm font-medium">{dr.or_number || '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Released At</dt><dd className="text-sm font-medium">{dr.released_at || '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Requested</dt><dd className="text-sm font-medium">{dr.created_at}</dd></div>
                            {dr.remarks && <div className="col-span-2"><dt className="text-sm text-muted-foreground">Staff Remarks</dt><dd className="text-sm font-medium">{dr.remarks}</dd></div>}
                        </dl>

                        {dr.payments && dr.payments.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium mb-2">Payment History</h4>
                                {dr.payments.map(p => (
                                    <div key={p.id} className="flex items-center justify-between text-sm border-b py-2 last:border-0">
                                        <span>₱{Number(p.amount).toFixed(2)}</span>
                                        <Badge variant={p.status === 'Paid' ? 'default' : 'secondary'}>{p.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        )}

                        {dr.status === 'Pending' && (
                            <Button variant="destructive" size="sm" onClick={handleCancel}>Cancel Request</Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
