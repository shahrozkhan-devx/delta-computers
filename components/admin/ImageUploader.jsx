"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveProductImages } from "@/lib/admin-actions";

export default function ImageUploader({ productId, initialImages = [], onPrimaryChange }) {
  const [images, setImages] = useState(initialImages);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    if (!productId) {
      setError("Save the product first, then add images.");
      return;
    }
    if (files.some((file) => !file.type.startsWith("image/") || file.size > 8 * 1024 * 1024)) {
      setError("Choose image files smaller than 8 MB each.");
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase is not configured. Add its public URL and anonymous key first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const urls = [];
      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const path = `products/${productId}/${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, { upsert: false, contentType: file.type });
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      const next = [...images, ...urls];
      await saveProductImages(productId, next);
      setImages(next);
      onPrimaryChange?.(next[0] || "");
    } catch (uploadError) {
      setError(uploadError.message || "Image upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function changeOrder(index, direction) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;
    const next = [...images];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    try {
      await saveProductImages(productId, next);
      setImages(next);
      onPrimaryChange?.(next[0] || "");
    } catch (orderError) {
      setError(orderError.message || "Could not reorder images.");
    }
  }

  async function remove(index) {
    const next = images.filter((_, position) => position !== index);
    try {
      await saveProductImages(productId, next);
      setImages(next);
      onPrimaryChange?.(next[0] || "");
    } catch (removeError) {
      setError(removeError.message || "Could not remove image.");
    }
  }

  return (
    <div className="mt-3">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[.02] px-4 py-6 text-sm text-slate-300 transition hover:border-cyan/40 hover:text-cyan">{busy ? <LoaderCircle size={17} className="animate-spin" /> : <ImagePlus size={17} />}{busy ? "Uploading images…" : "Choose images (up to 8 MB each)"}<input type="file" accept="image/*" multiple disabled={busy} onChange={upload} className="sr-only" /></label>
      {error && <p role="alert" className="mt-2 text-xs text-rose-300">{error}</p>}
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{images.map((url, index) => <div key={url} className="relative overflow-hidden rounded-xl border border-white/10"><div className="relative aspect-square"><Image src={url} alt={`Product image ${index + 1}`} fill sizes="160px" className="object-cover" /></div><div className="flex items-center justify-between bg-[#0b1321] px-2 py-1.5"><span className="truncate text-[10px] text-slate-400">{index === 0 ? "Thumbnail" : `Image ${index + 1}`}</span><span className="flex"><button type="button" onClick={() => changeOrder(index, -1)} aria-label="Move image up" className="p-1 text-slate-400 hover:text-cyan"><ArrowUp size={13} /></button><button type="button" onClick={() => changeOrder(index, 1)} aria-label="Move image down" className="p-1 text-slate-400 hover:text-cyan"><ArrowDown size={13} /></button><button type="button" onClick={() => remove(index)} aria-label="Remove image" className="p-1 text-slate-400 hover:text-rose-300"><Trash2 size={13} /></button></span></div></div>)}</div>
    </div>
  );
}
