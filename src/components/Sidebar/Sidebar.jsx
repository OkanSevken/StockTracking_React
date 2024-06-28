import React, { useState } from 'react';
import {
    FaBars,
    FaTh,
    FaCogs,
    FaWarehouse,
    FaPlus, // Icon for Add Stock
    FaMinus // Icon for Remove Stock
} from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isStockOpen, setIsStockOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);
    const toggleStockMenu = () => setIsStockOpen(!isStockOpen);

    const menuItem = [
        {
            path: "/PartList",
            name: "Parça Listesi",
            icon: <FaTh />
        },
        {
            name: "Stok İşlemleri",
            icon: <FaCogs />,
            subItems: [
                {
                    path: "/StockAdd",
                    name: "Stok Ekle",
                    icon: <FaPlus />
                },
                {
                    path: "/DropStock",
                    name: "Stok Çıkar",
                    icon: <FaMinus />
                }
            ]
        },
        {
            path: "/CreateWarehousePart",
            name: "Parça Depo İşlemleri",
            icon: <FaWarehouse />
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
                    <div key={index}>
                        {item.subItems ? (
                            <>
                                <div className="link" onClick={toggleStockMenu}>
                                    <div className="icon">{item.icon}</div>
                                    <div className="link_text" style={{ display: isOpen ? "block" : "none" }}>{item.name}</div>
                                </div>
                                {isStockOpen && (
                                    <div className="submenu" style={{ display: isOpen ? "block" : "none", marginLeft: '20px' }}>
                                        {item.subItems.map((subItem, subIndex) => (
                                            <NavLink
                                                to={subItem.path}
                                                key={subIndex}
                                                className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
                                            >
                                                <div className="icon">{subItem.icon}</div>
                                                <div className="link_text">{subItem.name}</div>
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
                            >
                                <div className="icon">{item.icon}</div>
                                <div className="link_text" style={{ display: isOpen ? "block" : "none" }}>{item.name}</div>
                            </NavLink>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
