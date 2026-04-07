import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Pencil } from 'lucide-react';

interface Props {
    documentRequest: { id: number; document_type: string; purpose: string; status: string; fee: string | null; or_number: string | null; remarks: string | null; released_at: string | null; created_at: string; resident?: { first_name: string; last_name: string } };
}

const statusVariant = (s: string) => { switch (s) { case 'Approved': case 'Released': return 'default' as const; case 'Rejected': return 'destructive' as const; default: return 'secondary' as const; } };

export default function Show({ documentRequest: dr }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Document Request Details</h2>}>
            <Head title="Document Request Details" />
            <div className="max-w-2xl">
                <div className="flex gap-2 mb-4">
                    <Button variant="ghost" size="sm" asChild><Link href={route('documentrequest.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                    <Button variant="outline" size="sm" asChild><Link href={route('documentrequest.edit', dr.id)}><Pencil className="mr-2 h-4 w-4" />Edit</Link></Button>
                </div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between"><CardTitle>{dr.document_type}</CardTitle><Badge variant={statusVariant(dr.status)}>{dr.status}</Badge></CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div><dt className="text-sm text-muted-foreground">Resident</dt><dd className="text-sm font-medium">{dr.resident ? `${dr.resident.first_name} ${dr.resident.last_name}` : '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Fee</dt><dd className="text-sm font-medium">{dr.fee ? `₱${Number(dr.fee).toFixed(2)}` : '—'}</dd></div>
                            <div className="col-span-2"><dt className="text-sm text-muted-foreground">Purpose</dt><dd className="text-sm font-medium">{dr.purpose}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">OR Number</dt><dd className="text-sm font-medium">{dr.or_number || '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Released At</dt><dd className="text-sm font-medium">{dr.released_at || '—'}</dd></div>
                            {dr.remarks && <div className="col-span-2"><dt className="text-sm text-muted-foreground">Remarks</dt><dd className="text-sm font-medium">{dr.remarks}</dd></div>}
                            <div><dt className="text-sm text-muted-foreground">Requested</dt><dd className="text-sm font-medium">{dr.created_at}</dd></div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
