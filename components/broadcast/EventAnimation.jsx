"use client";

import { AnimatePresence, motion } from "framer-motion";

const eventCopy = {
  FOUR: {
    kicker: "Boundary",
    title: "FOUR",
  },
  SIX: {
    kicker: "Maximum",
    title: "SIX",
  },
  WICKET: {
    kicker: "Breakthrough",
    title: "WICKET",
  },
  "HALF CENTURY": {
    kicker: "Milestone",
    title: "HALF CENTURY",
  },
  CENTURY: {
    kicker: "Milestone",
    title: "CENTURY",
  },
  "PLAYER OF THE MATCH": {
    kicker: "Award",
    title: "PLAYER OF THE MATCH",
  },
};

const shellVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 24,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -14,
    transition: {
      duration: 0.28,
      ease: "easeInOut",
    },
  },
};

const wicketVariants = {
  ...shellVariants,
  visible: {
    ...shellVariants.visible,
    x: [0, -5, 5, -3, 3, 0],
    transition: {
      ...shellVariants.visible.transition,
      x: {
        duration: 0.32,
        ease: "easeInOut",
      },
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.34,
      ease: "easeOut",
    },
  },
};

const overlayEventStyles = {
  FOUR: "border-[#3AAED8]/75 bg-[#3AAED8]/90 text-white shadow-[#06152F]/60",
  SIX: "border-emerald-200/75 bg-emerald-500/90 text-white shadow-emerald-950/60",
  WICKET: "border-red-200/80 bg-red-600/92 text-white shadow-red-950/70",
};

function normalizeType(type) {
  if (type === "FIFTY" || type === "50") return "HALF CENTURY";
  if (type === "HUNDRED" || type === "100") return "CENTURY";
  if (type === "PLAYER OF MATCH") return "PLAYER OF THE MATCH";

  return type || "";
}

export default function EventAnimation({ event, variant = "default" }) {
  const type = normalizeType(event?.type);
  const copy = eventCopy[type] || {
    kicker: "Match Event",
    title: event?.title || type,
  };
  const variants = type === "WICKET" ? wicketVariants : shellVariants;

  if (variant === "overlay") {
    const eventStyle = overlayEventStyles[type] || "border-[#D4AF37]/70 bg-[#06152F]/92 text-white shadow-black/55";

    return (
      <AnimatePresence>
        {event && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-[15vh] z-40 flex justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.section
              initial={{ y: 34, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -22, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className={`min-w-64 overflow-hidden rounded-xl border px-9 py-4 text-center shadow-2xl backdrop-blur-xl ${eventStyle}`}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.34em] text-white/80">
                {copy.kicker}
              </p>
              <h2 className="mt-1 text-5xl font-black uppercase tracking-wide text-white">
                {copy.title}
              </h2>
              {event.subtitle && (
                <p className="mt-1 text-sm font-black uppercase tracking-wide text-slate-200">
                  {event.subtitle}
                </p>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[#D8B45D]/70 bg-[#071224]/95 px-5 py-8 text-center shadow-2xl sm:px-10 md:px-14 md:py-12"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-[#D8B45D]" />
            <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D8B45D]/70 to-transparent" />

            <motion.p
              variants={itemVariants}
              className="text-xs font-black uppercase tracking-[0.36em] text-[#D8B45D] md:text-sm"
            >
              {copy.kicker}
            </motion.p>

            <motion.h2
              variants={itemVariants}
              className="mt-4 text-5xl font-black tracking-wide text-white sm:text-6xl md:text-8xl"
            >
              {copy.title}
            </motion.h2>

            {event.subtitle && (
              <motion.p
                variants={itemVariants}
                className="mx-auto mt-5 max-w-3xl text-xl font-semibold text-slate-200 sm:text-2xl md:text-4xl"
              >
                {event.subtitle}
              </motion.p>
            )}

            {event.detail && (
              <motion.p
                variants={itemVariants}
                className="mt-4 text-sm font-bold uppercase tracking-[0.22em] text-[#D8B45D] md:text-base"
              >
                {event.detail}
              </motion.p>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
