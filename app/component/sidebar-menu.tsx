/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import axios from "axios";

export default function SidebarMenu() {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");
    const router = useRouter();
    const [userLevel, setUserLevel] = useState("");
    useEffect(() => {
        const name = localStorage.getItem("next_name");
        const status = localStorage.getItem("next_user_status");
        setName(name ?? '');
        setStatus(status ?? '');
        getUserLevel();
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
    const getUserLevel = async () => {
        try {
            const token = localStorage.getItem(config.token);

            if (token !== null) {
                const headers = {
                    'Authorization': 'Bearer ' + token
                }

                const res = await axios.get(config.apiServer + '/api/user/getLevelByToken', { headers });

                setUserLevel(res.data.level);

            }
        } catch (e: any) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    return (
        <div>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <p className="text-slate-400 text-2xl font-bold   text-center pt-4">POS Food</p>
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
                            {userLevel === 'admin' && (
                                <>
                                    <li className="nav-item">
                                        <Link href="/backoffice/dashboard" className="nav-link">
                                            <i className="nav-icon fas fa-tachometer-alt"></i>
                                            <p>แดชบอร์ด</p>
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link href="/backoffice/user" className="nav-link">
                                            <i className="nav-icon fas fa-users"></i>
                                            <p>จัดการพนักงาน</p>
                                        </Link>
                                    </li></>
                            )}

                            {userLevel === 'admin' || userLevel === 'user' ?
                                <li className="nav-item">
                                    <Link href="/backoffice/sale" className="nav-link">
                                        <i className="nav-icon fas fa-dollar-sign"></i>
                                        <p>ขาย</p>
                                    </Link>
                                </li>
                                : <></>
                            }

                            {userLevel === 'admin' && (
                                <>
                                    <li className="nav-item">
                                        <Link href="/backoffice/food-type" className="nav-link">
                                            <i className="nav-icon fas fa-th"></i>
                                            <p>ประเภทอาหาร</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/backoffice/food-size" className="nav-link">
                                            <i className="nav-icon fas fa-list"></i>
                                            <p>ขนาด</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/backoffice/taste" className="nav-link">
                                            <i className="nav-icon fas fa-file-alt"></i>
                                            <p>รสชาติอาหาร</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/backoffice/food" className="nav-link">
                                            <i className="nav-icon fas fa-utensils"></i>
                                            <p>อาหาร</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/backoffice/food-paginate" className="nav-link">
                                            <i className="nav-icon fas fa-utensils"></i>
                                            <p>อาหาร (แบ่งหน้า)</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/backoffice/organization" className="nav-link">
                                            <i className="nav-icon fas fa-building"></i>
                                            <p>ข้อมูลร้าน</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/backoffice/report-bill-sale" className="nav-link">
                                            <i className="nav-icon fas fa-file-alt"></i>
                                            <p>รายงานการขาย</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/backoffice/report-sum-sale-per-day" className="nav-link">
                                            <i className="nav-icon fas fa-calendar"></i>
                                            <p>สรุปยอดขายรายวัน</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/backoffice/report-sum-sale-per-month" className="nav-link">
                                            <i className="nav-icon fas fa-calendar"></i>
                                            <p>สรุปยอดขายรายเดือน</p>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </aside>
        </div>
    );
}
