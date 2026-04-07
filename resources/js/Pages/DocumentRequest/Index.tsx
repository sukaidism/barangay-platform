import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import Pagination from '@/Components/Pagination';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';

interface DocumentRequest {
    id: number;
    document_type: string;
    purpose: string;
    status: string;
    fee: string | null;
    or_number: string | null;
    released_at: string | null;
    resident?: { id: number; first_name: string; last_name: string };
}

interface Props {
    documentRequests: { data: DocumentRequest[]; links: Array<{ url: string | null; label: string; active: boolean }>; total: number };
}

const statusVariant = (s: string) => {
    switch (s) {
        case 'Approved': case 'Released': return 'default';
        case 'Rejected': return 'destructive';
        default: return 'secondary';
    }
};

export default function Index({ documentRequests }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Document Requests</h2>}>
            <Head title="Document Requests" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Document Requests ({documentRequests.total})</CardTitle>
                    <Button asChild><Link href={route('documentrequest.create')}><Plus className="mr-2 h-4 w-4" />New Request</Link></Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Resident</TableHead><TableHead>Type</TableHead><TableHead>Purpose</TableHead><TableHead>Fee</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {documentRequests.data.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No requests found.</TableCell></TableRow>
                            ) : documentRequests.data.map((dr) => (
                                <TableRow key={dr.id}>
                                    <TableCell className="font-medium">{dr.resident ? `${dr.resident.first_name} ${dr.resident.last_name}` : '—'}</TableCell>
                                    <TableCell>{dr.document_type}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">{dr.purpose}</TableCell>
                                    <TableCell>{dr.fee ? `₱${Number(dr.fee).toFixed(2)}` : '—'}</TableCell>
                                    <TableCell><Badge variant={statusVariant(dr.status)}>{dr.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild><Link href={route('documentrequest.show', dr.id)}><Eye className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" asChild><Link href={route('documentrequest.edit', dr.id)}><Pencil className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete?')) router.delete(route('documentrequest.destroy', dr.id)); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination links={documentRequests.links} />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
