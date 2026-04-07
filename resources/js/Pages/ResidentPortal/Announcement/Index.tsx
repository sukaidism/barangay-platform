import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import Pagination from '@/Components/Pagination';
import { Eye, Pin } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface Props {
    announcements: { data: Array<{ id: number; title: string; category: string | null; is_pinned: boolean; published_at: string | null }>; links: Array<{ url: string | null; label: string; active: boolean }>; total: number };
}

export default function Index({ announcements }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Announcements</h2>}>
            <Head title="Announcements" />
            <div className="space-y-4">
                {announcements.data.length === 0 ? (
                    <Card><CardContent className="py-8 text-center text-muted-foreground">No announcements posted yet.</CardContent></Card>
                ) : announcements.data.map(a => (
                    <Link key={a.id} href={route('resident-portal.announcements.show', a.id)}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center gap-2 py-4">
                                {a.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                                <CardTitle className="text-base flex-1">{a.title}</CardTitle>
                                <div className="flex items-center gap-2">
                                    {a.category && <Badge variant="secondary">{a.category}</Badge>}
                                    <span className="text-xs text-muted-foreground">{a.published_at}</span>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
                <Pagination links={announcements.links} />
            </div>
        </AuthenticatedLayout>
    );
}
