import { navigation } from "../../../constants/navigation";
import { LuLogIn, LuLogOut, LuShieldCheck, LuUserPlus } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function MobileMenu({ customer, onLogout, onNavigate }) {
  return (
    <nav id="mobile-navigation" className="border-t bg-white shadow-lg xl:hidden">

      {navigation.map((item) => (
        <a
          key={item.name}
          href={item.path}
          onClick={onNavigate}
          className="block border-b px-6 py-4 text-sm font-semibold tracking-wide text-gray-800 transition hover:bg-blue-50 hover:text-[#3D87F5]"
        >
          {item.name}
        </a>
      ))}

      <div className="grid gap-2 bg-slate-50 p-4 sm:grid-cols-3">
        {customer ? (
          <>
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-[#287fbd] sm:col-span-2">Signed in as {customer.name}</div>
            <button type="button" onClick={onLogout} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-600"><LuLogOut /> Logout</button>
          </>
        ) : (
          <>
            <Link to="/signup" onClick={onNavigate} className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-[#287fbd]"><LuUserPlus /> Sign Up</Link>
            <Link to="/customer-login" onClick={onNavigate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4B95D1] px-4 py-3 text-sm font-bold text-white"><LuLogIn /> Login</Link>
          </>
        )}
        <Link to="/login" onClick={onNavigate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#253b4d] px-4 py-3 text-sm font-bold text-white"><LuShieldCheck /> Login as Admin</Link>
      </div>

    </nav>
  );
}
