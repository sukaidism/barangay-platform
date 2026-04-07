import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface Props { blotter: { id: number; complainant_id: number; respondent_id: number; incident_type: string; narrative: string; incident_date: string; incident_location: string | null; status: string; resolution: string | null }; residents: Array<{ id: number; first_name: string; last_name: string }>; }

export default function Edit({ blotter, residents }: Props) {
    const { data, setData, put, processing, errors } = useForm({ complainant_id: blotter.complainant_id.toString(), respondent_id: blotter.respondent_id.toString(), incident_type: blotter.incident_type, narrative: blotter.narrative, incident_date: blotter.incident_date, incident_location: blotter.incident_location || '', status: blotter.status, resolution: blotter.resolution || '' });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); put(route('blotter.update', blotter.id)); };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Edit Blotter</h2>}>
            <Head title="Edit Blotter" />
            <div className="max-w-2xl">
                <Button variant="ghost" size="sm" className="mb-4" asChild><Link href={route('blotter.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                <Card><CardHeader><CardTitle>Edit Blotter Record</CardTitle></CardHeader>
                    <CardContent><form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Complainant *</Label><Select value={data.complainant_id} onChange={e => setData('complainant_id', e.target.value)}><option value="">Select</option>{residents.map(r => <option key={r.id} value={r.id}>{r.first_name} {r.last_name}</option>)}</Select>{errors.complainant_id && <p className="text-sm text-destructive">{errors.complainant_id}</p>}</div>
                            <div className="space-y-2"><Label>Respondent *</Label><Select value={data.respondent_id} onChange={e => setData('respondent_id', e.target.value)}><option value="">Select</option>{residents.map(r => <option key={r.id} value={r.id}>{r.first_name} {r.last_name}</option>)}</Select>{errors.respondent_id && <p className="text-sm text-destructive">{errors.respondent_id}</p>}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Incident Type *</Label><Input value={data.incident_type} onChange={e => setData('incident_type', e.target.value)} /></div>
                            <div className="space-y-2"><Label>Incident Date *</Label><Input type="date" value={data.incident_date} onChange={e => setData('incident_date', e.target.value)} /></div>
                        </div>
                        <div className="space-y-2"><Label>Incident Location</Label><Input value={data.incident_location} onChange={e => setData('incident_location', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Narrative *</Label><Textarea value={data.narrative} onChange={e => setData('narrative', e.target.value)} rows={5} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Status *</Label><Select value={data.status} onChange={e => setData('status', e.target.value)}><option value="Filed">Filed</option><option value="Under Investigation">Under Investigation</option><option value="Resolved">Resolved</option><option value="Dismissed">Dismissed</option></Select></div>
                        </div>
                        <div className="space-y-2"><Label>Resolution</Label><Textarea value={data.resolution} onChange={e => setData('resolution', e.target.value)} rows={3} placeholder="Describe resolution if applicable" /></div>
                        <Button type="submit" disabled={processing}>Update Blotter</Button>
                    </form></CardContent></Card>
            </div>
        </AuthenticatedLayout>
    );
}
