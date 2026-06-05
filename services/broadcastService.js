import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { db } from "@/Lib/firebase";

const defaultBroadcastSettings = {
  overlayVisible: true,
  graphicsVisible: true,
  overlayTheme: "premium_gold",
  sponsorRotation: true,
  sponsorInterval: 8,
  sponsors: [],
  sponsorTiers: {
    gold: [
      {
        name: "Viva Sports",
        logo: "",
        link: "",
      },
    ],
    silver: [],
    partners: [],
  },
  activeSponsorCategory: "all",
  tickerVisible: true,
  tickerSections: {
    upcoming: true,
    topBatters: true,
    topBowlers: true,
    sponsors: true,
  },
  manualGraphic: null,
  liveGraphic: null,
  lowerThird: {
    visible: false,
    playerName: "",
    line1: "",
    line2: "",
  },
  matchGraphic: {
    visible: false,
    type: "toss",
  },
};

function normalizeSettings(data = {}) {
  const legacySponsors = data.sponsors || [];
  const sponsorTiers = data.sponsorTiers || {
    gold: legacySponsors,
    silver: [],
    partners: [],
  };

  return {
    ...defaultBroadcastSettings,
    ...data,
    sponsorTiers: {
      gold: sponsorTiers.gold || [],
      silver: sponsorTiers.silver || [],
      partners: sponsorTiers.partners || [],
    },
    tickerSections: {
      ...defaultBroadcastSettings.tickerSections,
      ...(data.tickerSections || {}),
    },
    lowerThird: {
      ...defaultBroadcastSettings.lowerThird,
      ...(data.lowerThird || {}),
    },
    matchGraphic: {
      ...defaultBroadcastSettings.matchGraphic,
      ...(data.matchGraphic || {}),
    },
  };
}

export function getSponsorsByCategory(settings, category = "all") {
  const tiers = settings?.sponsorTiers || defaultBroadcastSettings.sponsorTiers;
  const normalized = [
    ...(tiers.gold || []).map((sponsor) => ({ ...sponsor, category: "Gold Sponsor" })),
    ...(tiers.silver || []).map((sponsor) => ({ ...sponsor, category: "Silver Sponsor" })),
    ...(tiers.partners || []).map((sponsor) => ({ ...sponsor, category: "Partner Sponsor" })),
  ];

  if (category === "gold") return normalized.filter((item) => item.category === "Gold Sponsor");
  if (category === "silver") return normalized.filter((item) => item.category === "Silver Sponsor");
  if (category === "partners") return normalized.filter((item) => item.category === "Partner Sponsor");

  return normalized;
}

function broadcastRef() {
  return doc(db, "settings", "broadcast");
}

export async function getBroadcastSettings() {
  const snapshot = await getDoc(broadcastRef());

  if (!snapshot.exists()) {
    return defaultBroadcastSettings;
  }

  return normalizeSettings(snapshot.data());
}

export async function saveBroadcastSettings(data) {
  const current = await getBroadcastSettings();

  await setDoc(
    broadcastRef(),
    {
      ...current,
      ...data,
      updatedAt: Date.now(),
    }
  );
}

export function subscribeToBroadcastSettings(callback) {
  return onSnapshot(broadcastRef(), (snapshot) => {
    callback(normalizeSettings(snapshot.exists() ? snapshot.data() : {}));
  });
}
