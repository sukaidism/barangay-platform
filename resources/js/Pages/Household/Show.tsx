import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Pencil } from 'lucide-react';

interface Props {
    household: {
        id: number; household_number: string; address: string; purok: string | null;
        head?: { id: number; first_name: string; last_name: string } | null;
        members?: Array<{ id: number; first_name: string; last_name: string }>;
    };
}

export default function Show({ household }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Household Details</h2>}>
            <Head title={`Household ${household.household_number}`} />
            <div className="max-w-2xl">
                <div className="flex gap-2 mb-4">
                    <Button variant="ghost" size="sm" asChild><Link href={route('household.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                    <Button variant="outline" size="sm" asChild><Link href={route('household.edit', household.id)}><Pencil className="mr-2 h-4 w-4" />Edit</Link></Button>
                </div>
                <Card>
                    <CardHeader><CardTitle>Household {household.household_number}</CardTitle></CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div><dt className="text-sm text-muted-foreground">Address</dt><dd className="text-sm font-medium">{household.address}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Purok</dt><dd className="text-sm font-medium">{household.purok || '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Head</dt><dd className="text-sm font-medium">{household.head ? `${household.head.first_name} ${household.head.last_name}` : '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Members</dt><dd className="text-sm font-medium">{household.members?.length || 0}</dd></div>
                        </dl>
                        {household.members && household.members.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-sm font-medium mb-2">Members</h4>
                                <ul className="space-y-1">
                                    {household.members.map(m => (
                                        <li key={m.id} className="text-sm">{m.first_name} {m.last_name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
