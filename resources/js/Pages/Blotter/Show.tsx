import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Pencil } from 'lucide-react';

interface Props {
    blotter: { id: number; incident_type: string; narrative: string; incident_date: string; incident_location: string | null; status: string; resolution: string | null; created_at: string; complainant?: { first_name: string; last_name: string }; respondent?: { first_name: string; last_name: string } };
}

export default function Show({ blotter }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Blotter Details</h2>}>
            <Head title="Blotter Details" />
            <div className="max-w-2xl">
                <div className="flex gap-2 mb-4">
                    <Button variant="ghost" size="sm" asChild><Link href={route('blotter.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                    <Button variant="outline" size="sm" asChild><Link href={route('blotter.edit', blotter.id)}><Pencil className="mr-2 h-4 w-4" />Edit</Link></Button>
                </div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between"><CardTitle>{blotter.incident_type}</CardTitle><Badge variant={blotter.status === 'Resolved' ? 'default' : 'secondary'}>{blotter.status}</Badge></CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div><dt className="text-sm text-muted-foreground">Complainant</dt><dd className="text-sm font-medium">{blotter.complainant ? `${blotter.complainant.first_name} ${blotter.complainant.last_name}` : '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Respondent</dt><dd className="text-sm font-medium">{blotter.respondent ? `${blotter.respondent.first_name} ${blotter.respondent.last_name}` : '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Incident Date</dt><dd className="text-sm font-medium">{blotter.incident_date}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Location</dt><dd className="text-sm font-medium">{blotter.incident_location || '—'}</dd></div>
                            <div className="col-span-2"><dt className="text-sm text-muted-foreground">Narrative</dt><dd className="text-sm font-medium whitespace-pre-wrap">{blotter.narrative}</dd></div>
                            {blotter.resolution && <div className="col-span-2"><dt className="text-sm text-muted-foreground">Resolution</dt><dd className="text-sm font-medium whitespace-pre-wrap">{blotter.resolution}</dd></div>}
                            <div><dt className="text-sm text-muted-foreground">Filed</dt><dd className="text-sm font-medium">{blotter.created_at}</dd></div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
