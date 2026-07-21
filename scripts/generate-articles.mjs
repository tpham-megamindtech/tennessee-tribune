// One-off content generator for sample Markdown articles.
// Run: node scripts/generate-articles.mjs
import fs from "fs";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "content", "articles");
fs.mkdirSync(OUT_DIR, { recursive: true });

const FIRST_NAMES = [
  "Sarah", "James", "Maria", "Robert", "Ashley", "Michael", "Jennifer", "David",
  "Amanda", "Chris", "Emily", "Brian", "Megan", "Kevin", "Laura", "Daniel",
  "Nicole", "Andrew", "Rachel", "Tyler", "Brittany", "Jason", "Kayla", "Matthew",
];
const LAST_NAMES = [
  "Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
  "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson",
  "Garcia", "Robinson", "Clark", "Lewis", "Walker",
];

const ROLES = {
  "local-news": ["city spokesperson", "county commissioner", "deputy mayor", "public works director", "school board chair"],
  "nail-beauty": ["salon owner", "master nail technician", "beauty educator", "spa manager"],
  "finance-business": ["chief executive", "chamber of commerce director", "economic development officer", "small business owner"],
  "travel-tourism": ["tourism director", "park ranger", "attraction spokesperson", "tour guide"],
  "community": ["event organizer", "nonprofit director", "volunteer coordinator", "neighborhood association president"],
};

function pick(arr, seed) {
  return arr[seed % arr.length];
}

function personName(seed) {
  return `${pick(FIRST_NAMES, seed)} ${pick(LAST_NAMES, seed + 7)}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// index 0 = most recent. Spreads n2026 dates across Jan 1 - Jul 21 2026,
// and n2025 dates across Jun 1 - Dec 31 2025, descending (newest first).
function genDates(n2026, n2025) {
  const dates = [];
  for (let i = 0; i < n2026; i++) {
    const frac = n2026 > 1 ? i / (n2026 - 1) : 0;
    const dayOffset = Math.round(200 - frac * 200);
    const d = new Date(Date.UTC(2026, 0, 1));
    d.setUTCDate(d.getUTCDate() + dayOffset);
    dates.push(d.toISOString().slice(0, 10));
  }
  for (let i = 0; i < n2025; i++) {
    const frac = n2025 > 1 ? i / (n2025 - 1) : 0;
    const dayOffset = Math.round(213 - frac * 213);
    const d = new Date(Date.UTC(2025, 5, 1));
    d.setUTCDate(d.getUTCDate() + dayOffset);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

// 100 unique picsum.photos ids, deterministic (i*47+11 mod 1000, coprime step).
function pickImageId(i) {
  return (i * 47 + 11) % 1000;
}

const BODY_INTROS = {
  "local-news": (city) =>
    `${city} officials confirmed the update this week, saying it reflects months of planning and public input from residents across the area.`,
  "nail-beauty": (city) =>
    `The news comes as beauty businesses across ${city} report steady demand from both longtime regulars and a growing number of first-time clients.`,
  "finance-business": (city) =>
    `The announcement adds to a string of recent developments for the ${city} business community, which has seen steady growth over the past year.`,
  "travel-tourism": (city) =>
    `The update is expected to draw additional visitors to ${city} in the coming months, adding to what has already been a strong season for Tennessee tourism.`,
  "community": (city) =>
    `Organizers in ${city} say the event builds on years of grassroots effort to bring neighbors together and support local causes.`,
};

const BODY_DETAILS = {
  "local-news": (city, seed) =>
    `Planning documents reviewed by the Tennessee Tribune show the project is expected to cost roughly $${(2 + (seed % 8))}.${seed % 10} million, with work phased in over the next ${1 + (seed % 3)} to ${2 + (seed % 3)} years. Local leaders say the timeline could shift depending on funding and weather.`,
  "nail-beauty": (city, seed) =>
    `Staff say appointment requests have climbed roughly ${10 + (seed % 30)} percent since word first spread on social media. The business currently employs ${3 + (seed % 9)} licensed technicians and plans to add more positions if demand keeps pace.`,
  "finance-business": (city, seed) =>
    `Company leaders point to ${city}'s growing workforce and lower cost of doing business compared with larger metro markets. The move is expected to create or support roughly ${20 + (seed % 130)} jobs in the region over the next two years.`,
  "travel-tourism": (city, seed) =>
    `Visitor numbers in the area were already up an estimated ${5 + (seed % 20)} percent over last year, according to regional tourism data, and officials expect the trend to continue through the fall.`,
  "community": (city, seed) =>
    `Last year's turnout topped ${300 + seed * 37} attendees, and organizers say they are hoping to top that number this time with an expanded lineup of activities for families.`,
};

const BODY_CLOSERS = {
  "local-news": () =>
    `Residents can find updates and opportunities to comment through the city's official channels in the weeks ahead.`,
  "nail-beauty": () =>
    `Those interested can book online or by phone, and walk-ins are welcome as availability allows.`,
  "finance-business": () =>
    `Local economic development officials say they will continue tracking the impact on jobs and tax revenue in the months ahead.`,
  "travel-tourism": () =>
    `Travelers are encouraged to check ahead for hours and any seasonal changes before planning a visit.`,
  "community": () =>
    `Volunteers and sponsors interested in getting involved are encouraged to reach out to organizers ahead of the date.`,
};

function buildBody(category, city, title, seed) {
  const role = pick(ROLES[category], seed);
  const name = personName(seed);
  const intro = BODY_INTROS[category](city);
  const detail = BODY_DETAILS[category](city, seed);
  const closer = BODY_CLOSERS[category](city);

  const quotes = [
    `"This is something our community has been asking for, and we're glad to finally see it come together," said ${name}, ${role} in ${city}.`,
    `"We've put a lot of work into getting this right, and we think people are going to notice the difference," said ${name}, ${role} in ${city}.`,
    `"It's a big step forward for ${city}, and it wouldn't have happened without a lot of people pulling in the same direction," said ${name}, ${role}.`,
  ];
  const quote = pick(quotes, seed);

  const pullQuotes = [
    `"We're proud of what this means for ${city} and the people who live here."`,
    `"This is exactly the kind of progress our community deserves."`,
    `"It took teamwork, but we got there."`,
  ];
  const pullQuote = pick(pullQuotes, seed + 3);

  return `${intro}

${quote}

${detail}

> ${pullQuote} — ${name}

${closer}`;
}

const CITIES = [
  "Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville", "Murfreesboro",
  "Franklin", "Jackson", "Johnson City", "Kingsport", "Bristol", "Cookeville",
  "Gatlinburg", "Sevierville", "Columbia", "Cleveland", "Oak Ridge", "Maryville",
  "Smyrna", "Spring Hill",
];

const CATEGORY_DATA = {
  "local-news": {
    name: "Local News",
    split: [17, 3],
    items: [
      ["Metro Council Approves $2.9B Budget With Raises for Teachers, First Responders", "Nashville's Metro Council signed off on a new city budget that includes pay increases for teachers and first responders."],
      ["City Unveils $40M Plan to Repave 200 Miles of Residential Streets", "Memphis is rolling out a multi-year paving plan aimed at the city's most worn residential roads."],
      ["New South Knoxville Library Branch Opens After Two-Year Delay", "Knoxville's newest library branch finally opened its doors after construction setbacks pushed the project past schedule."],
      ["Walnut Street Bridge to Close Six Weeks for Structural Repairs", "Chattanooga's iconic pedestrian bridge will shut down temporarily for a round of structural repair work."],
      ["City Breaks Ground on New Fire Station for Growing West Side", "Clarksville officials broke ground on a new fire station meant to keep pace with rapid growth on the city's west side."],
      ["School Board Approves Plan for Third New Elementary School by 2028", "Rutherford County's school board signed off on plans for a third new elementary campus to handle enrollment growth."],
      ["Downtown Parking Garage Set to Open Ahead of Holiday Shopping Season", "Franklin's new downtown parking garage is on track to open in time for the busy holiday shopping stretch."],
      ["West Tennessee's Largest Solar Farm Connects to the Grid", "A large-scale solar farm outside Jackson has begun feeding power into the regional grid."],
      ["City Council Debates Short-Term Rental Restrictions Downtown", "Johnson City leaders are weighing new limits on short-term rentals in the downtown core."],
      ["New Greenway Extension Links Downtown to Bays Mountain Park", "Kingsport opened a new stretch of greenway connecting downtown to Bays Mountain Park."],
      ["State Line Sales Tax Dispute Heads to Mediation", "A long-running dispute over sales tax revenue along the Tennessee-Virginia line in Bristol is headed to mediation."],
      ["County Approves Funding for New 911 Dispatch Center", "Putnam County commissioners approved funding for a new consolidated 911 dispatch center in Cookeville."],
      ["City Updates Wildfire Evacuation Plan Five Years After 2016 Fire", "Gatlinburg has revised its wildfire evacuation procedures as part of ongoing safety reviews."],
      ["New Water Treatment Plant Aims to Keep Pace With Tourism Growth", "Sevierville is investing in a new water treatment facility to serve its growing tourism-driven population."],
      ["Historic Courthouse Square Reopens After $6M Renovation", "Columbia's historic courthouse square reopened to the public following a multi-million-dollar restoration."],
      ["Bradley County Schools Pilot Four-Day Week at Two Campuses", "Two schools in Cleveland are testing a four-day school week as part of a district pilot program."],
      ["Manhattan Project Park Visitor Center Set for Expansion", "Oak Ridge is expanding the visitor center at its Manhattan Project National Historical Park site."],
      ["Blount County Approves New Ambulance Service District", "Maryville-area leaders approved a new ambulance service district to improve emergency response times."],
      ["Town Council OKs Incentives for New Logistics Park", "Smyrna's town council approved incentives to attract a new logistics and distribution park."],
      ["Rapid Growth Prompts New Traffic Study for Main Street Corridor", "Spring Hill is commissioning a traffic study for its Main Street corridor as growth continues to surge."],
    ],
  },
  "nail-beauty": {
    name: "Nail & Beauty",
    split: [17, 3],
    items: [
      ["Magnolia Nails & Spa Debuts Music Row-Inspired Chrome Collection", "A Nashville salon has launched a new chrome polish collection inspired by Music Row."],
      ["Bluff City Beauty Bar Celebrates 10 Years With Free Manicure Day", "A Memphis beauty bar marked its tenth anniversary by offering free manicures to the community."],
      ["The Polished Peony Adds Bridal Beauty Suite Ahead of Wedding Season", "A Knoxville salon opened a dedicated bridal suite as wedding season ramps up."],
      ["Riverbend Beauty Bar Goes Cashless and Eco-Friendly", "A Chattanooga salon switched to reusable tools and cashless payments as part of a sustainability push."],
      ["Honeysuckle Beauty House Opens Second Location Near Fort Campbell", "A popular Clarksville salon is expanding with a second location near Fort Campbell."],
      ["Velvet Petal Nails Wins 'Best Local Salon' in Reader Poll", "A Murfreesboro nail salon took top honors in an annual local reader poll."],
      ["Blush & Bourbon Salon Launches Nashville-Hot-Chicken-Red Gel Shade", "A Franklin salon introduced a new signature red gel shade inspired by Nashville hot chicken."],
      ["Firefly Beauty Lounge Trains Three New Apprentices", "A Jackson beauty lounge is investing in its team through a new local apprenticeship program."],
      ["Whistlestop Nail Co. Hosts Mother-Daughter Mani-Pedi Fundraiser", "A Johnson City nail studio held a mother-daughter fundraiser event for a local charity."],
      ["Copper Kettle Beauty Bar Adds Men's Grooming Services", "A Kingsport beauty bar expanded its menu to include men's grooming services."],
      ["Rhinestone & Rouge Decorates for Speedway Race Weekend", "A Bristol salon themed its shop around race weekend at Bristol Motor Speedway."],
      ["Dogwood Blossom Spa Opens in Renovated 1920s Cottage", "A new spa opened in Cookeville inside a restored 1920s cottage."],
      ["Smoky Mountain Spa Co. Rolls Out Lavender-and-Honey Pedicure", "A Gatlinburg spa introduced a new seasonal lavender-and-honey pedicure treatment."],
      ["The Lacquer Room Adds Kids' Spa Party Package", "A Sevierville nail studio launched a new spa party package for children's birthdays."],
      ["Gilded Lily Nail Bar Sources Polish From Tennessee-Based Brand", "A Columbia nail bar switched to a locally made polish brand for its full collection."],
      ["Bluebird Nail Studio Hosts 'Paint It Forward' Charity Nail Day", "A Cleveland nail studio held a charity event donating proceeds to a local shelter."],
      ["Sundrop Nail Studio Wins Small-Business Grant for Expansion", "An Oak Ridge nail studio was awarded a grant to help fund its expansion."],
      ["Cumberland Beauty Collective Adds Organic Skincare Line", "A Maryville beauty collective introduced a new organic skincare product line."],
      ["Twang & Tonic Salon Debuts Country-Music Themed Nail Art Menu", "A Smyrna salon launched a new nail art menu inspired by country music icons."],
      ["Amber Lane Nail Lounge Opens With Walk-In Hours", "A new nail lounge opened in Spring Hill offering appointment-free walk-in hours."],
    ],
  },
  "finance-business": {
    name: "Finance & Business",
    split: [16, 4],
    items: [
      ["Cumberland Valley Bank Reports Record Small-Business Lending", "A Nashville-based bank reported record levels of small-business lending in the second quarter."],
      ["Bluff City Ventures Raises $12M Fund for Black-Owned Startups", "A Memphis investment firm closed a new fund dedicated to supporting Black-owned startups."],
      ["Volunteer Ridge Capital Opens New Office to Serve East Tennessee", "An investment firm is expanding into East Tennessee with a new Knoxville office."],
      ["Iron Horse Brewing Co. Expands Distribution to Three New States", "A Chattanooga brewery announced expanded distribution beyond Tennessee's borders."],
      ["Tennessee River Logistics Adds 150 Jobs at New Distribution Hub", "A logistics company is adding jobs at a new Clarksville distribution facility."],
      ["Nolensville Pike Motors Reports Strong Used-Car Demand", "A Murfreesboro dealership says used-vehicle demand has remained strong this year."],
      ["Franklin Pike Ventures Backs Three New Downtown Storefronts", "An investment group is funding new storefronts in downtown Franklin."],
      ["Sequoyah Textiles Reopens Historic Mill as Manufacturing Site", "A historic Jackson mill has reopened as an advanced manufacturing facility."],
      ["Highland Rim Insurance Group Adds 60 Remote Jobs", "An insurance company based in Johnson City is hiring for new remote positions."],
      ["Elk River Foods Expands Cold-Storage Facility", "A Kingsport food distributor is expanding its cold-storage capacity to meet demand."],
      ["Bristol Motor Parts Co. Sees Export Demand Climb", "A Bristol auto parts manufacturer reported rising demand from overseas markets."],
      ["Stone Fort Credit Union Surpasses $1 Billion in Assets", "A Cookeville-based credit union reached a new milestone in total assets."],
      ["Tourism Spending Sets Record for Sevier County Businesses", "Sevier County businesses reported record tourism-related spending this season."],
      ["Overlook Ridge Farms Scales Up Agritourism Operations", "A Sevierville-area farm is expanding its agritourism offerings to meet visitor demand."],
      ["Copperline Investments Funds Maury County Startup Incubator", "An investment firm is backing a new startup incubator in Columbia."],
      ["Harpeth Manufacturing Co. Announces $18M Plant Expansion", "A Cleveland manufacturer announced an $18 million expansion of its local plant."],
      ["Big South Fork Outfitters Diversifies Into Gear Manufacturing", "An Oak Ridge outdoor outfitter is branching into manufacturing its own gear line."],
      ["Deer Creek Timber Co. Invests in Sustainable Forestry Tech", "A Maryville-area timber company is adopting new sustainable forestry technology."],
      ["Southern Rail Freight Co. Adds New Intermodal Terminal", "A freight company is opening a new intermodal terminal near Smyrna."],
      ["Magnolia Grove Realty Reports Fastest Home Sales Pace in State", "A Spring Hill realty group says the area is seeing the fastest home sales pace in Tennessee."],
    ],
  },
  "travel-tourism": {
    name: "Travel & Tourism",
    split: [16, 4],
    items: [
      ["Broadway Honky-Tonks Extend Weekday Hours for Summer Crowds", "Nashville's Broadway honky-tonks are staying open later on weeknights to handle summer visitor traffic.", "Nashville"],
      ["Beale Street Braces for Record Turnout at Music Festival", "Memphis's Beale Street is preparing for what could be a record crowd at its annual music festival.", "Memphis"],
      ["World's Fair Park Adds New Splash Pad Ahead of Summer", "Knoxville's World's Fair Park unveiled a new splash pad for the summer season.", "Knoxville"],
      ["Lookout Mountain Incline Railway Completes Restoration", "Chattanooga's historic Lookout Mountain incline railway has reopened after a lengthy restoration.", "Chattanooga"],
      ["Great Smoky Mountains National Park Sees Early Wildflower Bloom", "An unusually warm spring brought an early wildflower bloom to the Great Smoky Mountains.", "Gatlinburg"],
      ["Dollywood Adds New Coaster for 2026 Season", "Pigeon Forge's Dollywood theme park debuted a new roller coaster for the current season.", "Pigeon Forge"],
      ["Jack Daniel's Distillery Expands Guided Tasting Tours", "The Jack Daniel's Distillery in Lynchburg has expanded its guided tasting tour offerings.", "Lynchburg"],
      ["Bristol Motor Speedway Gears Up for Night Race Weekend", "Bristol Motor Speedway is preparing for its marquee night race weekend.", "Bristol"],
      ["Ryman Auditorium Announces Expanded Fall Concert Lineup", "Nashville's Ryman Auditorium unveiled an expanded lineup of shows for the fall.", "Nashville"],
      ["Tennessee Aquarium Debuts New River Otter Exhibit", "Chattanooga's Tennessee Aquarium opened a new river otter exhibit.", "Chattanooga"],
      ["Graceland Unveils New Elvis Archive Exhibit", "Memphis's Graceland opened a new exhibit featuring rarely seen items from its archives.", "Memphis"],
      ["Fall Creek Falls Reopens Main Overlook Trail", "The main overlook trail at Fall Creek Falls State Park has reopened to hikers.", "Pikeville"],
      ["Cherokee National Forest Expands Backcountry Campsites", "Cherokee National Forest added new backcountry campsites for the season.", "Cleveland"],
      ["Norris Lake Marinas Report Strong Houseboat Bookings", "Marinas around Norris Lake say houseboat rental bookings are running well ahead of last year.", "Norris"],
      ["Cumberland Caverns Adds New Lantern Tour", "McMinnville's Cumberland Caverns introduced a new evening lantern tour.", "McMinnville"],
      ["Rock City's Fall Foliage Season Draws Early Visitors", "Chattanooga's Rock City is already seeing visitors planning ahead for fall foliage season.", "Chattanooga"],
      ["Reelfoot Lake Eagle-Watching Tours Extend Into Spring", "Eagle-watching boat tours at Reelfoot Lake have been extended further into the spring.", "Tiptonville"],
      ["Tennessee Whiskey Trail Adds Three New Distillery Stops", "The statewide Tennessee Whiskey Trail added three new distillery stops this year.", "Nashville"],
      ["Ijams Nature Center Opens New Treetop Canopy Walk", "Knoxville's Ijams Nature Center opened a new elevated canopy walk trail.", "Knoxville"],
      ["Grand Ole Opry Celebrates Milestone Anniversary Season", "Nashville's Grand Ole Opry is celebrating a milestone anniversary with a special season lineup.", "Nashville"],
    ],
  },
  community: {
    name: "Community",
    split: [17, 3],
    items: [
      ["East Nashville Hosts Neighborhood-Wide Porch Concert Series", "Neighbors in East Nashville are hosting a summer-long series of porch concerts."],
      ["Binghampton Food Pantry Marks One Millionth Meal Distributed", "A Memphis food pantry celebrated a major milestone in meals distributed to families in need."],
      ["Old City Block Party Raises Funds for Youth Arts Program", "Knoxville's Old City hosted a block party to benefit a local youth arts program."],
      ["North Chattanooga Riverside Cleanup Draws 300 Volunteers", "Volunteers turned out in force for a riverside cleanup event in North Chattanooga."],
      ["Downtown Clarksville Hosts Fort Campbell Homecoming Welcome", "Clarksville held a community welcome event for returning Fort Campbell soldiers."],
      ["Rutherford County Holds County-Wide School Supply Drive", "Community groups in Murfreesboro organized a county-wide school supply drive."],
      ["Franklin Fall Festival Returns to Main Street This October", "Franklin's beloved fall festival is set to return to Main Street this year."],
      ["Jackson Harvest Fair Adds Kids' Zone and 5K Run", "Jackson's annual harvest fair is expanding with a new kids' zone and 5K run."],
      ["Downtown Johnson City Hosts Blues and BBQ Block Party", "Johnson City held a blues and barbecue block party downtown."],
      ["Kingsport Fun Fest Announces Headline Lineup", "Organizers of Kingsport's Fun Fest revealed this year's headline entertainment lineup."],
      ["Bristol's Rhythm & Roots Reunion Celebrates 25th Year", "Bristol's long-running music festival is marking its 25th anniversary."],
      ["Cookeville Community Food Drive Tops 10,000 Pounds Collected", "A community food drive in Cookeville collected more than 10,000 pounds of donations."],
      ["Gatlinburg Holiday Lights Parade Returns With New Route", "Gatlinburg's annual holiday lights parade is returning with a newly designed route."],
      ["Sevierville Hosts Appreciation Day for Tourism Workers", "Sevierville organized a community appreciation event honoring local tourism workers."],
      ["Columbia's Mule Day Parade Draws Statewide Crowds", "Columbia's historic Mule Day parade drew visitors from across the state."],
      ["Cleveland-Bradley Community Garden Adds Ten New Plots", "A community garden in Cleveland expanded with ten new plots for local families."],
      ["Oak Ridge Hosts STEM Fair for Area Middle Schoolers", "Oak Ridge held a STEM fair showcasing student projects from area middle schools."],
      ["Maryville College and Town Host Joint Volunteer Day", "Maryville College partnered with the town for a joint community volunteer day."],
      ["Smyrna's Depot Days Festival Announces Vendor Lineup", "Smyrna revealed the vendor lineup for its upcoming Depot Days festival."],
      ["Spring Hill Hosts First Responders Appreciation Cookout", "Spring Hill held a cookout to honor local first responders."],
    ],
  },
};

const onlyCategory = process.argv[2];

let totalWritten = 0;
const usedSlugs = new Set();
let globalIndex = 0;

for (const [categorySlug, cat] of Object.entries(CATEGORY_DATA)) {
  const dates = genDates(cat.split[0], cat.split[1]);
  let written = 0;

  if (onlyCategory && categorySlug !== onlyCategory) {
    globalIndex += cat.items.length;
    continue;
  }

  cat.items.forEach(([title, excerpt, cityOverride], i) => {
    const city = cityOverride ?? CITIES[i % CITIES.length];
    const date = dates[i];
    const seed = globalIndex;

    let slug = slugify(`${city}-${title}`);
    if (usedSlugs.has(slug)) slug = `${slug}-${seed}`;
    usedSlugs.add(slug);

    const imageId = pickImageId(globalIndex);
    const coverImage = `https://picsum.photos/id/${imageId}/1200/800`;
    const body = buildBody(categorySlug, city, title, seed);
    const featured = categorySlug === "local-news" && i === 0;

    const frontmatter = [
      "---",
      `title: ${JSON.stringify(title)}`,
      `slug: ${JSON.stringify(slug)}`,
      `category: ${JSON.stringify(categorySlug)}`,
      `date: ${JSON.stringify(date)}`,
      `excerpt: ${JSON.stringify(excerpt)}`,
      `coverImage: ${JSON.stringify(coverImage)}`,
      `imageCredit: ""`,
      ...(featured ? [`featured: true`] : []),
      "---",
      "",
    ].join("\n");

    fs.writeFileSync(path.join(OUT_DIR, `${slug}.md`), frontmatter + body + "\n");
    written++;
    totalWritten++;
    globalIndex++;
  });

  console.log(`[${cat.name}] wrote ${written} articles (running total: ${totalWritten}/100)`);
}

console.log(`Done. ${totalWritten} articles written to content/articles/`);
