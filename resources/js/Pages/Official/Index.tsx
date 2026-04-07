import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import Pagination from '@/Components/Pagination';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';

interface Official {
    id: number;
    position: string;
    committee: string | null;
    term_start: string;
    term_end: string;
    status: string;
    resident?: { id: number; first_name: string; last_name: string };
}

interface Props {
    officials: { data: Official[]; links: Array<{ url: string | null; label: string; active: boolean }>; total: number };
}

export default function Index({ officials }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Officials</h2>}>
            <Head title="Officials" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Barangay Officials ({officials.total})</CardTitle>
                    <Button asChild><Link href={route('official.create')}><Plus className="mr-2 h-4 w-4" />Add Official</Link></Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Position</TableHead><TableHead>Committee</TableHead><TableHead>Term</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {officials.data.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No officials found.</TableCell></TableRow>
                            ) : officials.data.map((o) => (
                                <TableRow key={o.id}>
                                    <TableCell className="font-medium">{o.resident ? `${o.resident.first_name} ${o.resident.last_name}` : '—'}</TableCell>
                                    <TableCell>{o.position}</TableCell>
                                    <TableCell>{o.committee || '—'}</TableCell>
                                    <TableCell className="text-xs">{o.term_start} — {o.term_end}</TableCell>
                                    <TableCell><Badge variant={o.status === 'Active' ? 'default' : 'secondary'}>{o.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild><Link href={route('official.show', o.id)}><Eye className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" asChild><Link href={route('official.edit', o.id)}><Pencil className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete?')) router.delete(route('official.destroy', o.id)); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination links={officials.links} />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
