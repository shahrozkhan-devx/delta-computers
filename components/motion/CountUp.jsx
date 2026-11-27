"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

function Counter({ value }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!visible || reduce) {
      if (reduce) setCount(value);
      return;
    }
    let frame;
    const start = performance.now();
    const duration = 900;
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, reduce, value]);
  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function CountUp({ value, label, suffix = "" }) {
  return <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .5 }} className="rounded-2xl border border-white/[.07] bg-white/[.025] px-5 py-5 text-center">
    <p className="font-display text-3xl font-semibold text-white"><Counter value={value} />{suffix}</p>
    <p className="mt-2 text-xs text-slate-400">{label}</p>
  </motion.div>;
}
