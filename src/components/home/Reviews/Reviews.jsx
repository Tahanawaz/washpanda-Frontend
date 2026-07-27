import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa6";
import { LuMessageSquareText, LuSend } from "react-icons/lu";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "./Reviews.css";

import { getReviews, submitCustomerReview } from "../../../services/api";
import ReviewCard from "./ReviewCard";

const emptyReview = { name: "", car: "", review: "", rating: 5, website: "" };

export default function Reviews() {
  const [reviewItems, setReviewItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyReview);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    getReviews()
      .then((payload) => { if (active) setReviewItems(payload.data.map(normalizeReview)); })
      .catch(() => { if (active) setReviewItems([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const submitReview = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitted(false);
    try {
      const payload = await submitCustomerReview(form);
      setForm(emptyReview);
      setSubmitted(true);
      toast.success(payload.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-1 bg-white px-4 pb-16 pt-4 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#4B95D1]">Trusted by local drivers</p>
          <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-[3px] text-[#222] sm:text-4xl sm:tracking-[5px]">Client Reviews</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">Real experiences published after admin approval.</p>
        </div>

        <div className="mx-auto mt-8 w-full max-w-[980px] overflow-hidden pb-1 pt-7 lg:mt-12">
          {loading && <p className="pb-10 text-center text-sm text-gray-500">Loading customer reviews...</p>}
          {!loading && reviewItems.length === 0 && (
            <div className="mx-auto mb-8 max-w-xl rounded-2xl bg-blue-50 px-6 py-8 text-center">
              <p className="font-semibold text-gray-700">Customer reviews will appear here after admin approval.</p>
            </div>
          )}
          {!loading && reviewItems.length > 0 && (
            <Swiper
              modules={[Pagination, Autoplay]}
              slidesPerView={1}
              breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              centeredSlides
              loop={reviewItems.length > 3}
              speed={700}
              spaceBetween={0}
              autoplay={reviewItems.length > 1 ? { delay: 3000, disableOnInteraction: false } : false}
              pagination={{ clickable: true }}
              className="reviewSwiper pb-12"
            >
              {reviewItems.map((review) => (
                <SwiperSlide key={review.id} className="flex justify-center">
                  {({ isActive }) => <ReviewCard review={review} active={isActive} />}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <form onSubmit={submitReview} className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-br from-white to-[#f4faff] shadow-[0_20px_60px_rgba(45,116,168,0.12)]">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            <div className="bg-[#287fbd] p-6 text-white sm:p-8 lg:p-10">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><LuMessageSquareText size={24} /></span>
              <h3 className="mt-6 text-2xl font-bold">Share your experience</h3>
              <p className="mt-3 text-sm leading-6 text-blue-50">Your review goes privately to the admin first. It appears on the website only after approval.</p>
            </div>

            <div className="p-5 sm:p-8 lg:p-10">
              <div className="grid gap-4 sm:grid-cols-2">
                <ReviewField label="Your name"><input required minLength="2" maxLength="120" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Ali Khan" className={inputClass} /></ReviewField>
                <ReviewField label="Vehicle"><input required minLength="2" maxLength="120" value={form.car} onChange={(event) => setForm({ ...form, car: event.target.value })} placeholder="e.g. Honda Civic" className={inputClass} /></ReviewField>
              </div>

              <fieldset className="mt-5">
                <legend className="text-sm font-bold text-gray-700">Your rating</legend>
                <div className="mt-2 flex gap-1" aria-label={`${form.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button key={rating} type="button" onClick={() => setForm({ ...form, rating })} aria-label={`Rate ${rating} out of 5`} className="rounded-lg p-1.5 text-2xl transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#4B95D1]">
                      <FaStar className={rating <= form.rating ? "text-amber-400" : "text-gray-200"} />
                    </button>
                  ))}
                </div>
              </fieldset>

              <ReviewField label="Your review" className="mt-4"><textarea required minLength="10" maxLength="2000" rows="4" value={form.review} onChange={(event) => setForm({ ...form, review: event.target.value })} placeholder="Tell us about the service..." className={`${inputClass} resize-none`} /></ReviewField>
              <input tabIndex="-1" autoComplete="off" aria-hidden="true" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} className="absolute -left-[9999px] h-px w-px opacity-0" />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p aria-live="polite" className={`text-sm font-medium ${submitted ? "text-emerald-600" : "text-gray-500"}`}>{submitted ? "Review submitted for admin approval." : "Only approved reviews are shown publicly."}</p>
                <button type="submit" disabled={submitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4B95D1] px-6 py-3 font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#347fb9] disabled:cursor-not-allowed disabled:opacity-60">
                  <LuSend /> {submitting ? "Submitting..." : "Submit review"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

const inputClass = "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#4B95D1] focus:ring-4 focus:ring-blue-50";

function ReviewField({ label, className = "", children }) {
  return <label className={`block text-sm font-bold text-gray-700 ${className}`}>{label}{children}</label>;
}

function normalizeReview(review) {
  return {
    id: review._id,
    name: review.name,
    car: review.car,
    review: review.review,
    image: review.image || "/man1.png",
    rating: review.rating || 5,
  };
}
