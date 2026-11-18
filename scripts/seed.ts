/**
 * Seeds demo data: 1 admin, 2 technicians, 2 customers, 16 services (14 approved,
 * across all 7 categories), bookings in every status and a paid payment.
 *
 *   npm run seed
 *
 * Users are created through BetterAuth itself (so passwords are hashed the right way).
 * The admin role is set directly in MongoDB because nobody can sign up as admin.
 * WARNING: it clears the services, bookings and payments collections and re-creates the demo users.
 */
import { config } from 'dotenv';
import { ObjectId } from 'mongodb';

config({ path: '.env.local' });
config({ path: '.env' });

const PASSWORDS = { admin: 'Admin123', tech: 'Tech1234', customer: 'Cust1234' };

const USERS = [
  { key: 'admin', name: 'FixMate Admin', email: 'admin@fixmate.test', password: PASSWORDS.admin, role: 'admin', phone: '01700000000', area: 'Mirpur, Dhaka', bio: 'Platform administrator.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { key: 't1', name: 'Rafiq Ahmed', email: 'rafiq@fixmate.test', password: PASSWORDS.tech, role: 'technician', phone: '01711111111', area: 'Dhanmondi, Dhaka', bio: '9 years fixing smartphones, laptops and TVs. Certified micro-soldering technician.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { key: 't2', name: 'Nusrat Jahan', email: 'nusrat@fixmate.test', password: PASSWORDS.tech, role: 'technician', phone: '01722222222', area: 'Uttara, Dhaka', bio: 'Appliance specialist: AC, refrigerators and washing machines. 7 years of field experience.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80' },
  { key: 'c1', name: 'Sadia Rahman', email: 'customer@fixmate.test', password: PASSWORDS.customer, role: 'customer', phone: '01733333333', area: 'Mirpur, Dhaka', bio: '', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80' },
  { key: 'c2', name: 'Tanvir Hasan', email: 'tanvir@fixmate.test', password: PASSWORDS.customer, role: 'customer', phone: '01744444444', area: 'Banani, Dhaka', bio: '', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
] as const;

const SERVICE_IMAGES: Record<string, string> = {
  'iPhone Screen Replacement': 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
  'Android Battery & Charging Port Fix': 'https://images.unsplash.com/photo-1588515724527-074a7a56616c?w=800&auto=format&fit=crop&q=80',
  'Laptop Servicing & Thermal Paste': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
  'Laptop Screen & Keyboard Replacement': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80',
  'LED TV Backlight Repair': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
  'Smart TV Mainboard Diagnosis': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
  'AC Servicing & Gas Refill': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
  'AC Installation & Relocation': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
  'Refrigerator Not Cooling Repair': 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
  'Fridge Compressor Replacement': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80',
  'Washing Machine Drum & Motor Repair': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80',
  'Washing Machine Drain & Leak Fix': 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&auto=format&fit=crop&q=80',
  'Home Wiring & Switchboard Repair': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80',
  'Ceiling Fan & Light Fitting': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80',
  'Gaming PC Build & Upgrade': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
  'Inverter AC Board Repair': 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80',
};

const GRADIENT: Record<string, [string, string, string]> = {
  Smartphone: ['#0f6a7e', '#148299', '📱'],
  'Laptop & PC': ['#1e3a8a', '#4f46e5', '💻'],
  AC: ['#0369a1', '#38bdf8', '❄️'],
  Refrigerator: ['#0f766e', '#2dd4bf', '🧊'],
  TV: ['#7c2d12', '#f26b21', '📺'],
  'Washing Machine': ['#4c1d95', '#a78bfa', '🧺'],
  Electrical: ['#92400e', '#fbbf24', '⚡'],
};

/** Self-contained banner image (data URI) so the demo works with no external image hosting. */
function banner(category: string, label: string) {
  const [a, b, emoji] = GRADIENT[category];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" stroke-opacity=".12"/></pattern></defs><rect width="800" height="450" fill="url(#g)"/><rect width="800" height="450" fill="url(#p)"/><text x="400" y="235" font-size="150" text-anchor="middle">${emoji}</text><text x="400" y="360" font-size="34" font-family="Arial,sans-serif" font-weight="700" fill="#fff" text-anchor="middle">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

type Svc = [tech: 't1' | 't2', title: string, category: string, price: number, duration: string, mode: string, area: string, desc: string, approval?: string, available?: boolean];

const SERVICES: Svc[] = [
  ['t1', 'iPhone Screen Replacement', 'Smartphone', 45, '2-3 hours', 'Shop Drop-off', 'Dhanmondi, Dhaka', 'Genuine-quality display replacement for iPhone 11 to 14 with a 90 day warranty. Includes touch and Face ID checks after the repair.'],
  ['t1', 'Android Battery & Charging Port Fix', 'Smartphone', 22, '1-2 hours', 'Shop Drop-off', 'Dhanmondi, Dhaka', 'Battery replacement and charging port cleaning or replacement for Samsung, Xiaomi and Oppo phones. Same-day service for most models.'],
  ['t1', 'Laptop Servicing & Thermal Paste', 'Laptop & PC', 30, '3-4 hours', 'Home Visit', 'Dhanmondi, Mohammadpur', 'Full internal cleaning, fan service and thermal paste replacement to stop overheating and noisy fans. Includes a free health check.'],
  ['t1', 'Laptop Screen & Keyboard Replacement', 'Laptop & PC', 60, '1 day', 'Shop Drop-off', 'Dhanmondi, Dhaka', 'Replacement of cracked laptop screens and faulty keyboards for most major brands. Parts are tested before and after installation.'],
  ['t1', 'LED TV Backlight Repair', 'TV', 55, '1 day', 'Shop Drop-off', 'Dhanmondi, Dhaka', 'Fix dim or dark LED and LCD TV screens by replacing backlight strips. We test the panel and power board before returning the TV.'],
  ['t1', 'Smart TV Mainboard Diagnosis', 'TV', 18, '1-2 hours', 'Home Visit', 'Dhanmondi, Dhaka', 'On-site diagnosis for TVs that will not start, restart in a loop or show no picture. Repair quote is given before any work begins.'],
  ['t2', 'AC Servicing & Gas Refill', 'AC', 40, '2-3 hours', 'Home Visit', 'Uttara, Dhaka', 'Complete split-AC wash, filter cleaning and gas top-up with pressure testing. Keeps cooling strong and cuts your electricity bill.'],
  ['t2', 'AC Installation & Relocation', 'AC', 65, '4-5 hours', 'Home Visit', 'Uttara, Gulshan', 'Professional installation or relocation of split ACs, including piping, bracket mounting and a full cooling test on completion.'],
  ['t2', 'Refrigerator Not Cooling Repair', 'Refrigerator', 35, '2-3 hours', 'Home Visit', 'Uttara, Dhaka', 'Diagnosis and repair of fridges that do not cool: thermostat, defrost system, fan motor and gas leak checks included.'],
  ['t2', 'Fridge Compressor Replacement', 'Refrigerator', 110, '1 day', 'Home Visit', 'Uttara, Banani', 'Compressor replacement for single and double-door refrigerators, with new gas charge and a 6 month warranty on the compressor.'],
  ['t2', 'Washing Machine Drum & Motor Repair', 'Washing Machine', 38, '2-3 hours', 'Home Visit', 'Uttara, Dhaka', 'Repairs for noisy drums, worn bearings and motors in front-load and top-load machines. Spare parts available on the day.'],
  ['t2', 'Washing Machine Drain & Leak Fix', 'Washing Machine', 20, '1-2 hours', 'Home Visit', 'Uttara, Dhaka', 'Fix blocked drains, leaking hoses and water-inlet faults. Includes cleaning of the filter and a test wash cycle.'],
  ['t1', 'Home Wiring & Switchboard Repair', 'Electrical', 25, '2 hours', 'Home Visit', 'Dhanmondi, Dhaka', 'Safe repair of faulty switches, sockets and distribution boards, with circuit testing so you can trust every outlet.'],
  ['t2', 'Ceiling Fan & Light Fitting', 'Electrical', 15, '1 hour', 'Home Visit', 'Uttara, Dhaka', 'Fan and light installation or replacement including regulators and wiring checks. Neat finish, no mess left behind.'],
  ['t1', 'Gaming PC Build & Upgrade', 'Laptop & PC', 50, '1 day', 'Shop Drop-off', 'Dhanmondi, Dhaka', 'Custom desktop assembly and component upgrades (RAM, SSD, GPU) with cable management and stress testing.', 'pending'],
  ['t2', 'Inverter AC Board Repair', 'AC', 90, '2 days', 'Shop Drop-off', 'Uttara, Dhaka', 'Board-level repair for inverter AC outdoor units. Currently under review.', 'rejected'],
];

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);
const daysAhead = (n: number) => new Date(Date.now() + n * 86400000);

async function main() {
  const { auth } = await import('../lib/auth');
  const { db, mongoClient } = await import('../lib/mongo');
  await mongoClient.connect();

  console.log('→ Removing previous demo data…');
  const emails = USERS.map((u) => u.email);
  const old = await db.collection('user').find({ email: { $in: emails } }).toArray();
  const ids = old.flatMap((u) => [u._id, String(u._id)]);
  if (ids.length) {
    await db.collection('account').deleteMany({ userId: { $in: ids } });
    await db.collection('session').deleteMany({ userId: { $in: ids } });
    await db.collection('user').deleteMany({ email: { $in: emails } });
  }
  await Promise.all(['services', 'bookings', 'payments'].map((c) => db.collection(c).deleteMany({})));
  // unique indexes mirror the server's (so the seed is safe to run before the server ever starts)
  await db.collection('payments').createIndex({ stripeSessionId: 1 }, { unique: true });
  await db.collection('payments').createIndex({ bookingId: 1 }, { unique: true });

  console.log('→ Creating users through BetterAuth…');
  for (const u of USERS) {
    // role is forced to customer/technician by the databaseHooks; admin is promoted below
    await auth.api.signUpEmail({
      body: { name: u.name, email: u.email, password: u.password, role: u.role === 'technician' ? 'technician' : 'customer' } as never,
    });
    await db.collection('user').updateOne(
      { email: u.email },
      { $set: { role: u.role, phone: u.phone, area: u.area, bio: u.bio, image: u.image, createdAt: daysAgo(30) } }
    );
  }
  const byKey = Object.fromEntries(USERS.map((u) => [u.key, u]));

  console.log('→ Creating services…');
  const svcDocs = SERVICES.map(([t, title, category, basePrice, estimatedDuration, serviceMode, serviceArea, description, approval = 'approved', available = true], i) => ({
    _id: new ObjectId(),
    title,
    category,
    description,
    image: SERVICE_IMAGES[title] || banner(category, title),
    basePrice,
    estimatedDuration,
    serviceMode,
    serviceArea,
    technicianName: byKey[t].name,
    technicianEmail: byKey[t].email,
    approvalStatus: approval,
    isAvailable: available,
    createdAt: daysAgo(SERVICES.length - i),
  }));
  await db.collection('services').insertMany(svcDocs);
  const svc = (title: string) => svcDocs.find((s) => s.title === title)!;

  console.log('→ Creating bookings & payments…');
  type B = [customer: 'c1' | 'c2', service: string, status: string, payment: 'paid' | 'unpaid', final: number | null, createdDaysAgo: number, dateOffset: number, problem: string];
  const BOOKINGS: B[] = [
    ['c1', 'iPhone Screen Replacement', 'requested', 'unpaid', null, 1, 3, 'The screen cracked after a fall and the touch is not responding in the bottom corner.'],
    ['c1', 'AC Servicing & Gas Refill', 'accepted', 'unpaid', null, 3, 2, 'Split AC is not cooling properly and makes a rattling noise from the indoor unit.'],
    ['c1', 'Laptop Servicing & Thermal Paste', 'in-progress', 'unpaid', null, 5, 0, 'Laptop shuts down while gaming and the fan is extremely loud even when idle.'],
    ['c1', 'Refrigerator Not Cooling Repair', 'completed', 'unpaid', 38, 9, -2, 'The fridge section is warm but the freezer works. Compressor runs constantly all day.'],
    ['c1', 'Washing Machine Drain & Leak Fix', 'completed', 'paid', 20, 14, -8, 'Water leaks from the bottom during the spin cycle and the drain is very slow.'],
    ['c1', 'Android Battery & Charging Port Fix', 'rejected', 'unpaid', null, 11, -5, 'Phone does not charge unless the cable is held at an angle, battery drains very fast.'],
    ['c2', 'LED TV Backlight Repair', 'requested', 'unpaid', null, 2, 4, 'TV turns on with sound but the picture is almost completely dark, only faintly visible.'],
    ['c2', 'Home Wiring & Switchboard Repair', 'completed', 'paid', 28, 12, -6, 'Main switchboard sparks when a heavy appliance is switched on in the kitchen area.'],
    ['c2', 'Ceiling Fan & Light Fitting', 'cancelled', 'unpaid', null, 7, -3, 'Need two ceiling fans fitted in the new bedroom, wiring is already in the ceiling.'],
    ['c2', 'AC Installation & Relocation', 'in-progress', 'unpaid', null, 4, 1, 'Moving house and need a 1.5 ton split AC dismounted and installed in the new flat.'],
  ];

  const bookingDocs: Record<string, unknown>[] = [];
  const paymentDocs: Record<string, unknown>[] = [];
  const flow = ['requested', 'accepted', 'in-progress', 'completed'];

  BOOKINGS.forEach(([c, title, status, payment, final, created, offset, problem], i) => {
    const s = svc(title);
    const cust = byKey[c];
    const _id = new ObjectId();
    const createdAt = daysAgo(created);
    const history: { status: string; changedAt: Date }[] = [{ status: 'requested', changedAt: createdAt }];
    if (flow.includes(status)) {
      for (let k = 1; k <= flow.indexOf(status); k++) history.push({ status: flow[k], changedAt: new Date(createdAt.getTime() + k * 8 * 3600000) });
    } else if (status !== 'requested') {
      history.push({ status, changedAt: new Date(createdAt.getTime() + 6 * 3600000) });
    }
    if (payment === 'paid') history.push({ status: 'paid', changedAt: new Date(createdAt.getTime() + 40 * 3600000) });

    bookingDocs.push({
      _id,
      serviceId: String(s._id),
      serviceTitle: s.title,
      serviceImage: s.image,
      category: s.category,
      basePrice: s.basePrice,
      technicianName: s.technicianName,
      technicianEmail: s.technicianEmail,
      customerName: cust.name,
      customerEmail: cust.email,
      customerPhone: cust.phone,
      address: c === 'c1' ? 'House 12, Road 5, Mirpur 10, Dhaka' : 'Flat 4B, Road 11, Banani, Dhaka',
      preferredDate: offset >= 0 ? daysAhead(offset) : daysAgo(-offset),
      problemDescription: problem,
      status,
      finalAmount: final ?? s.basePrice,
      paymentStatus: payment,
      statusHistory: history,
      createdAt,
    });

    if (payment === 'paid') {
      paymentDocs.push({
        bookingId: String(_id),
        serviceTitle: s.title,
        customerName: cust.name,
        customerEmail: cust.email,
        technicianName: s.technicianName,
        technicianEmail: s.technicianEmail,
        amount: final,
        currency: 'usd',
        transactionId: `pi_seed_${String(i).padStart(2, '0')}${String(_id).slice(-10)}`,
        stripeSessionId: `cs_test_seed_${String(_id)}`,
        paymentStatus: 'paid',
        paidAt: history[history.length - 1].changedAt,
      });
    }
  });
  await db.collection('bookings').insertMany(bookingDocs);
  await db.collection('payments').insertMany(paymentDocs);

  console.log('\n✔ Seed complete\n');
  console.log('  Admin       admin@fixmate.test     /', PASSWORDS.admin);
  console.log('  Technician  rafiq@fixmate.test     /', PASSWORDS.tech);
  console.log('  Technician  nusrat@fixmate.test    /', PASSWORDS.tech);
  console.log('  Customer    customer@fixmate.test  /', PASSWORDS.customer);
  console.log('  Customer    tanvir@fixmate.test    /', PASSWORDS.customer);
  await mongoClient.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
