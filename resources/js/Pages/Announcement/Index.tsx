import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import Pagination from '@/Components/Pagination';
import { Plus, Eye, Pencil, Trash2, Pin } from 'lucide-react';

interface Announcement {
    id: number;
    title: string;
    category: string | null;
    is_pinned: boolean;
    published_at: string | null;
    author?: { id: number; name: string };
}

interface Props {
    announcements: { data: Announcement[]; links: Array<{ url: string | null; label: string; active: boolean }>; total: number };
}

export default function Index({ announcements }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Announcements</h2>}>
            <Head title="Announcements" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Announcements ({announcements.total})</CardTitle>
                    <Button asChild><Link href={route('announcement.create')}><Plus className="mr-2 h-4 w-4" />New Announcement</Link></Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Author</TableHead><TableHead>Published</TableHead><TableHead>Pinned</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {announcements.data.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No announcements found.</TableCell></TableRow>
                            ) : announcements.data.map((a) => (
                                <TableRow key={a.id}>
                                    <TableCell className="font-medium">{a.title}</TableCell>
                                    <TableCell>{a.category || '—'}</TableCell>
                                    <TableCell>{a.author?.name || '—'}</TableCell>
                                    <TableCell className="text-sm">{a.published_at || 'Draft'}</TableCell>
                                    <TableCell>{a.is_pinned ? <Pin className="h-4 w-4 text-primary" /> : '—'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild><Link href={route('announcement.show', a.id)}><Eye className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" asChild><Link href={route('announcement.edit', a.id)}><Pencil className="h-4 w-4" /></Link></Button>
                                            <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete?')) router.delete(route('announcement.destroy', a.id)); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination links={announcements.links} />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
