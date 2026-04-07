import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import Pagination from '@/Components/Pagination';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';

interface Household {
    id: number;
    household_number: string;
    address: string;
    purok: string | null;
    head?: { id: number; first_name: string; last_name: string } | null;
    members?: Array<{ id: number }>;
}

interface Props {
    households: {
        data: Household[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
}

export default function Index({ households }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Households</h2>}>
            <Head title="Households" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>All Households ({households.total})</CardTitle>
                    <Button asChild><Link href={route('household.create')}><Plus className="mr-2 h-4 w-4" />Add Household</Link></Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Household #</TableHead>
                                <TableHead>Head</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Purok</TableHead>
                                <TableHead>Members</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {households.data.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No households found.</TableCell></TableRow>
                            ) : households.data.map((h) => (
                                <TableRow key={h.id}>
                                    <TableCell className="font-medium">{h.household_number}</TableCell>
                                    <TableCell>{h.head ? `${h.head.first_name} ${h.head.last_name}` : '—'}</TableCell>
                                    <TableCell>{h.address}</TableCell>
                                    <TableCell>{h.purok || '—'}</TableCell>
                                    <TableCell>{h.members?.length || 0}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild><Link href={route('household.show', h.id)}><Eye className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" asChild><Link href={route('household.edit', h.id)}><Pencil className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete this household?')) router.delete(route('household.destroy', h.id)); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination links={households.links} />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
