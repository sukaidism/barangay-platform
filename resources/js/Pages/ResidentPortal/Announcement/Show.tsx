import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Pin } from 'lucide-react';

interface Props {
    announcement: { id: number; title: string; body: string; category: string | null; is_pinned: boolean; published_at: string | null; author?: { name: string } };
}

export default function Show({ announcement }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Announcement</h2>}>
            <Head title={announcement.title} />
            <div className="max-w-3xl">
                <Button variant="ghost" size="sm" className="mb-4" asChild><Link href={route('resident-portal.announcements.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            {announcement.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                            <CardTitle>{announcement.title}</CardTitle>
                        </div>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                            {announcement.category && <Badge variant="secondary">{announcement.category}</Badge>}
                            <span>by {announcement.author?.name || 'Barangay'}</span>
                            <span>·</span>
                            <span>{announcement.published_at}</span>
                        </div>
                    </CardHeader>
                    <CardContent><div className="prose prose-sm max-w-none whitespace-pre-wrap">{announcement.body}</div></CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
