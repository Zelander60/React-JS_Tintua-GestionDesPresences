import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { links, UsersLinks } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/tintua_trans.png';

const Sidebar = () => {
  const { UserR, currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex w-10/12 items-center gap-3 pl-4 pt-3 pb-2.5 rounded-r-full text-white  text-md';
  const normalLink = 'flex w-10/12 items-center gap-3 pl-4 pt-3 pb-2.5 rounded-r-full text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray';

  return (
    <div className="conZ h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link 
            to={UserR?.role != '' ? "/acceuil" : "/presences"}
            onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
              {/* <SiShopware color={currentColor} />  */}
              <img
                className="rounded-full w-8 h-8"
                src={avatar}
                alt="user-profile"
              /> <span>TINTUA PRESENCES</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10 ">
            {UserR?.role != '' && UserR?.role != null ? links.map((item) => (
              <div key={item.title}>
                <p className="flex text-gray-400 dark:text-gray-400 w-3/5 p-2 pl-4 mb-4 rounded-r-full bg-light-gray px-1 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    {link.icon}
                    <span className="capitalize ">{link.desc}</span>
                  </NavLink>
                ))}
              </div>
            )) : UsersLinks.map((item) => (
              <div key={item.title}>
                <p className="flex text-gray-400 dark:text-gray-400 w-3/5 p-2 pl-4 mb-4 rounded-r-full bg-light-gray px-1 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    {link.icon}
                    <span className="capitalize ">{link.desc}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
