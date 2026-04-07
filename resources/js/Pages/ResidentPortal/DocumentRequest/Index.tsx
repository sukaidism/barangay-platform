import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import Pagination from '@/Components/Pagination';
import { Plus, Eye } from 'lucide-react';

interface Props {
    documentRequests: { data: Array<{ id: number; document_type: string; purpose: string; status: string; fee: string | null; created_at: string }>; links: Array<{ url: string | null; label: string; active: boolean }>; total: number };
    profileActive: boolean;
}

const statusVariant = (s: string) => {
    switch (s) { case 'Approved': case 'Released': return 'default'; case 'Rejected': return 'destructive'; default: return 'secondary'; }
};

export default function Index({ documentRequests, profileActive }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">My Document Requests</h2>}>
            <Head title="My Document Requests" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>My Requests ({documentRequests.total})</CardTitle>
                    {profileActive && <Button asChild><Link href={route('resident-portal.document-requests.create')}><Plus className="mr-2 h-4 w-4" />New Request</Link></Button>}
                </CardHeader>
                <CardContent>
                    {!profileActive && (
                        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 mb-4">
                            <p className="text-sm text-amber-800">Your profile must be verified before you can request documents.</p>
                        </div>
                    )}
                    <Table>
                        <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Purpose</TableHead><TableHead>Fee</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {documentRequests.data.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No requests yet.</TableCell></TableRow>
                            ) : documentRequests.data.map(dr => (
                                <TableRow key={dr.id}>
                                    <TableCell className="font-medium">{dr.document_type}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">{dr.purpose}</TableCell>
                                    <TableCell>{dr.fee ? `₱${Number(dr.fee).toFixed(2)}` : '—'}</TableCell>
                                    <TableCell><Badge variant={statusVariant(dr.status)}>{dr.status}</Badge></TableCell>
                                    <TableCell className="text-sm">{dr.created_at}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild><Link href={route('resident-portal.document-requests.show', dr.id)}><Eye className="h-4 w-4" /></Link></Button>
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
