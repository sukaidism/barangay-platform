import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Pencil, Pin } from 'lucide-react';

interface Props {
    announcement: { id: number; title: string; body: string; category: string | null; is_pinned: boolean; published_at: string | null; created_at: string; author?: { name: string } };
}

export default function Show({ announcement }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Announcement</h2>}>
            <Head title={announcement.title} />
            <div className="max-w-3xl">
                <div className="flex gap-2 mb-4">
                    <Button variant="ghost" size="sm" asChild><Link href={route('announcement.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                    <Button variant="outline" size="sm" asChild><Link href={route('announcement.edit', announcement.id)}><Pencil className="mr-2 h-4 w-4" />Edit</Link></Button>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            {announcement.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                            <CardTitle>{announcement.title}</CardTitle>
                        </div>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                            {announcement.category && <Badge variant="secondary">{announcement.category}</Badge>}
                            <span>by {announcement.author?.name || 'Unknown'}</span>
                            <span>·</span>
                            <span>{announcement.published_at || 'Draft'}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap">{announcement.body}</div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
