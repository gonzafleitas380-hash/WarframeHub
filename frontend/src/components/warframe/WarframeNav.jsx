import { useNavigate } from 'react-router-dom';

function WarframeNav({ nombre }) {
  const navigate = useNavigate();

  return (
    <nav className="wf-nav--root">
      <div className="wf-nav__logo--wrap">
        <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          War<span>Frame</span> HUB
        </a>
      </div>
      <div className="wf-nav__breadcrumb--wrap">
        Warframes › <span>{nombre}</span>
      </div>
      <div className="wf-nav__profile--wrapper">
        <div className="wf-nav__profile--avatar">
          <i className="fa-solid fa-user"></i>
        </div>
        <div className="wf-nav__profile--dropdown">
          <a href="#">My Profile</a>
        </div>
      </div>
    </nav>
  );
}

export default WarframeNav;