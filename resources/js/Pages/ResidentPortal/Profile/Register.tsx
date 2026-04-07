import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';

interface Props {
    households: Array<{ id: number; household_number: string; address: string }>;
}

export default function Register({ households }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '', middle_name: '', last_name: '', suffix: '',
        birthdate: '', gender: '', civil_status: '',
        contact_number: '', address: '', purok: '', household_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('resident-portal.profile.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Register as Resident</h2>}>
            <Head title="Resident Registration" />
            <div className="max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Resident Registration Form</CardTitle>
                        <CardDescription>Fill out your personal information. Your profile will be reviewed and verified by barangay staff before you can access services.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>First Name *</Label><Input value={data.first_name} onChange={e => setData('first_name', e.target.value)} />{errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}</div>
                                <div className="space-y-2"><Label>Middle Name</Label><Input value={data.middle_name} onChange={e => setData('middle_name', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Last Name *</Label><Input value={data.last_name} onChange={e => setData('last_name', e.target.value)} />{errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}</div>
                                <div className="space-y-2"><Label>Suffix</Label><Input value={data.suffix} onChange={e => setData('suffix', e.target.value)} placeholder="Jr., Sr., III" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Birthdate *</Label><Input type="date" value={data.birthdate} onChange={e => setData('birthdate', e.target.value)} />{errors.birthdate && <p className="text-sm text-destructive">{errors.birthdate}</p>}</div>
                                <div className="space-y-2"><Label>Gender *</Label><Select value={data.gender} onChange={e => setData('gender', e.target.value)}><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></Select>{errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Civil Status *</Label><Select value={data.civil_status} onChange={e => setData('civil_status', e.target.value)}><option value="">Select</option><option value="Single">Single</option><option value="Married">Married</option><option value="Widowed">Widowed</option><option value="Separated">Separated</option><option value="Divorced">Divorced</option></Select>{errors.civil_status && <p className="text-sm text-destructive">{errors.civil_status}</p>}</div>
                                <div className="space-y-2"><Label>Contact Number</Label><Input value={data.contact_number} onChange={e => setData('contact_number', e.target.value)} /></div>
                            </div>
                            <div className="space-y-2"><Label>Address *</Label><Input value={data.address} onChange={e => setData('address', e.target.value)} />{errors.address && <p className="text-sm text-destructive">{errors.address}</p>}</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Purok</Label><Input value={data.purok} onChange={e => setData('purok', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Household</Label><Select value={data.household_id} onChange={e => setData('household_id', e.target.value)}><option value="">Select (optional)</option>{households.map(h => <option key={h.id} value={h.id}>{h.household_number} – {h.address}</option>)}</Select></div>
                            </div>
                            <Button type="submit" disabled={processing}>Submit Registration</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
