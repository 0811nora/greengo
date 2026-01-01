import { NavLink } from "react-router-dom";

// 試測 scss 運作
const FooterData = {
  brand: {
    name: "GreenGo",
    sloganZh:
      "致力於最純淨、健康的客製化餐點。我們相信好的食物能帶來好的生活品質。",
    sloganEn: "Let’s eat clean, live better.",
  },
  socialMedia: [
    { name: "Facebook", icon: "bi-facebook", url: "https://facebook.com" },
    { name: "Instagram", icon: "bi-instagram", url: "https://instagram.com" },
    { name: "Line", icon: "bi-line", url: "https://line.me" },
    { name: "Googlemap", icon: "bi-map", url: "https://maps.google.com" },
  ],
};
const FooterBrand = ({ brand, socialMedia }) => {
  return (
    <div className="col-md-6">
      <div>
        <NavLink className="nav-link" to="/">
          <div className="font-en-logo text-primary-50">{brand.name}</div>
        </NavLink>
        <div>
          <p className="font-zh-b1-r">{brand.sloganZh}</p>
          <p className="font-en-b1-r">{brand.sloganEn}</p>
        </div>
        <ul className="d-flex gap-3 list-unstyled">
          {socialMedia.map((item) => (
            <li key={item.name}>
              <a href={item.url} className="text-white">
                <i className={`bi ${item.icon}`}></i>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default function Footer() {
  return (
    <footer className="bg-primary-300 text-white">
      <div className="container p-3">
        <div className="row">
          <FooterBrand
            brand={FooterData.brand}
            socialMedia={FooterData.socialMedia}
          />
        </div>
      </div>
    </footer>
  );
}
