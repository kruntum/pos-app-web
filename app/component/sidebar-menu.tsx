
"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";

export default function SidebarMenu() {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");
    const router = useRouter();
    useEffect(() => {
        const name = localStorage.getItem("next_name");
        const status = localStorage.getItem("next_user_status");
        setName(name ?? '');
        setStatus(status ?? '');
        console.log("Name:", name);
        console.log("Status:", status);
    }, [])
    const signOut = async () => {
        try {
            const button = await Swal.fire({
                title: 'SignOut',
                text: "คุณต้องการออกจากระบบใช่หรือไม่",
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ออกจากระบบ',
                cancelButtonText: 'ยกเลิก'
            });
            if (button.isConfirmed) {
                localStorage.removeItem(config.token as string);
                localStorage.removeItem("next_name");
                localStorage.removeItem("next_user_id");
                localStorage.removeItem("next_level");
                localStorage.removeItem("next_username");
                localStorage.removeItem("next_user_status");
                router.push("/signin");
            }
        } catch (e: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: (e as Error).message,
            })
        }
    }
    return (
        <div>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <p className="text-slate-400 text-2xl font-bold  text-opacity-10 text-center pt-4">AdminLTE 3</p>
                <div className="sidebar">
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                        </div>
                        <div className="info">
                            {status === "use" ? (
                                <div>
                                    <p className="text-white text-center">ยินดีต้อนรับ {name}</p>
                                    <button className="btn btn-outline-danger" onClick={signOut}>
                                        ออกจากระบบ  <i className="fa fa-times mr-2"></i></button>
                                </div>) : (
                                <p className="text-white">โปรดเข้าสู่ระบบก่อนครับ</p>)}
                        </div>
                    </div>
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li className="nav-item">
                                <Link href="/backoffice/food-type" className="nav-link">
                                    <i className="nav-icon fas fa-th"></i>
                                    ประเภทอาหาร
                                </Link>
                            </li>
                                <li className="nav-item">
                                    <Link href="/backoffice/food-size" className="nav-link">
                                        <i className="nav-icon fas fa-list"></i>
                                        ขนาด
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/backoffice/taste" className="nav-link">
                                        <i className="nav-icon fas fa-file-alt"></i>
                                        รสชาติอาหาร
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/backoffice/food" className="nav-link">
                                        <i className="nav-icon fas fa-utensils"></i>
                                        อาหาร
                                    </Link>
                                </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </div>
    );
}
