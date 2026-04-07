import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import Pagination from '@/Components/Pagination';
import { Plus, Eye } from 'lucide-react';

interface Props {
    blotters: { data: Array<{ id: number; incident_type: string; incident_date: string; status: string; complainant?: { first_name: string; last_name: string }; respondent?: { first_name: string; last_name: string } }>; links: Array<{ url: string | null; label: string; active: boolean }>; total: number };
    profileActive: boolean;
}

export default function Index({ blotters, profileActive }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">My Blotter Reports</h2>}>
            <Head title="My Blotter Reports" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>My Cases ({blotters.total})</CardTitle>
                    {profileActive && <Button asChild><Link href={route('resident-portal.blotters.create')}><Plus className="mr-2 h-4 w-4" />File Report</Link></Button>}
                </CardHeader>
                <CardContent>
                    {!profileActive && (
                        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 mb-4">
                            <p className="text-sm text-amber-800">Your profile must be verified before you can file blotter reports.</p>
                        </div>
                    )}
                    <Table>
                        <TableHeader><TableRow><TableHead>Complainant</TableHead><TableHead>Respondent</TableHead><TableHead>Incident</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {blotters.data.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No reports found.</TableCell></TableRow>
                            ) : blotters.data.map(b => (
                                <TableRow key={b.id}>
                                    <TableCell>{b.complainant ? `${b.complainant.first_name} ${b.complainant.last_name}` : '—'}</TableCell>
                                    <TableCell>{b.respondent ? `${b.respondent.first_name} ${b.respondent.last_name}` : '—'}</TableCell>
                                    <TableCell>{b.incident_type}</TableCell>
                                    <TableCell className="text-sm">{b.incident_date}</TableCell>
                                    <TableCell><Badge variant={b.status === 'Resolved' ? 'default' : 'secondary'}>{b.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild><Link href={route('resident-portal.blotters.show', b.id)}><Eye className="h-4 w-4" /></Link></Button>
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
