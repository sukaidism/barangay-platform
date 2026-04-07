import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface Props { event: { id: number; title: string; description: string | null; location: string | null; starts_at: string; ends_at: string; status: string }; }

export default function Edit({ event }: Props) {
    const { data, setData, put, processing, errors } = useForm({ title: event.title, description: event.description || '', location: event.location || '', starts_at: event.starts_at, ends_at: event.ends_at, status: event.status });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); put(route('event.update', event.id)); };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Edit Event</h2>}>
            <Head title="Edit Event" />
            <div className="max-w-2xl">
                <Button variant="ghost" size="sm" className="mb-4" asChild><Link href={route('event.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                <Card><CardHeader><CardTitle>Edit Event</CardTitle></CardHeader>
                    <CardContent><form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2"><Label>Title *</Label><Input value={data.title} onChange={e => setData('title', e.target.value)} />{errors.title && <p className="text-sm text-destructive">{errors.title}</p>}</div>
                        <div className="space-y-2"><Label>Description</Label><Textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={4} /></div>
                        <div className="space-y-2"><Label>Location</Label><Input value={data.location} onChange={e => setData('location', e.target.value)} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Starts At *</Label><Input type="datetime-local" value={data.starts_at} onChange={e => setData('starts_at', e.target.value)} /></div>
                            <div className="space-y-2"><Label>Ends At *</Label><Input type="datetime-local" value={data.ends_at} onChange={e => setData('ends_at', e.target.value)} /></div>
                        </div>
                        <div className="space-y-2"><Label>Status</Label><Select value={data.status} onChange={e => setData('status', e.target.value)}><option value="Upcoming">Upcoming</option><option value="Ongoing">Ongoing</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></Select></div>
                        <Button type="submit" disabled={processing}>Update Event</Button>
                    </form></CardContent></Card>
            </div>
        </AuthenticatedLayout>
    );
}
