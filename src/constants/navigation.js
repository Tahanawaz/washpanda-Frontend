import { withPublicBase } from "../utils/publicPath";

export const navigation = [
  { name: "HOME", path: withPublicBase("/") },
  { name: "BOOKING", path: withPublicBase("/booking") },
  { name: "ABOUT", path: withPublicBase("/#about") },
  { name: "GALLERY", path: withPublicBase("/#gallery") },
  { name: "CONTACT", path: withPublicBase("/#contact") },
];
