/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MyModal from "@/app/component/my-modal";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/app/config";

export default function Page() {
    const [foodTypeId, setFoodTypeId] = useState(0);
    const [foodTypes, setFoodTypes] = useState([]);
    const [tastes, setTastes] = useState([]);
    const [name, setName] = useState("");
    const [remark, setRemark] = useState("");
    const [id, setId] = useState(0);

    useEffect(() => {
        fetchDataFoodTypes();
        fetchData();
    }, []);
    const fetchDataFoodTypes = async () => {
        try {
            const res = await axios.get(config.apiServer + "/api/foodType/list");
            if (res.data.results.length > 0) {
                setFoodTypes(res.data.results);
                setFoodTypeId(res.data.results[0].id);
            }
        } catch (e: any) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error",
            });
        }
    };
    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiServer + "/api/taste/list");
            setTastes(res.data.results);
        } catch (e: any) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error",
            });
        }
    };
    const handleSave = async () => {
        try {
            const payload = {
                foodTypeId: foodTypeId,
                name: name,
                remark: remark,
                id: id,
            };
            if (id == 0) {
                await axios.post(config.apiServer + "/api/taste/create", payload);
            } else {
                await axios.post(config.apiServer + "/api/taste/update", payload);
                setId(0);
            }
            fetchData();
            document.getElementById("modalTaste_btnClose")?.click();
        } catch (e: any) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error",
            });
        }
    };
    const handleClearForm = () => {
        setName("");
        setRemark("");
    };
    const handleRemove = async (id: number) => {
        try {
            const button = await Swal.fire({
                title: "ยืนยันการลบ",
                text: "คุณต้องการลบรายการใช่หรือไม่",
                icon: "question",
                showCancelButton: true,
                showConfirmButton: true,
            });
            if (button.isConfirmed) {
                await axios.delete(config.apiServer + "/api/taste/remove/" + id);
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
    const edit = (item: any) => {
        setFoodTypeId(item.foodTypeId);
        setId(item.id);
        setName(item.name);
        setRemark(item.remark);
    };
    return (
        <div className="card mt-3">
            <div className="card-header">รสชาติอาหาร</div>
            <div className="card-body">
                <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#modalTaste"
                    onClick={handleClearForm}
                >
                    <i className="fa fa-plus me-2"></i>เพิ่มรายการ
                </button>
                <table className="mt-3 table table-bordered">
                    <thead>
                        <tr>
                            <th style={{ width: "100px" }}>ประเภทอาหาร</th>
                            <th style={{ width: "100px" }}>ชื่อ</th>
                            <th>หมายเหตุ</th>
                            <th style={{ width: "110px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tastes.map((item: any) => (
                            <tr key={item.id}>
                                <td>{item.FoodType.name}</td>
                                <td>{item.name}</td>
                                <td>{item.remark}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-primary me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modalTaste"
                                    // onClick={(e) => edit(item)}
                                    >
                                        <i className=" fa fa-edit"></i>
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={(e) => handleRemove(item.id)}
                                    >
                                        <i className=" fa fa-times"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <MyModal id="modalTaste" title="รสชาติอาหาร">
                <div>ประเภทอาหาร</div>
                <select
                    className="form-control"
                    value={foodTypeId}
                    onChange={(e) => setFoodTypeId(parseInt(e.target.value))}
                >
                    {foodTypes.map((item: any) => (
                        <option value={item.id} key={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
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