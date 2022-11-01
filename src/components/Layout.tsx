import React from 'react';
import Header from './Header';

interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps) => {
  return (
    <>
      <div className="flex flex-col w-full h-full text-blackLight bg-white">
        <Header />
        <div>
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;