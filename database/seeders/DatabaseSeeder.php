<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Modules\Resident\Models\Resident;
use Modules\Household\Models\Household;
use Modules\Official\Models\Official;
use Modules\DocumentRequest\Models\DocumentRequest;
use Modules\Payment\Models\Payment;
use Modules\Announcement\Models\Announcement;
use Modules\Blotter\Models\Blotter;
use Modules\Event\Models\Event;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@barangay.local',
        ]);
        $admin->roles()->attach(1); // admin role

        // Create staff user
        $staff = User::factory()->create([
            'name' => 'Staff User',
            'email' => 'staff@barangay.local',
        ]);
        $staff->roles()->attach(2); // staff role

        // Create resident users
        $residentUser1 = User::factory()->create([
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
        ]);
        $residentUser1->roles()->attach(3);

        $residentUser2 = User::factory()->create([
            'name' => 'Maria Santos',
            'email' => 'maria@example.com',
        ]);
        $residentUser2->roles()->attach(3);

        $residentUser3 = User::factory()->create([
            'name' => 'Pedro Reyes',
            'email' => 'pedro@example.com',
        ]);
        $residentUser3->roles()->attach(3);

        // Households
        $household1 = Household::create([
            'household_number' => 'HH-2025-001',
            'address' => '123 Rizal St.',
            'purok' => 'Purok 1',
        ]);

        $household2 = Household::create([
            'household_number' => 'HH-2025-002',
            'address' => '456 Mabini St.',
            'purok' => 'Purok 2',
        ]);

        // Residents
        $r1 = Resident::create([
            'user_id' => $residentUser1->id,
            'first_name' => 'Juan',
            'middle_name' => 'Garcia',
            'last_name' => 'Dela Cruz',
            'birthdate' => '1985-03-15',
            'gender' => 'Male',
            'civil_status' => 'Married',
            'contact_number' => '09171234567',
            'address' => '123 Rizal St.',
            'purok' => 'Purok 1',
            'household_id' => $household1->id,
            'is_active' => true,
            'status' => 'active',
        ]);

        $r2 = Resident::create([
            'user_id' => $residentUser2->id,
            'first_name' => 'Maria',
            'middle_name' => 'Lopez',
            'last_name' => 'Santos',
            'birthdate' => '1990-07-22',
            'gender' => 'Female',
            'civil_status' => 'Married',
            'contact_number' => '09189876543',
            'address' => '123 Rizal St.',
            'purok' => 'Purok 1',
            'household_id' => $household1->id,
            'is_active' => true,
            'status' => 'active',
        ]);

        $r3 = Resident::create([
            'user_id' => $residentUser3->id,
            'first_name' => 'Pedro',
            'middle_name' => null,
            'last_name' => 'Reyes',
            'birthdate' => '1978-11-05',
            'gender' => 'Male',
            'civil_status' => 'Single',
            'contact_number' => '09201112233',
            'address' => '456 Mabini St.',
            'purok' => 'Purok 2',
            'household_id' => $household2->id,
            'is_active' => true,
            'status' => 'active',
        ]);

        // Set household heads
        $household1->update(['head_id' => $r1->id]);
        $household2->update(['head_id' => $r3->id]);

        // Officials
        Official::create([
            'resident_id' => $r1->id,
            'position' => 'Barangay Captain',
            'committee' => null,
            'term_start' => '2023-07-01',
            'term_end' => '2025-06-30',
            'status' => 'Active',
        ]);

        Official::create([
            'resident_id' => $r3->id,
            'position' => 'Kagawad',
            'committee' => 'Peace and Order',
            'term_start' => '2023-07-01',
            'term_end' => '2025-06-30',
            'status' => 'Active',
        ]);

        // Document Requests
        $dr1 = DocumentRequest::create([
            'resident_id' => $r2->id,
            'document_type' => 'Barangay Clearance',
            'purpose' => 'Employment requirement',
            'status' => 'Approved',
            'fee' => 50.00,
            'or_number' => 'OR-2025-0001',
        ]);

        DocumentRequest::create([
            'resident_id' => $r3->id,
            'document_type' => 'Certificate of Residency',
            'purpose' => 'School enrollment',
            'status' => 'Pending',
            'fee' => 30.00,
        ]);

        // Payments
        Payment::create([
            'resident_id' => $r2->id,
            'payable_type' => DocumentRequest::class,
            'payable_id' => $dr1->id,
            'amount' => 50.00,
            'or_number' => 'OR-2025-0001',
            'status' => 'Paid',
            'paid_at' => now(),
        ]);

        // Announcements
        Announcement::create([
            'user_id' => $admin->id,
            'title' => 'Community Clean-Up Drive',
            'body' => 'All residents are invited to join the community clean-up drive this Saturday starting 7:00 AM at the barangay hall. Please bring your own gloves and cleaning materials.',
            'category' => 'General',
            'is_pinned' => true,
            'published_at' => now(),
        ]);

        Announcement::create([
            'user_id' => $admin->id,
            'title' => 'Free Health Check-Up',
            'body' => 'The barangay health center will offer free medical check-ups for senior citizens on March 20, 2025. Please bring your barangay ID.',
            'category' => 'Health',
            'is_pinned' => false,
            'published_at' => now()->subDays(3),
        ]);

        // Blotters
        Blotter::create([
            'complainant_id' => $r2->id,
            'respondent_id' => $r3->id,
            'incident_type' => 'Noise Complaint',
            'narrative' => 'Respondent was playing loud music past midnight, disturbing the neighborhood.',
            'incident_date' => now()->subDays(5)->toDateString(),
            'incident_location' => 'Purok 2, near Mabini St.',
            'status' => 'Filed',
        ]);

        // Events
        Event::create([
            'title' => 'Barangay Fiesta 2025',
            'description' => 'Annual barangay fiesta celebration with cultural performances, food stalls, and community games.',
            'location' => 'Barangay Covered Court',
            'starts_at' => now()->addDays(14),
            'ends_at' => now()->addDays(15),
            'status' => 'Upcoming',
            'created_by' => $admin->id,
        ]);

        Event::create([
            'title' => 'Youth Sports Tournament',
            'description' => 'Basketball and volleyball tournament for ages 15-25.',
            'location' => 'Barangay Sports Complex',
            'starts_at' => now()->addDays(7),
            'ends_at' => now()->addDays(9),
            'status' => 'Upcoming',
            'created_by' => $staff->id,
        ]);
    }
}
