import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface Props { announcement: { id: number; title: string; body: string; category: string | null; is_pinned: boolean; published_at: string | null }; }

export default function Edit({ announcement }: Props) {
    const { data, setData, put, processing, errors } = useForm({ title: announcement.title, body: announcement.body, category: announcement.category || '', is_pinned: announcement.is_pinned, published_at: announcement.published_at || '' });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); put(route('announcement.update', announcement.id)); };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Edit Announcement</h2>}>
            <Head title="Edit Announcement" />
            <div className="max-w-2xl">
                <Button variant="ghost" size="sm" className="mb-4" asChild><Link href={route('announcement.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                <Card><CardHeader><CardTitle>Edit Announcement</CardTitle></CardHeader>
                    <CardContent><form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2"><Label>Title *</Label><Input value={data.title} onChange={e => setData('title', e.target.value)} />{errors.title && <p className="text-sm text-destructive">{errors.title}</p>}</div>
                        <div className="space-y-2"><Label>Body *</Label><Textarea value={data.body} onChange={e => setData('body', e.target.value)} rows={6} />{errors.body && <p className="text-sm text-destructive">{errors.body}</p>}</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Category</Label><Input value={data.category} onChange={e => setData('category', e.target.value)} /></div>
                            <div className="space-y-2"><Label>Publish Date</Label><Input type="datetime-local" value={data.published_at} onChange={e => setData('published_at', e.target.value)} /></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="is_pinned" checked={data.is_pinned} onChange={e => setData('is_pinned', e.target.checked)} className="h-4 w-4 rounded border-input" />
                            <Label htmlFor="is_pinned">Pin this announcement</Label>
                        </div>
                        <Button type="submit" disabled={processing}>Update Announcement</Button>
                    </form></CardContent></Card>
            </div>
        </AuthenticatedLayout>
    );
}
