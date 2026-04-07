import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface Props {
    residents: Array<{ id: number; first_name: string; last_name: string }>;
    complainantName: string;
}

export default function Create({ residents, complainantName }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        respondent_id: '', incident_type: '', narrative: '',
        incident_date: '', incident_location: '',
    });

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); post(route('resident-portal.blotters.store')); };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">File Blotter Report</h2>}>
            <Head title="File Blotter Report" />
            <div className="max-w-2xl">
                <Button variant="ghost" size="sm" className="mb-4" asChild><Link href={route('resident-portal.blotters.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Blotter Report Form</CardTitle>
                        <CardDescription>You are filing this report as: <strong>{complainantName}</strong></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Complainant</Label>
                                <Input value={complainantName} disabled className="bg-muted" />
                                <p className="text-xs text-muted-foreground">Auto-filled from your profile</p>
                            </div>
                            <div className="space-y-2"><Label>Respondent *</Label><Select value={data.respondent_id} onChange={e => setData('respondent_id', e.target.value)}><option value="">Select Respondent</option>{residents.map(r => <option key={r.id} value={r.id}>{r.first_name} {r.last_name}</option>)}</Select>{errors.respondent_id && <p className="text-sm text-destructive">{errors.respondent_id}</p>}</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Incident Type *</Label><Input value={data.incident_type} onChange={e => setData('incident_type', e.target.value)} placeholder="e.g. Noise Complaint" />{errors.incident_type && <p className="text-sm text-destructive">{errors.incident_type}</p>}</div>
                                <div className="space-y-2"><Label>Incident Date *</Label><Input type="date" value={data.incident_date} onChange={e => setData('incident_date', e.target.value)} />{errors.incident_date && <p className="text-sm text-destructive">{errors.incident_date}</p>}</div>
                            </div>
                            <div className="space-y-2"><Label>Incident Location</Label><Input value={data.incident_location} onChange={e => setData('incident_location', e.target.value)} /></div>
                            <div className="space-y-2"><Label>Narrative *</Label><Textarea value={data.narrative} onChange={e => setData('narrative', e.target.value)} rows={5} placeholder="Describe what happened in detail" />{errors.narrative && <p className="text-sm text-destructive">{errors.narrative}</p>}</div>
                            <Button type="submit" disabled={processing}>File Report</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
