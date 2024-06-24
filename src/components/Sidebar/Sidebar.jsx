import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt
} from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const menuItem = [
        {
            path: "/PartList",
            name: "Parça Listesi",
            icon: <FaTh />
        },
        {
            path: "/CreatePartMovement", 
            name: "Stok İşlemleri",
            icon: <FaUserAlt />
        },
        {
            path: "/CreateWarehousePart", 
            name: "Parça Depo İşlemleri",
            icon: <FaTh />
        }
    ];

    return (
        <div className="sidebar">
            <div className="top_section">
                <h1 className="logo" style={{ display: isOpen ? "block" : "none" }}></h1>
                <div className="bars">
                    <FaBars onClick={toggle} />
                </div>
            </div>
            <div className="menu_items" style={{ width: isOpen ? "200px" : "50px" }}>
                {menuItem.map((item, index) => (
                    <NavLink
                    to={item.path}
                    key={index}
                    className="link"
                    activeclassname="active"  // activeclassname prop'unu kullanın
                >
                    <div className="icon">{item.icon}</div>
                    <div className="link_text" style={{ display: isOpen ? "block" : "none" }}>{item.name}</div>
                </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
