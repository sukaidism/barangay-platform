import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import Pagination from '@/Components/Pagination';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';

interface Blotter {
    id: number;
    incident_type: string;
    incident_date: string;
    incident_location: string | null;
    status: string;
    complainant?: { id: number; first_name: string; last_name: string };
    respondent?: { id: number; first_name: string; last_name: string };
}

interface Props {
    blotters: { data: Blotter[]; links: Array<{ url: string | null; label: string; active: boolean }>; total: number };
}

const statusVariant = (s: string) => {
    switch (s) {
        case 'Resolved': return 'default';
        case 'Dismissed': return 'secondary';
        default: return 'secondary';
    }
};

export default function Index({ blotters }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Blotter Records</h2>}>
            <Head title="Blotter Records" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Blotter Records ({blotters.total})</CardTitle>
                    <Button asChild><Link href={route('blotter.create')}><Plus className="mr-2 h-4 w-4" />File Blotter</Link></Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Complainant</TableHead><TableHead>Respondent</TableHead><TableHead>Incident</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {blotters.data.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No records found.</TableCell></TableRow>
                            ) : blotters.data.map((b) => (
                                <TableRow key={b.id}>
                                    <TableCell className="font-medium">{b.complainant ? `${b.complainant.first_name} ${b.complainant.last_name}` : '—'}</TableCell>
                                    <TableCell>{b.respondent ? `${b.respondent.first_name} ${b.respondent.last_name}` : '—'}</TableCell>
                                    <TableCell>{b.incident_type}</TableCell>
                                    <TableCell className="text-sm">{b.incident_date}</TableCell>
                                    <TableCell><Badge variant={statusVariant(b.status)}>{b.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild><Link href={route('blotter.show', b.id)}><Eye className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" asChild><Link href={route('blotter.edit', b.id)}><Pencil className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete?')) router.delete(route('blotter.destroy', b.id)); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination links={blotters.links} />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
