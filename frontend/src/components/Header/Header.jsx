"use client"

import { useEffect, useRef, useContext, useState } from "react"
import logo from "../../assets/images/logo1.png"
import { NavLink, Link } from "react-router-dom"
import { BiMenu } from "react-icons/bi"
import { authContext } from "../../context/AuthContext"

const navLinks = [
  { path: "/home", display: "Home" },
  { path: "/doctors", display: "Find a Doctor" },
  { path: "/services", display: "Services" },
  { path: "/contact", display: "Contact" },
]

// Default avatar as SVG with better quality
const defaultAvatar = `data:image/svg+xml,${encodeURIComponent('<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="17.5" cy="17.5" r="17.5" fill="#0067FF"/><path d="M17.5 8.75C19.7437 8.75 21.5625 10.5688 21.5625 12.8125C21.5625 15.0562 19.7437 16.875 17.5 16.875C15.2563 16.875 13.4375 15.0562 13.4375 12.8125C13.4375 10.5688 15.2563 8.75 17.5 8.75ZM17.5 21.875C23.2812 21.875 26.25 24.0625 26.25 25.3125V26.25H8.75V25.3125C8.75 24.0625 11.7188 21.875 17.5 21.875Z" fill="white"/></svg>')}`

const Header = () => {
  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const { user, role, token, dispatch } = useContext(authContext)

  // Load and validate user photo
  useEffect(() => {
    if (user?.photo) {
      const img = new Image()
      img.onload = () => {
        setProfileImage(user.photo)
      }
      img.onerror = () => {
        console.warn("Failed to load user profile image:", user.photo)
        setProfileImage(null)
      }
      img.src = user.photo
    } else {
      setProfileImage(null)
    }
  }, [user?.photo])

  const handleScroll = () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      headerRef.current.classList.add("sticky_header")
    } else {
      headerRef.current.classList.remove("sticky_header")
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => menuRef.current.classList.toggle("show_menu")

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" })
    setIsDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".profile-container")) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isDropdownOpen])

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          {/* logo and text container */}
          <div className="logo-container flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-[20px] leading-[24px] font-[600] text-primaryColor">CareConnect</span>
          </div>

          {/* menu */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[16px] leading-7 font-[600]"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav right */}
          <div className="flex items-center gap-4">
            {token && user ? (
              <div className="relative profile-container">
                <Link
                  to={`${role === "doctor" ? "/doctors/profile/me" : "/users/profile/me"}`}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-full py-1 px-2 transition-all duration-300"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <figure className="w-[40px] h-[40px] rounded-full border-2 border-solid border-primaryColor overflow-hidden flex items-center justify-center bg-gray-100">
                    <img
                      src={profileImage || defaultAvatar}
                      className="w-full h-full rounded-full object-cover"
                      alt={user?.name || "User"}
                      onError={(e) => {
                        e.target.src = defaultAvatar;
                        setProfileImage(null);
                      }}
                    />
                  </figure>
                  <div className="flex flex-col">
                    <h2 className="text-headingColor text-[16px] leading-[24px] font-[600]">
                      {user?.name || "User"}
                    </h2>
                    <span className="text-textColor text-[14px] leading-[20px] font-[400]">
                      {role === "doctor" ? "Doctor" : "Patient"}
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px] hover:bg-primaryColor/90 transition-colors duration-300">
                  Login
                </button>
              </Link>
            )}

            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
