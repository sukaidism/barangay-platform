import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import Pagination from '@/Components/Pagination';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';

interface Event {
    id: number;
    title: string;
    location: string | null;
    starts_at: string;
    ends_at: string;
    status: string;
}

interface Props {
    events: { data: Event[]; links: Array<{ url: string | null; label: string; active: boolean }>; total: number };
}

const statusVariant = (s: string) => {
    switch (s) {
        case 'Ongoing': return 'default';
        case 'Completed': return 'secondary';
        case 'Cancelled': return 'destructive';
        default: return 'secondary';
    }
};

export default function Index({ events }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Events</h2>}>
            <Head title="Events" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Community Events ({events.total})</CardTitle>
                    <Button asChild><Link href={route('event.create')}><Plus className="mr-2 h-4 w-4" />Create Event</Link></Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Location</TableHead><TableHead>Starts</TableHead><TableHead>Ends</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {events.data.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No events found.</TableCell></TableRow>
                            ) : events.data.map((ev) => (
                                <TableRow key={ev.id}>
                                    <TableCell className="font-medium">{ev.title}</TableCell>
                                    <TableCell>{ev.location || '—'}</TableCell>
                                    <TableCell className="text-sm">{ev.starts_at}</TableCell>
                                    <TableCell className="text-sm">{ev.ends_at}</TableCell>
                                    <TableCell><Badge variant={statusVariant(ev.status)}>{ev.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild><Link href={route('event.show', ev.id)}><Eye className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" asChild><Link href={route('event.edit', ev.id)}><Pencil className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete?')) router.delete(route('event.destroy', ev.id)); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination links={events.links} />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
