import { useLocation, useNavigate } from 'react-router-dom';


const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="flex flex-row my-4">
      <nav className="flex justify-center mx-auto" />
      {pathname !== '/' && (
        <div className="cursor-pointer p-2 mr-4 border border-[#34558B] rounded-lg">
          <button onClick={() => navigate('/', { replace: true })}>
            Back
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;