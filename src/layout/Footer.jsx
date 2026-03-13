import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link'; // 連接關於我們頁的常見問題 section
import { FooterData } from '../data/footerData';

const FooterBrand = ({ brand, socialMedia }) => {
  return (
    <div>
      <Link className='nav-link mb-4' to='/'>
        <div className='font-en-logo fs-2 display-lg-3 text-primary-100'>
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
            <a
              href={item.url}
              className='text-white'
              aria-label={`前往綠果的 ${item.name}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <i className={`bi ${item.icon}`} aria-hidden='true'></i>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FooterLinks = ({ linkData }) => {
  return (
    <>
      <h4 className='fs-5 fs-md-4 lh-sm mb-3 mb-md-4'>{linkData.title}</h4>
      <ul>
        {linkData.links.map((item, index) => (
          <li className='fs-md fs-md-6 fw-medium mb-2 mb-md-4' key={index}>
            {item.url.includes('#') ? (
              // 判斷是不是前往常見問題區塊(hashlink)，不是則用 link
              <HashLink smooth className='nav-link' to={item.url}>
                <div className='text-primary-100'>{item.title}</div>
              </HashLink>
            ) : (
              <Link className='nav-link' to={item.url}>
                <div className='text-primary-100'>{item.title}</div>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

const FooterContact = ({ contactData }) => {
  return (
    <>
      <h4 className='fs-5 fs-md-4 lh-sm mb-3 mb-md-4'>{contactData.title}</h4>
      <ul className='list-unstyled'>
        <li className='fs-md fs-md-6 text-primary-100 mb-2 mb-md-4'>
          {contactData.address}
        </li>
        <li className='fs-md fs-md-6 text-primary-100 mb-2 mb-md-4'>
          <a
            href={`tel:${contactData.phone}`}
            className='text-primary-100 text-decoration-none hover-underline'
          >
            {contactData.phone}
          </a>
        </li>
        <li className='fs-md fs-md-6 ft-en mb-2 mb-md-4'>
          <a
            href={`mailto:${contactData.email}`}
            className='text-primary-100 text-decoration-none hover-underline footer__mail-link'
          >
            {contactData.email}
          </a>
        </li>
        <li className='fs-md fs-md-6 text-primary-100 ft-en mb-2 mb-md-4'>
          {contactData.hours}
        </li>
      </ul>
    </>
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
                <FooterLinks linkData={FooterData.explore} />
              </div>
              {/* 條款政策區 */}
              <div className='col-md-4'>
                <FooterLinks linkData={FooterData.policy} />
              </div>
              {/* 聯絡我們 */}
              <div className='col-md-4'>
                <FooterContact contactData={FooterData.contact} />
              </div>
            </div>
          </div>
        </div>
        <p className='text-white text-center d-flex justify-content-md-center align-items-center'>
          <i className='bi bi-c-circle me-1 fs-md' aria-hidden='true'></i>2025
          GreenGo All rights reserved.
        </p>
      </div>
    </footer>
  );
}
