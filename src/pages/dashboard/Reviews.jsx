import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { LuCheck, LuEyeOff, LuLoaderCircle, LuPencil, LuPlus, LuStar, LuTrash2, LuX } from "react-icons/lu";
import toast from "react-hot-toast";
import { createReview, deleteReview as deleteReviewApi, getAdminReviews, updateReview as updateReviewApi, updateReviewVisibility } from "../../services/api";

const emptyForm = { name: "", car: "", review: "", image: "/man1.png", rating: 5, featured: false, published: true };
const inputClass = "mt-2 w-full rounded-xl border border-gray-200 bg-[#fbfdff] px-4 py-3 font-normal text-gray-700 outline-none focus:border-[#4B95D1] focus:ring-4 focus:ring-blue-50";

function ReviewModal({ review, onClose, onSave }) {
  const [form, setForm] = useState(review || emptyForm);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
      <form onSubmit={(event) => { event.preventDefault(); onSave(form); }} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4B95D1]">Social proof</p><h2 id="review-modal-title" className="mt-1 text-2xl font-bold text-gray-800">{review ? "Edit review" : "Add review"}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close modal" className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"><LuX size={22} /></button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Customer name"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} /></Field>
          <Field label="Vehicle"><input required value={form.car} onChange={(event) => setForm({ ...form, car: event.target.value })} className={inputClass} /></Field>
          <Field label="Rating"><select value={form.rating} onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })} className={inputClass}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} star{rating === 1 ? "" : "s"}</option>)}</select></Field>
          <Field label="Customer image URL"><input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="/man1.png" className={inputClass} /></Field>
          <label className="block text-sm font-semibold text-gray-700 sm:col-span-2">Review<textarea required rows="5" value={form.review} onChange={(event) => setForm({ ...form, review: event.target.value })} className={`${inputClass} resize-none`} /></label>
        </div>
        <div className="mt-5 flex flex-wrap gap-5 rounded-2xl bg-gray-50 px-4 py-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-600"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} className="h-4 w-4 accent-[#4B95D1]" /> Publish on website</label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-600"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} className="h-4 w-4 accent-violet-500" /> Featured review</label>
        </div>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-600">Cancel</button><button type="submit" className="rounded-xl bg-[#4B95D1] px-6 py-3 font-bold text-white">Save review</button></div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="block text-sm font-semibold text-gray-700">{label}{children}</label>;
}

export default function Reviews() {
  const { search = "" } = useOutletContext() || {};
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [visibility, setVisibility] = useState("All");
  const [busyReviewId, setBusyReviewId] = useState(null);
  const [notice, setNotice] = useState(null);
  const noticeTimer = useRef(null);

  const showNotice = (message, type = "success") => {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    setNotice({ message, type });
    noticeTimer.current = window.setTimeout(() => setNotice(null), 4500);
  };

  useEffect(() => {
    getAdminReviews()
      .then((payload) => setReviews(payload.data.map(normalizeReview)))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => () => {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
  }, []);

  const counts = useMemo(() => ({
    All: reviews.length,
    Pending: reviews.filter((review) => !review.published).length,
    Published: reviews.filter((review) => review.published).length,
  }), [reviews]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reviews.filter((review) => {
      if (query && !Object.values(review).join(" ").toLowerCase().includes(query)) return false;
      if (visibility === "Pending" && review.published) return false;
      if (visibility === "Published" && !review.published) return false;
      return true;
    });
  }, [reviews, search, visibility]);

  const saveReview = async (form) => {
    try {
      if (modal?.mode === "edit") {
        const payload = await updateReviewApi(modal.review.id, form);
        const saved = normalizeReview(payload.data);
        setReviews((current) => current.map((review) => review.id === saved.id ? saved : review));
        const message = saved.published ? "Review updated and visible on the website." : "Review updated and kept hidden.";
        toast.success(message);
        showNotice(message);
      } else {
        const payload = await createReview(form);
        setReviews((current) => [normalizeReview(payload.data), ...current]);
        const message = form.published ? "Review published on the website." : "Review saved as hidden.";
        toast.success(message);
        showNotice(message);
      }
      setModal(null);
    } catch (error) {
      toast.error(error.message);
      showNotice(error.message, "error");
    }
  };

  const toggleVisibility = async (review) => {
    if (busyReviewId) return;
    const nextPublished = !review.published;
    const loadingToast = toast.loading(nextPublished ? "Publishing review..." : "Hiding review...");
    setBusyReviewId(review.id);
    setReviews((current) => current.map((item) => item.id === review.id ? { ...item, published: nextPublished } : item));
    try {
      const payload = await updateReviewVisibility(review.id, nextPublished);
      const saved = normalizeReview(payload.data);
      setReviews((current) => current.map((item) => item.id === saved.id ? saved : item));
      const message = saved.published ? "Review approved and published on the website." : "Review hidden from the website.";
      toast.success(message, { id: loadingToast });
      showNotice(message);
    } catch (error) {
      setReviews((current) => current.map((item) => item.id === review.id ? review : item));
      toast.error(error.message, { id: loadingToast });
      showNotice(error.message, "error");
    } finally {
      setBusyReviewId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    const removedReview = reviews.find((review) => review.id === id);
    const loadingToast = toast.loading("Deleting review...");
    setBusyReviewId(id);
    setReviews((current) => current.filter((review) => review.id !== id));
    try {
      await deleteReviewApi(id);
      toast.success("Review deleted.", { id: loadingToast });
      showNotice("Review deleted successfully.");
    } catch (error) {
      if (removedReview) setReviews((current) => [removedReview, ...current]);
      toast.error(error.message, { id: loadingToast });
      showNotice(error.message, "error");
    } finally {
      setBusyReviewId(null);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4B95D1]">Customer trust</p><h1 className="mt-1 text-3xl font-bold text-gray-800">Review approvals</h1><p className="mt-2 text-sm text-gray-500">Customer submissions stay hidden until you publish them.</p></div>
        <button type="button" onClick={() => setModal({ mode: "add" })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4B95D1] px-5 py-3 font-bold text-white"><LuPlus /> Add review</button>
      </div>

      <div aria-live="polite" aria-atomic="true" className="min-h-0">
        {notice && (
          <div role={notice.type === "error" ? "alert" : "status"} className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm ${notice.type === "error" ? "border-red-100 bg-red-50 text-red-700" : "border-emerald-100 bg-emerald-50 text-emerald-700"}`}>
            <span className="flex items-center gap-2"><span className={`flex h-6 w-6 items-center justify-center rounded-full text-white ${notice.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>{notice.type === "error" ? <LuX size={14} /> : <LuCheck size={14} />}</span>{notice.message}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss notification" className="rounded-lg p-1 hover:bg-black/5"><LuX /></button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-2 shadow-sm sm:inline-grid sm:min-w-[440px]">
        {["All", "Pending", "Published"].map((item) => (
          <button key={item} type="button" onClick={() => setVisibility(item)} className={`rounded-xl px-3 py-3 text-xs font-bold transition sm:text-sm ${visibility === item ? "bg-[#eaf6ff] text-[#287fbd]" : "text-gray-500 hover:bg-gray-50"}`}>{item} <span className="ml-1 opacity-70">{counts[item]}</span></button>
        ))}
      </div>

      <section className="hidden overflow-hidden rounded-3xl bg-white shadow-[0_10px_35px_rgba(30,91,136,0.06)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead><tr className="border-b border-gray-100 bg-slate-50/70 text-xs uppercase tracking-wide text-gray-500">{["Customer", "Review", "Rating", "Visibility", "Actions"].map((heading) => <th key={heading} className="px-6 py-4 font-bold">{heading}</th>)}</tr></thead>
            <tbody>
              {!loading && filtered.map((review) => (
                <tr key={review.id} className="border-b border-gray-100 align-top text-sm text-gray-600 last:border-0 hover:bg-blue-50/30">
                  <td className="px-6 py-5"><ReviewCustomer review={review} /></td>
                  <td className="max-w-md px-6 py-5 leading-6">{review.review}</td>
                  <td className="px-6 py-5"><Rating rating={review.rating} /></td>
                  <td className="px-6 py-5"><Visibility review={review} /></td>
                  <td className="px-6 py-5"><ReviewActions review={review} busy={busyReviewId === review.id} onToggle={toggleVisibility} onEdit={() => setModal({ mode: "edit", review })} onDelete={() => remove(review.id)} /></td>
                </tr>
              ))}
              {loading && <tr><td colSpan="5" className="px-7 py-14 text-center text-gray-500">Loading reviews...</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan="5" className="px-7 py-14 text-center text-gray-500">No reviews found in this view.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:hidden">
        {!loading && filtered.map((review) => (
          <article key={review.id} className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(30,91,136,0.07)]">
            <div className="flex items-start justify-between gap-3"><ReviewCustomer review={review} /><Visibility review={review} /></div>
            <p className="mt-4 text-sm leading-6 text-gray-600">{review.review}</p>
            <div className="mt-4"><Rating rating={review.rating} /></div>
            <div className="mt-5 border-t border-gray-100 pt-4"><ReviewActions review={review} busy={busyReviewId === review.id} onToggle={toggleVisibility} onEdit={() => setModal({ mode: "edit", review })} onDelete={() => remove(review.id)} /></div>
          </article>
        ))}
        {loading && <div className="rounded-2xl bg-white px-5 py-12 text-center text-gray-500">Loading reviews...</div>}
        {!loading && filtered.length === 0 && <div className="rounded-2xl bg-white px-5 py-12 text-center text-gray-500">No reviews found in this view.</div>}
      </section>

      {modal && <ReviewModal review={modal.mode === "edit" ? modal.review : null} onClose={() => setModal(null)} onSave={saveReview} />}
    </div>
  );
}

function ReviewCustomer({ review }) {
  return <div className="flex min-w-0 items-center gap-3"><img src={review.image} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" /><div className="min-w-0"><p className="truncate font-bold text-gray-800">{review.name}</p><p className="mt-0.5 truncate text-xs text-gray-500">{review.car}</p></div></div>;
}

function Rating({ rating }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-bold text-amber-600"><LuStar className="fill-current" /> {rating}</span>;
}

function Visibility({ review }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${review.published ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-700"}`}>{review.published ? (review.featured ? "Published / Featured" : "Published") : "Pending approval"}</span>;
}

function ReviewActions({ review, busy, onToggle, onEdit, onDelete }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={busy} onClick={() => onToggle(review)} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold disabled:cursor-wait disabled:opacity-60 ${review.published ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>{busy ? <LuLoaderCircle className="animate-spin" /> : review.published ? <LuEyeOff /> : <LuCheck />}{busy ? "Updating..." : review.published ? "Hide" : "Publish"}</button>
      <button type="button" disabled={busy} onClick={onEdit} aria-label={`Edit review by ${review.name}`} className="rounded-lg bg-blue-50 p-2.5 text-[#287fbd] hover:bg-blue-100 disabled:opacity-50"><LuPencil /></button>
      <button type="button" disabled={busy} onClick={onDelete} aria-label={`Delete review by ${review.name}`} className="rounded-lg bg-red-50 p-2.5 text-red-500 hover:bg-red-100 disabled:opacity-50"><LuTrash2 /></button>
    </div>
  );
}

function normalizeReview(review) {
  return { id: review._id, name: review.name, car: review.car, review: review.review, image: review.image || "/man1.png", rating: review.rating || 5, featured: Boolean(review.featured), published: review.published !== false };
}
