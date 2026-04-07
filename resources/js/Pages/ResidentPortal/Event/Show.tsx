import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';

interface Props {
    event: { id: number; title: string; description: string | null; location: string | null; starts_at: string; ends_at: string; status: string; creator?: { name: string } };
}

const statusVariant = (s: string) => { switch (s) { case 'Ongoing': return 'default' as const; case 'Cancelled': return 'destructive' as const; default: return 'secondary' as const; } };

export default function Show({ event }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Event Details</h2>}>
            <Head title={event.title} />
            <div className="max-w-2xl">
                <Button variant="ghost" size="sm" className="mb-4" asChild><Link href={route('resident-portal.events.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between"><CardTitle>{event.title}</CardTitle><Badge variant={statusVariant(event.status)}>{event.status}</Badge></CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div><dt className="text-sm text-muted-foreground">Location</dt><dd className="text-sm font-medium">{event.location || '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Organized By</dt><dd className="text-sm font-medium">{event.creator?.name || '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Starts At</dt><dd className="text-sm font-medium">{event.starts_at}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Ends At</dt><dd className="text-sm font-medium">{event.ends_at}</dd></div>
                            {event.description && <div className="col-span-2"><dt className="text-sm text-muted-foreground">Description</dt><dd className="text-sm font-medium whitespace-pre-wrap">{event.description}</dd></div>}
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
