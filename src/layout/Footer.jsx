import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { FooterData } from '../data/footerData';

const FooterBrand = ({ brand, socialMedia }) => {
  return (
    <div>
      <Link className='nav-link mb-4' to='/'>
        <div className='font-en-logo fs-2 display-md-3 text-primary-100'>
          {brand.name}
        </div>
      </Link>
      <div>
        {brand.sloganZh.map((line, index) => (
          <p key={index} className='fs-sm fs-md-md mb-2'>
            {line}
          </p>
        ))}
        <p className='ft-en'>{brand.sloganEn}</p>
      </div>
      <ul className='d-flex gap-4 list-unstyled mb-7 mb-md-0'>
        {socialMedia.map((item) => (
          <li key={item.name}>
            <a href={item.url} className='text-white'>
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
    <footer className='bg-primary-300 text-white'>
      <div className='container pt-8 pb-6 pt-md-10 pb-md-6 px-3 px-md-auto'>
        <div className='row g-6 mb-7 mb-md-8'>
          {/* brand + social media 區 */}
          <div className='col-md-4'>
            <FooterBrand
              brand={FooterData.brand}
              socialMedia={FooterData.socialMedia}
            />
          </div>
          <div className='col-md-8'>
            <div className='row'>
              {/* 探索區 */}
              <div className='col-md-4'>
                <h4 className='fs-6 fs-md-4 lh-sm mb-3 mb-md-4'>
                  {FooterData.explore.title}
                </h4>
                <ul className='list-unstyled'>
                  {FooterData.explore.links.map((link, index) => (
                    <li className='fs-6 fw-medium mb-3 mb-md-4' key={index}>
                      <Link className='nav-link' to={link.url}>
                        <div className='text-primary-100'>{link.title}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* 條款政策區 */}
              <div className='col-md-4'>
                <h4 className='fs-6 fs-md-4 lh-sm mb-3 mb-md-4'>
                  {FooterData.policy.title}
                </h4>
                <ul className='list-unstyled'>
                  {FooterData.policy.links.map((link, index) => (
                    <li className='fs-6 fw-medium mb-3 mb-md-4' key={index}>
                      {link.url.includes('#') ? (
                        <HashLink smooth className='nav-link' to={link.url}>
                          <div className='text-primary-100'>{link.title}</div>
                        </HashLink>
                      ) : (
                        <Link className='nav-link' to={link.url}>
                          <div className='text-primary-100'>{link.title}</div>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {/* 聯絡我們 */}
              <div className='col-md-4'>
                <h4 className='fs-6 fs-md-4 lh-sm mb-3 mb-md-4'>
                  {FooterData.contact.title}
                </h4>
                <ul className='list-unstyled'>
                  <li className='mb-2'>{FooterData.contact.address}</li>
                  <li className='ft-en mb-2'>{FooterData.contact.phone}</li>
                  <li className='ft-en fs-md-sm fs-lg-md mb-2'>
                    <a
                      href={`mailto:${FooterData.contact.email}`}
                      className='text-white text-decoration-none hover-underline fs-sm fs-lg-md'
                    >
                      {FooterData.contact.email}
                    </a>
                  </li>
                  <li className='ft-en'>{FooterData.contact.hours}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p className='text-white text-center d-flex justify-content-md-center align-items-center'>
          <i className='bi bi-c-circle me-1 fs-md'></i>2025 GreenGo All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
