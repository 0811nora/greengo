import { NavLink } from "react-router-dom";
{
  /* 間距待設計稿數值出來再做調整 */
}

// 試測 scss 運作
const FooterData = {
  brand: {
    name: "GreenGo",
    sloganZh: [
      "致力於最純淨、健康的客製化餐點。",
      "我們相信好的食物能帶來好的生活品質。",
    ],
    sloganEn: "Let’s eat clean, live better.",
  },
  socialMedia: [
    { name: "Facebook", icon: "bi-facebook", url: "https://facebook.com" },
    { name: "Instagram", icon: "bi-instagram", url: "https://instagram.com" },
    { name: "Line", icon: "bi-line", url: "https://line.me" },
    { name: "Googlemap", icon: "bi-map", url: "https://maps.google.com" },
  ],
  explore: {
    title: "探索",
    links: [
      { title: "最新菜單", url: "/menu" },
      { title: "客製化教學", url: "/customize" },
      { title: "線上訂餐", url: "/order" },
      { title: "綠果專欄", url: "/blog" },
      { title: "會員中心", url: "/member" },
      { title: "官方 LINE@", url: "/line" },
      { title: "關於綠果", url: "/about" },
    ],
  },
  contact: {
    title: "聯絡我們",
    address: "台北市信義區健康路 77 號",
    phone: "02-2345-6789",
    email: "greengo@healthyliving.com",
    hours: "Mon - Sun  10 : 00 - 21 : 30",
  },
};
const FooterBrand = ({ brand, socialMedia }) => {
  return (
    <div>
      <NavLink className="nav-link" to="/">
        <div className="font-en-logo fs-2 display-md-3 text-primary-50">
          {brand.name}
        </div>
      </NavLink>
      <div>
        {brand.sloganZh.map((line, index) => (
          <p key={index} className="fs-sm fs-md-md mb-0">
            {line}
          </p>
        ))}
        <p className="ft-en mt-2 mb-3 mb-md-4">{brand.sloganEn}</p>
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
  );
};

export default function Footer() {
  return (
    <footer className="bg-primary-300 text-white">
      {/* 間距待設計稿數值出來再做調整 */}
      <div className="container p-3">
        <div className="row">
          {/* brand + social media 區 */}
          <div className="col-md-6">
            <FooterBrand
              brand={FooterData.brand}
              socialMedia={FooterData.socialMedia}
            />
          </div>
          <div className="col-md-6">
            <div className="row">
              {/* 探索區 */}
              <div className="col-md-6">
                <div className="row">
                  <h4 className="fs-6 fs-md-4 lh-sm mb-3 mb-md-4">
                    {FooterData.explore.title}
                  </h4>
                  {/* 電腦版 */}
                  <div className="row d-none d-md-flex">
                    <div className="col-6">
                      <ul className="list-unstyled">
                        {FooterData.explore.links
                          .slice(0, 4)
                          .map((link, index) => (
                            <li
                              className="fs-6 fw-medium mb-3 mb-md-4"
                              key={index}
                            >
                              <NavLink className="nav-link" to={link.url}>
                                <div className="text-primary-50">
                                  {link.title}
                                </div>
                              </NavLink>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="col-6">
                      <ul className="list-unstyled">
                        {FooterData.explore.links
                          .slice(4)
                          .map((link, index) => (
                            <li
                              className="fs-6 fw-medium mb-3 mb-md-4"
                              key={index}
                            >
                              <NavLink className="nav-link" to={link.url}>
                                <div className="text-primary-50 text-decoration-none">
                                  {link.title}
                                </div>
                              </NavLink>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                  {/* 手機版 */}
                  <div>
                    <ul className="list-unstyled d-md-none">
                      {FooterData.explore.links.map((link, index) => (
                        <li key={index} className="lh-sm fw-medium mb-2">
                          <NavLink
                            to={link.url}
                            className="text-primary-50 text-decoration-none"
                          >
                            {link.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {/* 聯絡我們 */}
              <div className="col-md-6">
                <h4 className="fs-6 fs-md-4 lh-sm mb-3 mb-md-4">
                  {FooterData.contact.title}
                </h4>
                <ul className="list-unstyled">
                  <li className="mb-2">{FooterData.contact.address}</li>
                  <li className="ft-en mb-2">{FooterData.contact.phone}</li>
                  <li className="ft-en fs-md-sm fs-lg-md mb-2">
                    <a
                      href={`mailto:${FooterData.contact.email}`}
                      className="text-white text-decoration-none hover-underline fs-sm fs-lg-md"
                    >
                      {FooterData.contact.email}
                    </a>
                  </li>
                  <li className="ft-en">{FooterData.contact.hours}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
