"use client";
import React, { useMemo, useState } from "react";
import { CalendarDays, MapPin, Users, ShieldCheck, Globe2, Wallet, Clock3, MessageCircle, Share2, Lock, Sparkles, Info, ChevronDown, ChevronUp, Mail } from "lucide-react";
import { Badge } from "@/components/ui/group-badge";
import { brand } from "@/components/ui/utils";
import { Pill } from "@/components/ui/pill";
import { MemberPill } from "@/components/ui/member-pill";
import TravelInviteModal from "@/components/TravelInviteModal";

function Section({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold tracking-wide" style={{ color: brand.sub }}>
      {icon}
      <span>{title}</span>
    </div>
  );
}


function StatRow({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-[13px]" style={{ color: brand.sub }}>
        {left}
      </span>
      <span className="font-medium" style={{ color: brand.fg }}>
        {right}
      </span>
    </div>
  );
}

// --- Sample data & types ---
import type { Member, GroupInfo } from "@/components/schemas";

const SAMPLE: GroupInfo = {
  title: "Bangkok → Chiang Mai Lantern Trip",
  destination: "Chiang Mai, Thailand",
  dates: "12–16 Nov 2025 • 4 nights",
  timezone: "GMT+7",
  description:
    "We’re catching the Yi Peng lantern festival, cafe hopping, and a one‑day trek. Looking for easy‑going travelers who like food, photos, and night markets.",
  privacy: "Private",
  maxSize: 8,
  currentSize: 5,
  pace: "Balanced",
  languages: ["English", "ไทย"],
  interests: ["Food tour", "Temples", "Street photo", "Hiking", "Night market"],
  requirements: ["ID/passport required for flights", "Comfortable with shared rooms", "Respect local culture"],
  rules: ["No smoking in rooms", "Split bills with app", "Quiet hours 22:30–07:00"],
  itinerary: [
    { day: "Day 1", plan: "Fly BKK → CNX | Nimman dinner" },
    { day: "Day 2", plan: "Old City temples + cafe crawl" },
    { day: "Day 3", plan: "Doi Suthep + Hmong village" },
    { day: "Day 4", plan: "Yi Peng Lantern Festival" },
  ],
  hostNote: "We prioritize friendly vibes over strict schedules ✨",
  members: [
    { id: "u1", name: "Mild", role: "Host" },
    { id: "u2", name: "Ken", role: "Co‑host" },
    { id: "u3", name: "Bea", role: "Member" },
    { id: "u4", name: "Poom", role: "Member" },
    { id: "u5", name: "Nui", role: "Member" },
  ],
};

// --- Main component ---
export default function TravelGroupInformationUI({ group = SAMPLE }: { group?: GroupInfo }) {
  const [expanded, setExpanded] = useState(false);
  const [requested, setRequested] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const available = useMemo(() => Math.max(group.maxSize - group.currentSize, 0), [group]);

  return (
    <div className="min-h-screen w-full flex justify-center p-6 md:p-10" style={{ background: brand.bg }}>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Summary card */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl shadow-xl overflow-hidden" style={{ background: brand.card, border: `1px solid ${brand.border}` }}>
            {/* Header */}
            <div className="p-6 md:p-8 border-b" style={{ borderColor: brand.border }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="solid">TravelMatch</Badge>
                    {group.privacy === "Private" ? (
                      <Badge>
                        <Lock className="mr-1 h-3 w-3" /> Private Group
                      </Badge>
                    ) : (
                      <Badge>
                        <Globe2 className="mr-1 h-3 w-3" /> Public Group
                      </Badge>
                    )}
                  </div>
                  <h1 className="mt-3 text-2xl md:text-3xl font-bold" style={{ color: brand.fg }}>
                    {group.title}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm" style={{ color: brand.sub }}>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {group.destination}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {group.dates}</span>
                    {group.timezone && (
                      <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" /> {group.timezone}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div className="mt-5 flex flex-wrap gap-2">
                {group.interests.map((i) => (
                  <Pill key={i}>{i}</Pill>
                ))}
              </div>
            </div>

            {/* About & Itinerary */}
            <div className="p-6 md:p-8 grid gap-8">
              <div className="grid gap-3">
                <Section title="About this group" icon={<Info className="h-4 w-4" />} />
                <p className="leading-relaxed text-sm md:text-[15px]" style={{ color: brand.fg }}>
                  {group.description}
                </p>
                {group.hostNote && (
                  <div className="mt-2 inline-flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4" style={{ color: brand.accent }} />
                    <span style={{ color: brand.sub }}>{group.hostNote}</span>
                  </div>
                )}
              </div>


              {/* Itinerary */}
              <div className="grid gap-3">
                <Section title="Itinerary" icon={<CalendarDays className="h-4 w-4" />} />
                <div className="grid gap-2">
                  {group.itinerary.map((d) => (
                    <Pill key={d.day}>
                      <div className="flex w-full items-center justify-between">
                        <span className="font-medium" style={{ color: brand.fg }}>
                          {d.day}
                        </span>
                        <span className="text-xs" style={{ color: brand.sub }}>
                          {d.plan}
                        </span>
                      </div>
                    </Pill>
                  ))}
                </div>
              </div>

              {/* Requirements & Rules */}
              <div className="grid gap-3">
                <Section title="Requirements" icon={<ShieldCheck className="h-4 w-4" />} />
                <ul className="grid gap-2">
                  {group.requirements.map((r, i) => (
                    <li key={i} className="text-sm" style={{ color: brand.sub }}>• {r}</li>
                  ))}
                </ul>
              </div>


              <div className="grid gap-3">
                <Section title="House rules" icon={<ShieldCheck className="h-4 w-4" />} />
                <ul className="grid gap-2">
                  {group.rules.map((r, i) => (
                    <li key={i} className="text-sm" style={{ color: brand.sub }}>• {r}</li>
                  ))}
                </ul>
              </div>

              {/* Members */}
              <div className="flex flex-wrap gap-2">
                {group.members.map((m) => (
                  <MemberPill
                    key={m.id}
                    id={m.id}
                    name={m.name}
                    role={m.role}
                    onClick={(id) => console.log("Clicked member:", id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl shadow-xl" style={{ background: brand.card, border: `1px solid ${brand.border}` }}>
            <div className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" style={{ color: brand.accent }} />
                <h3 className="text-sm font-semibold" style={{ color: brand.sub }}>Group status</h3>
              </div>

              <div className="mt-3 grid gap-2">
                <StatRow left={<span>Members</span>} right={<span>{group.currentSize} / {group.maxSize}</span>} />
                <StatRow left={<span>Spots left</span>} right={<span>{available}</span>} />
                <StatRow left={<span>Pace</span>} right={<span>{group.pace}</span>} />
                <StatRow left={<span>Languages</span>} right={<span>{group.languages.join(", ")}</span>} />
              </div>

              <div className="mt-5 grid gap-3">
                <button
                  onClick={() => setRequested((v) => !v)}
                  className="w-full rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] bg-[#ff6600] hover:bg-[#e65a00] text-[#0b0b0c]"
                >
                  {requested ? "Request sent ✓" : "Request to join"}
                </button>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    className="rounded-xl px-4 py-2 text-sm font-semibold bg-[#171926] hover:bg-[#212124] hover:text-[#ff6600] transition text-[#e8eaee] border"
                    style={{ borderColor: brand.border }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <span className="inline-flex items-center gap-2 justify-center w-full"><Share2 className="h-4 w-4" /> Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible FAQ / Extra */}
          <div className="rounded-2xl shadow-xl" style={{ background: brand.card, border: `1px solid ${brand.border}` }}>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
              style={{ color: brand.fg }}
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: brand.sub }}>
                <Info className="h-4 w-4" />
                Safety & tips
              </span>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expanded && (
              <div className="px-6 pb-6 text-sm" style={{ color: brand.sub }}>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Keep emergency contacts available offline.</li>
                  <li>Share live location during late‑night commutes.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="rounded-2xl shadow-xl p-6" style={{ background: brand.card, border: `1px solid ${brand.border}` }}>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" style={{ color: brand.accent }} />
              <h3 className="text-sm font-semibold" style={{ color: brand.sub }}>Contact</h3>
            </div>
            <p className="mt-2 text-sm" style={{ color: brand.sub }}>Questions before joining? Ping the host and we’ll get back within a day.</p>
            <button
              onClick={() => console.log("Contact host")}
              className="mt-5 w-full rounded-full px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99] bg-[#ff6600] hover:bg-[#e65a00] text-[#0b0b0c] border"
              style={{ borderColor: brand.border }}
            >
              Host Contact
            </button>
          </div>
        </aside>
      </div>
      
      {/* Travel Invite Modal */}
      <TravelInviteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
