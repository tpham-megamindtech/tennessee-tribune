import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { getLatestByCategory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Nail & Beauty in America",
  description:
    "A general look at the U.S. nail and beauty industry — trends, what a visit typically costs, and how to pick a safe, reputable salon.",
};

const STATS = [
  {
    label: "Salons nationwide",
    value: "60,000+",
    detail: "Nail salons operating across the United States.",
  },
  {
    label: "Industry workforce",
    value: "400,000+",
    detail: "Licensed nail technicians and beauty professionals.",
  },
  {
    label: "Average manicure",
    value: "$25–$45",
    detail: "Typical price range for a standard manicure in most cities.",
  },
  {
    label: "Fastest-growing service",
    value: "Gel & dip powder",
    detail: "Long-wear color systems remain the top request among clients.",
  },
];

const TRENDS = [
  {
    title: "Clean & non-toxic formulas",
    body: "More salons are switching to '5-free' or '10-free' polishes and low-odor gel systems, responding to client demand for fewer harsh chemicals.",
  },
  {
    title: "Express services",
    body: "Quick 20–30 minute manicure and polish-change menus are spreading in busy metro areas, aimed at clients fitting beauty into a lunch break.",
  },
  {
    title: "At-home and mobile beauty",
    body: "Mobile nail techs and in-home spa visits have grown steadily, especially in suburban markets outside major cities.",
  },
  {
    title: "Wellness add-ons",
    body: "Paraffin treatments, hand massages, and aromatherapy are increasingly bundled into standard packages rather than sold as upgrades.",
  },
];

const SAFETY_TIPS = [
  "Check that the salon displays a current state cosmetology or nail technician license.",
  "Look for tools that are sterilized or single-use, and foot baths that are visibly cleaned between clients.",
  "Ask how often whirlpool pedicure basins are disinfected — daily deep cleaning is standard for reputable salons.",
  "Avoid shaving or cutting cuticles aggressively; a licensed technician should push them back gently instead.",
  "If you have a cut, infection, or open wound, reschedule — salons should decline service until it heals.",
  "Read recent local reviews before booking, especially for pedicures, where infection risk is highest.",
];

export default function NailBeautyUsaPage() {
  const tennesseeStories = getLatestByCategory("nail-beauty", 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="relative flex min-h-[320px] w-full flex-col justify-end overflow-hidden rounded-2xl shadow-lg sm:min-h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1600&h=900&q=80"
          alt="Manicure station at a U.S. nail salon"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
        <div className="relative z-10 flex flex-col gap-3 p-6 sm:p-10">
          <span className="w-fit rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Nail & Beauty
          </span>
          <h1 className="max-w-3xl font-serif text-2xl font-bold leading-tight text-white sm:text-4xl">
            Nail & Beauty in America: A General Overview
          </h1>
          <p className="max-w-2xl text-sm text-brand-100 sm:text-base">
            What the U.S. nail and beauty industry looks like today — common
            services, pricing, trends, and how to choose a salon you can
            trust.
          </p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-navy-900">
          The Industry at a Glance
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-brand-100 bg-white p-5 shadow-sm"
            >
              <p className="font-serif text-2xl font-bold text-brand-700">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-navy-900">
                {stat.label}
              </p>
              <p className="mt-1 text-sm text-navy-500">{stat.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-navy-400">
          Figures are general industry approximations and vary by region and
          salon.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-bold text-navy-900">
          Trends Shaping U.S. Salons
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {TRENDS.map((trend) => (
            <div
              key={trend.title}
              className="rounded-xl border border-brand-100 bg-white p-5 shadow-sm"
            >
              <h3 className="font-serif text-lg font-bold text-navy-900">
                {trend.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                {trend.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-brand-200 bg-brand-50 p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold text-navy-900">
          Choosing a Safe, Reputable Salon
        </h2>
        <ul className="mt-5 space-y-3">
          {SAFETY_TIPS.map((tip) => (
            <li key={tip} className="flex gap-3 text-sm text-navy-700">
              <span className="mt-0.5 text-brand-600">&#10003;</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {tennesseeStories.length > 0 && (
        <section className="mt-16 border-t border-brand-200 pt-10">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold text-navy-900">
              Nail & Beauty News from Tennessee
            </h2>
            <Link
              href="/category/nail-beauty"
              className="whitespace-nowrap text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {tennesseeStories.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
