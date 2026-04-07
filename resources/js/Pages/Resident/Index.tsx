import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import Pagination from '@/Components/Pagination';
import { Plus, Eye, Pencil, Trash2, ClipboardCheck } from 'lucide-react';

interface Resident {
    id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    birthdate: string;
    gender: string;
    civil_status: string;
    contact_number: string | null;
    address: string;
    purok: string | null;
    status: string;
    household?: { id: number; household_number: string } | null;
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    active: 'default',
    draft: 'outline',
    pending_verification: 'secondary',
    rejected: 'destructive',
    inactive: 'secondary',
};

const statusLabel: Record<string, string> = {
    active: 'Active',
    draft: 'Draft',
    pending_verification: 'Pending',
    rejected: 'Rejected',
    inactive: 'Inactive',
};

interface Props {
    residents: {
        data: Resident[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    pendingCount?: number;
}

export default function Index({ residents, pendingCount = 0 }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this resident?')) {
            router.delete(route('resident.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Residents</h2>}>
            <Head title="Residents" />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>All Residents ({residents.total})</CardTitle>
                    <div className="flex gap-2">
                        {pendingCount > 0 && (
                            <Button variant="outline" asChild>
                                <Link href={route('residents-verification')}>
                                    <ClipboardCheck className="mr-2 h-4 w-4" />
                                    Verification
                                    <Badge variant="destructive" className="ml-2">{pendingCount}</Badge>
                                </Link>
                            </Button>
                        )}
                        <Button asChild>
                            <Link href={route('resident.create')}><Plus className="mr-2 h-4 w-4" />Add Resident</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Civil Status</TableHead>
                                <TableHead>Purok</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {residents.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">No residents found.</TableCell>
                                </TableRow>
                            ) : (
                                residents.data.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-medium">{r.first_name} {r.middle_name ? r.middle_name + ' ' : ''}{r.last_name}</TableCell>
                                        <TableCell>{r.gender}</TableCell>
                                        <TableCell>{r.civil_status}</TableCell>
                                        <TableCell>{r.purok || '—'}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[r.status] || 'secondary'}>
                                                {statusLabel[r.status] || r.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('resident.show', r.id)}><Eye className="h-4 w-4" /></Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('resident.edit', r.id)}><Pencil className="h-4 w-4" /></Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <Pagination links={residents.links} />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
