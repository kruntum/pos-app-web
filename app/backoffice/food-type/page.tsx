/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import MyModal from '../../component/my-modal';
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/app/config";


export default function FoodtypePage() {
    const [id, setId] = useState(0);
    const [name, setName] = useState("");
    const [remark, setRemark] = useState("");
    const [foodTypes, setFoodTypes] = useState([]);
    const handleSave = async () => {
        try {
            const payload = {
                name: name,
                remark: remark,
                id: id,
            };
            if (id == 0) {
                await axios.post(config.apiServer + "/api/foodType/create", payload);
            } else {
                await axios.put(config.apiServer + "/api/foodType/update", payload);
                setId(0);
            }
            fetchData();
            document.getElementById("modalFoodType_btnClose")?.click();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error",
            });
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const edit = async (item: any) => {
        setId(item.id);
        setName(item.name);
        setRemark(item.remark);
    };
    const fetchData = async () => {
        try {
            const rows = await axios.get(config.apiServer + "/api/foodType/list");
            setFoodTypes(rows.data.results);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error",
            });
        }
    };
    const handleRemove = async (item: any) => {
        try {
            const button = await Swal.fire({
                title: "ยืนยันการลบ",
                text: "คุณต้องการลบใช่หรือไม่",
                icon: "question",
                showCancelButton: true,
                showConfirmButton: true,
            });
            if (button.isConfirmed) {
                await axios.delete(
                    config.apiServer + "/api/foodType/remove/" + item.id
                );
                fetchData();
            }
        } catch (e: any) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error",
            });
        }
    };
    const clearForm = () => {
        setId(0);
        setName("");
        setRemark("");
    };
    return (
        <div className="card mt-3">
            <div className="card-header">ประเภทอาหาร/เครื่องดื่ม</div>
            <div className="card-body">
                <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#modalFoodType"
                    onClick={clearForm}
                >
                    <i className="fa fa-plus me-2"></i>เพิ่มรายการ
                </button>
                <table className="mt-3 table table-bordered">
                    <thead>
                        <tr>
                            <th style={{ width: "200px" }}>ชื่อ</th>
                            <th>หมายเหตุ</th>
                            <th style={{ width: "110px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {foodTypes.map((item: any, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.remark}</td>
                                <td className="text-center flex flex-row gap-2 justify-center" >
                                    <button
                                        className="btn btn-primary  btn-sm"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modalFoodType"
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        onClick={(e) => edit(item)}>
                                        <i className=" fa fa-edit"></i>
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        onClick={(e) => handleRemove(item)}
                                    >
                                        <i className=" fa fa-times"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <MyModal id="modalFoodType" title="ประเภทอาหาร/เครื่องดื่ม">
                <div>ชื่อ</div>
                <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="mt-3">หมายเหตุ</div>
                <input
                    className="form-control"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                />
                <div className="mt-3">
                    <button className="btn btn-primary" onClick={handleSave}>
                        <i className="fa fa-check me-2"></i>บันทึก
                    </button>
                </div>
            </MyModal>
        </div>
    );
}
