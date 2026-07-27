import { useEffect, useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { LuLogIn, LuLogOut, LuShieldCheck, LuUserPlus } from "react-icons/lu";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Container from "../../common/Container";

import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { getCurrentCustomer, logoutCustomer } from "../../../services/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    let active = true;
    getCurrentCustomer().then((payload) => { if (active) setCustomer(payload.data); }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const signOutCustomer = async () => {
    try {
      await logoutCustomer();
      setCustomer(null);
      setOpen(false);
      toast.success("Signed out successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">

      <Container>

        <div className="relative flex h-24 items-center justify-between px-4 sm:px-8 lg:px-12">

          <Logo />

          <div className="absolute left-[45%] hidden -translate-x-1/2 xl:block">
            <DesktopMenu />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 xl:flex">
              {customer ? (
                <>
                  <span className="max-w-32 truncate rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-[#287fbd]">Hi, {customer.name.split(" ")[0]}</span>
                  <button type="button" onClick={signOutCustomer} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"><LuLogOut /> Logout</button>
                </>
              ) : (
                <>
                  <Link to="/signup" className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 px-3 py-2 text-xs font-bold text-[#287fbd] transition hover:bg-blue-50"><LuUserPlus /> Sign Up</Link>
                  <Link to="/customer-login" className="inline-flex items-center gap-1.5 rounded-xl bg-[#4B95D1] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#347fb9]"><LuLogIn /> Login</Link>
                </>
              )}
              <Link to="/login" className="inline-flex items-center gap-1.5 rounded-xl bg-[#253b4d] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#172b3b]"><LuShieldCheck /> Login as Admin</Link>
            </div>

            <button
              type="button"
              className="rounded-md p-2 text-gray-800 transition hover:bg-gray-100 xl:hidden"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? (
                <HiXMark size={30} />
              ) : (
                <HiBars3 size={30} />
              )}
            </button>

          </div>

        </div>

      </Container>

      {open && <MobileMenu customer={customer} onLogout={signOutCustomer} onNavigate={() => setOpen(false)} />}

    </header>
  );
}
