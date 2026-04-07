import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Pencil } from 'lucide-react';

interface Props { official: { id: number; position: string; committee: string | null; term_start: string; term_end: string; status: string; resident?: { first_name: string; last_name: string } }; }

export default function Show({ official }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Official Details</h2>}>
            <Head title="Official Details" />
            <div className="max-w-2xl">
                <div className="flex gap-2 mb-4">
                    <Button variant="ghost" size="sm" asChild><Link href={route('official.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                    <Button variant="outline" size="sm" asChild><Link href={route('official.edit', official.id)}><Pencil className="mr-2 h-4 w-4" />Edit</Link></Button>
                </div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between"><CardTitle>{official.resident ? `${official.resident.first_name} ${official.resident.last_name}` : 'Official'}</CardTitle><Badge variant={official.status === 'Active' ? 'default' : 'secondary'}>{official.status}</Badge></CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div><dt className="text-sm text-muted-foreground">Position</dt><dd className="text-sm font-medium">{official.position}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Committee</dt><dd className="text-sm font-medium">{official.committee || '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Term Start</dt><dd className="text-sm font-medium">{official.term_start}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Term End</dt><dd className="text-sm font-medium">{official.term_end}</dd></div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
