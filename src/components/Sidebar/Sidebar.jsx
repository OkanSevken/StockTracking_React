import React, { useState } from 'react';
import {
    FaBars,
    FaTh,
    FaCogs,
    FaWarehouse,
    FaPlus, // Icon for Add Stock
    FaMinus, // Icon for Remove Stock
    FaSignOutAlt // Icon for Logout
} from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isStockOpen, setIsStockOpen] = useState(false);
    const navigate = useNavigate();

    const toggle = () => setIsOpen(!isOpen);
    const toggleStockMenu = () => setIsStockOpen(!isStockOpen);
    
    const handleLogout = () => {
        navigate('/Login'); // Kullanıcıyı login sayfasına yönlendir
    };

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
        },
        {
            path: "/CreateWarehouse",
            name: " Depo Oluştur",
            icon: <FaWarehouse />
        },
        
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
                <div className="link" onClick={handleLogout}>
                    <div className="icon"><FaSignOutAlt /></div>
                    <div className="link_text" style={{ display: isOpen ? "block" : "none" }}>Çıkış Yap</div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
