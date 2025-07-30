import React, { useState, useEffect, useCallback } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import LocalStorageWatcher from "../../store/localStorageWatcher";
import { AuthStore } from "../../store/index";
import { logout, findById } from "./api";
import Header from "./components/header";
import UserIcon from "./components/user-icon";
import logo from "../../assets/img/logo.png";
import "./styles.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NAV_ITEMS = [
  {
    name: "Tablero",
    href: "/dashboard",
    children: [],
  },
  {
    name: "Mis URLs",
    href: "#",
    children: [
      { name: "Mis URLs", href: "/shortlink" },
      { name: "Crear una URL", href: "/shortlink/create" },
    ],
  },
];

const USER_NAV = [
  { name: "Mi cuenta", href: "/profile/edit" },
  { name: "Salir", href: "#", onClick: logout },
];

const Layout = ({ children, title }) => {
  const location = useLocation();
  const [preloader, setPreloader] = useState(true);
  const [loadingItem, setLoadingItem] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    imageUrl: "",
  });
  const [mobileSubmenusOpen, setMobileSubmenusOpen] = useState({});

  // Handle authentication
  const goToAuth = useCallback(() => {
    if (!AuthStore.getState().isAuthenticated) {
      window.location.replace("/auth/login");
    }
  }, []);

  // Sync with localStorage/auth changes
  useEffect(() => {
    const watcher = new LocalStorageWatcher(goToAuth);
    goToAuth();
    return () => watcher && watcher.disconnect && watcher.disconnect();
  }, [goToAuth]);

  // Load user info on mount
  useEffect(() => {
    const checkDocumentState = () => {
      if (document.readyState === "complete") {
        if (preloader === false && !user) {
          findById().then((res) => {
            console.log("RRR", res);
            setUser({
              name: res.data.firstName,
              email: res.data.email,
              imageUrl: "",
            });
          });
        }
        setPreloader(false);
      } else {
        window.addEventListener("load", () => setPreloader(false));
      }
    };
    checkDocumentState();
  }, [preloader, user]);

  // Handle submenu toggle
  const handleToggleMobileSubmenu = (idx) => {
    setMobileSubmenusOpen((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const pathname = location.pathname;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300">
      <Disclosure as="nav" className="bg-white/80 backdrop-blur-md border-b border-muted shadow-lg sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <img
                  alt="Enlaza"
                  src={logo}
                  className="h-12 w-auto drop-shadow"
                />
                <span className="font-bold text-xl text-primary hidden sm:block">Enlaza</span>
              </Link>
              <div className="hidden md:flex gap-2">
                {NAV_ITEMS.map((item, idx) =>
                  item.children && item.children.length > 0 ? (
                    <Menu key={item.name} as="div" className="relative">
                      <MenuButton
                        className={classNames(
                          "inline-flex items-center px-3 py-2 rounded-md text-base font-medium transition",
                          item.children.some(child => child.href === pathname)
                            ? "bg-primary/10 text-primary"
                            : "text-text hover:bg-primary/10 hover:text-primary"
                        )}
                      >
                        {item.name}
                        <ChevronDownIcon className="ml-1 h-5 w-5" />
                      </MenuButton>
                      <MenuItems className="absolute left-0 z-50 mt-2 w-48 origin-top-left rounded-md bg-white/95 shadow-lg ring-1 ring-black/10">
                        <div className="py-1">
                          {item.children.map((child) => (
                            <MenuItem key={child.name}>
                              {({ active }) => (
                                <Link
                                  to={child.href}
                                  className={classNames(
                                    active
                                      ? "bg-primary/10 text-primary"
                                      : "text-text",
                                    "block px-4 py-2 text-sm rounded transition"
                                  )}
                                >
                                  {child.name}
                                </Link>
                              )}
                            </MenuItem>
                          ))}
                        </div>
                      </MenuItems>
                    </Menu>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        "px-3 py-2 rounded-md text-base font-medium transition",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-text hover:bg-primary/10 hover:text-primary"
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center">
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-4">
                <MenuButton className="flex items-center rounded-full border border-primary/20 bg-white/90 shadow transition focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <span className="sr-only">Abrir menú de usuario</span>
                  <UserIcon />
                </MenuButton>
                <MenuItems className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white/95 py-1 shadow-lg ring-1 ring-black/10 transition">
                  {USER_NAV.map((item) => (
                    <MenuItem key={item.name}>
                      <Link
                        to={item.href}
                        className="block px-4 py-2 text-sm text-text hover:bg-primary/10 hover:text-primary transition"
                        onClick={async (e) => {
                          e.preventDefault();
                          setLoadingItem(item.name);
                          try { await item.onClick?.(); }
                          finally {
                            setLoadingItem(null);
                            window.location.href = item.href;
                          }
                        }}
                      >
                        {loadingItem === item.name ? "Cargando..." : item.name}
                      </Link>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <DisclosureButton className="relative inline-flex items-center justify-center rounded-md border border-primary/10 bg-white/90 p-2 text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition">
                <span className="sr-only">Abrir menú principal</span>
                <Bars3Icon className="h-6 w-6" />
              </DisclosureButton>
            </div>
          </div>
        </div>
        {/* Mobile menu panel */}
        <DisclosurePanel className="md:hidden bg-white/98 border-t border-muted shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_ITEMS.map((item, idx) =>
              item.children && item.children.length > 0 ? (
                <div key={item.name}>
                  <button
                    type="button"
                    className={classNames(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium transition",
                      item.children.some(child => child.href === pathname)
                        ? "bg-primary/10 text-primary"
                        : "text-text hover:bg-primary/10 hover:text-primary"
                    )}
                    onClick={() => handleToggleMobileSubmenu(idx)}
                    aria-expanded={!!mobileSubmenusOpen[idx]}
                    aria-controls={`mobile-submenu-${idx}`}
                  >
                    <span>{item.name}</span>
                    {mobileSubmenusOpen[idx] ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </button>
                  <div
                    id={`mobile-submenu-${idx}`}
                    className={classNames(
                      "pl-6 transition-all duration-200",
                      mobileSubmenusOpen[idx] ? "block py-1" : "hidden"
                    )}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-text hover:bg-primary/10 hover:text-primary transition"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    "block rounded-md px-3 py-2 text-base font-medium transition",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-text hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>
          <div className="border-t border-muted pt-4 pb-3">
            <div className="flex items-center px-5">
              <UserIcon />
              <div className="ml-3">
                <div className="text-base font-medium text-text">
                  {user.name || "Usuario"}
                </div>
                <div className="text-sm font-medium text-muted">
                  {user.email || "email"}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {USER_NAV.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-text hover:bg-primary/10 hover:text-primary transition"
                  onClick={async (e) => {
                    e.preventDefault();
                    setLoadingItem(item.name);
                    try { await item.onClick?.(); }
                    finally {
                      setLoadingItem(null);
                      window.location.href = item.href;
                    }
                  }}
                >
                  {loadingItem === item.name ? "Cargando..." : item.name}
                </DisclosureButton>
              ))}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
      <Header title={title} />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;