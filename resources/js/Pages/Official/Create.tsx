import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { ArrowLeft } from 'lucide-react';

interface Props { residents: Array<{ id: number; first_name: string; last_name: string }>; }

export default function Create({ residents }: Props) {
    const { data, setData, post, processing, errors } = useForm({ resident_id: '', position: '', committee: '', term_start: '', term_end: '', status: 'Active' });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); post(route('official.store')); };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Add Official</h2>}>
            <Head title="Add Official" />
            <div className="max-w-2xl">
                <Button variant="ghost" size="sm" className="mb-4" asChild><Link href={route('official.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                <Card><CardHeader><CardTitle>New Official</CardTitle></CardHeader>
                    <CardContent><form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2"><Label>Resident *</Label><Select value={data.resident_id} onChange={e => setData('resident_id', e.target.value)}><option value="">Select</option>{residents.map(r => <option key={r.id} value={r.id}>{r.first_name} {r.last_name}</option>)}</Select>{errors.resident_id && <p className="text-sm text-destructive">{errors.resident_id}</p>}</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Position *</Label><Input value={data.position} onChange={e => setData('position', e.target.value)} />{errors.position && <p className="text-sm text-destructive">{errors.position}</p>}</div>
                            <div className="space-y-2"><Label>Committee</Label><Input value={data.committee} onChange={e => setData('committee', e.target.value)} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Term Start *</Label><Input type="date" value={data.term_start} onChange={e => setData('term_start', e.target.value)} />{errors.term_start && <p className="text-sm text-destructive">{errors.term_start}</p>}</div>
                            <div className="space-y-2"><Label>Term End *</Label><Input type="date" value={data.term_end} onChange={e => setData('term_end', e.target.value)} />{errors.term_end && <p className="text-sm text-destructive">{errors.term_end}</p>}</div>
                        </div>
                        <div className="space-y-2"><Label>Status *</Label><Select value={data.status} onChange={e => setData('status', e.target.value)}><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Resigned">Resigned</option></Select></div>
                        <Button type="submit" disabled={processing}>Save Official</Button>
                    </form></CardContent></Card>
            </div>
        </AuthenticatedLayout>
    );
}
