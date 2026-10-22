-- ==============================================================================
-- NSBE UNILORIN INITIAL SEED DATA
-- ==============================================================================
-- Run this script in the Supabase SQL Editor after running schema.sql.
-- Populates default academic resources, events, programs, and sponsors.
-- ==============================================================================

-- 1. Seed Academic Resources (Sample Past Questions & Lecture Materials)
insert into public.academic_resources (code, title, department, level, resource_type, session, year, format, file_size, file_url, available, status)
values
  ('CPE 311', 'Data Structures & Algorithms', 'computer', '300L', 'past-question', '2023/2024 session', 2024, 'PDF', '2.4 MB', '#', true, 'published'),
  ('CPE 307', 'Operating Systems', 'computer', '300L', 'past-question', '2022/2023 session', 2023, 'PDF', '1.8 MB', '#', true, 'published'),
  ('CPE 321', 'Computer Architecture II', 'computer', '300L', 'lecture-material', 'Lecture notes', 2024, 'PDF', '5.1 MB', '#', true, 'published'),
  ('CPE 305', 'Digital Logic Design', 'computer', '300L', 'past-question', '2021/2022 session', 2022, 'PDF', '3.0 MB', '#', false, 'published'),
  ('MEE 311', 'Fluid Mechanics I', 'mechanical', '300L', 'past-question', '2023/2024 session', 2024, 'PDF', '3.2 MB', '#', true, 'published'),
  ('MEE 321', 'Applied Thermodynamics', 'mechanical', '300L', 'past-question', '2023/2024 session', 2024, 'PDF', '2.1 MB', '#', true, 'published'),
  ('ELE 311', 'Electric Circuit Theory I', 'electrical-electronics', '300L', 'past-question', '2023/2024 session', 2024, 'PDF', '2.7 MB', '#', true, 'published'),
  ('CVE 311', 'Strength of Materials', 'civil', '300L', 'past-question', '2023/2024 session', 2024, 'PDF', '1.9 MB', '#', true, 'published'),
  ('CHE 311', 'Chemical Engineering Thermodynamics', 'chemical', '300L', 'past-question', '2023/2024 session', 2024, 'PDF', '2.5 MB', '#', true, 'published'),
  ('ENG 101', 'Engineering Mathematics I', 'computer', '100L', 'past-question', '2023/2024 session', 2024, 'PDF', '1.4 MB', '#', true, 'published'),
  ('ENG 201', 'Engineering Mathematics III', 'computer', '200L', 'past-question', '2023/2024 session', 2024, 'PDF', '2.0 MB', '#', true, 'published')
on conflict do nothing;

-- 2. Seed Chapter Events
insert into public.events (slug, title, date, start_time, venue, organizer, registration_url, image_url, status)
values
  ('engineering-career-night', 'Engineering Career Night', '2026-11-07', '5:00 PM', 'Faculty of Engineering Auditorium', 'NSBE Unilorin', '/events/engineering-career-night/register', '/images/events/next-event.jpg', 'published'),
  ('intro-to-arduino', 'Intro to Arduino & Embedded Systems', '2026-11-21', '10:00 AM', 'Computer Engineering Lab', 'Technical Committee', '/events/intro-to-arduino/register', null, 'published'),
  ('100l-maths-tutorial', '100L Tutorial: Engineering Mathematics', '2026-12-05', '3:00 PM', 'LT 2, Faculty of Engineering', 'Academic Committee', '/events/100l-maths-tutorial/register', null, 'published'),
  ('freshers-welcome', 'Freshers’ Welcome & Chapter Tour', '2026-10-03', '2:00 PM', 'Faculty of Engineering Quadrangle', 'NSBE Unilorin', null, null, 'published'),
  ('python-for-engineers', 'Python for Engineers Workshop', '2026-07-18', '10:00 AM', 'Computer Engineering Lab', 'Technical Committee', null, null, 'published')
on conflict (slug) do nothing;

-- 3. Seed Programs
insert into public.programs (title, description, category, tone, image_url, cta_label, cta_url, visible, order_index, status)
values
  ('Peer Tutorial Series', 'Weekly tutorials led by senior students to help 100L–300L students master core courses.', 'Academic', 'card', '/group-study.jpg', 'Join Tutorials', '/tutorial-interest', true, 1, 'published'),
  ('Industry Mentorship', 'Get paired with a practising engineer for guidance on internships, skills and career paths.', 'Career', 'brand', '/mentorship.jpg', 'Learn More', '/programs', true, 2, 'published'),
  ('Build Lab', 'Hands-on workshops where members design and build real engineering projects together.', 'Technical', 'dark', '/lab-nsbe.jpg', 'Explore Projects', '/academic-hub', true, 3, 'published')
on conflict do nothing;

-- 4. Seed Scholarships
insert into public.scholarships (name, funder, description, amount, deadline, eligibility, application_url)
values
  ('Engineering Merit Scholarship', 'Chapter alumni network', 'Supports high-performing Unilorin engineering students with tuition-related costs.', '₦150,000', '2026-12-15', '200L–400L engineering students', '/contact'),
  ('Need-Based Support Award', 'Chapter Sponsor', 'Helps students facing financial difficulty stay on track with their studies.', '₦100,000', '2026-09-30', 'All engineering levels', '/contact')
on conflict do nothing;

-- 5. Seed Corporate Sponsors / Partners
insert into public.sponsors (name, description, logo_url, order_index, confirmed, visible)
values
  ('Siemens', 'Global technology powerhouse in engineering and electrification.', '/partners/siemens.svg', 1, true, true),
  ('Bosch', 'Leading global supplier of technology and engineering services.', '/partners/bosch.svg', 2, true, true),
  ('Schneider Electric', 'Leader in the digital transformation of energy management and automation.', '/partners/schneider-electric.svg', 3, true, true),
  ('Intel', 'Innovator in semiconductor design and high-performance computing.', '/partners/intel.svg', 4, true, true)
on conflict do nothing;
