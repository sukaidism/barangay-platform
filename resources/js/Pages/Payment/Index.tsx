import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import Pagination from '@/Components/Pagination';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';

interface Payment {
    id: number;
    amount: string;
    or_number: string | null;
    status: string;
    remarks: string | null;
    paid_at: string | null;
    resident?: { id: number; first_name: string; last_name: string };
    payable_type: string | null;
    payable_id: number | null;
}

interface Props {
    payments: { data: Payment[]; links: Array<{ url: string | null; label: string; active: boolean }>; total: number };
}

export default function Index({ payments }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Payments</h2>}>
            <Head title="Payments" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Payments ({payments.total})</CardTitle>
                    <Button asChild><Link href={route('payment.create')}><Plus className="mr-2 h-4 w-4" />Record Payment</Link></Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Resident</TableHead><TableHead>Amount</TableHead><TableHead>OR Number</TableHead><TableHead>Status</TableHead><TableHead>Paid At</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {payments.data.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No payments found.</TableCell></TableRow>
                            ) : payments.data.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.resident ? `${p.resident.first_name} ${p.resident.last_name}` : '—'}</TableCell>
                                    <TableCell>₱{Number(p.amount).toFixed(2)}</TableCell>
                                    <TableCell>{p.or_number || '—'}</TableCell>
                                    <TableCell><Badge variant={p.status === 'Paid' ? 'default' : p.status === 'Cancelled' ? 'destructive' : 'secondary'}>{p.status}</Badge></TableCell>
                                    <TableCell>{p.paid_at || '—'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild><Link href={route('payment.show', p.id)}><Eye className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" asChild><Link href={route('payment.edit', p.id)}><Pencil className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete?')) router.delete(route('payment.destroy', p.id)); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination links={payments.links} />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
