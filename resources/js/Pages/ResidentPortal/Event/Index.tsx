import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import Pagination from '@/Components/Pagination';
import { CalendarDays, MapPin } from 'lucide-react';

interface Props {
    events: { data: Array<{ id: number; title: string; location: string | null; starts_at: string; ends_at: string; status: string }>; links: Array<{ url: string | null; label: string; active: boolean }>; total: number };
}

const statusVariant = (s: string) => { switch (s) { case 'Ongoing': return 'default' as const; case 'Cancelled': return 'destructive' as const; default: return 'secondary' as const; } };

export default function Index({ events }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Community Events</h2>}>
            <Head title="Events" />
            <div className="space-y-4">
                {events.data.length === 0 ? (
                    <Card><CardContent className="py-8 text-center text-muted-foreground">No events scheduled.</CardContent></Card>
                ) : events.data.map(ev => (
                    <Link key={ev.id} href={route('resident-portal.events.show', ev.id)}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <div>
                                    <CardTitle className="text-base">{ev.title}</CardTitle>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                        {ev.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</span>}
                                        <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{ev.starts_at} — {ev.ends_at}</span>
                                    </div>
                                </div>
                                <Badge variant={statusVariant(ev.status)}>{ev.status}</Badge>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
                <Pagination links={events.links} />
            </div>
        </AuthenticatedLayout>
    );
}
