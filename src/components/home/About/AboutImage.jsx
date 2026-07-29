import { withPublicBase } from "../../../utils/publicPath";

export default function AboutImage() {
  return (
    <img
      src={withPublicBase("/about-panda.png")}
      alt="Wash Panda"
      loading="lazy"
      decoding="async"
      className="w-full rounded-xl object-cover shadow-xl"
    />
  );
}
