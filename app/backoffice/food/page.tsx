/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
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
    const [foods, setFoods] = useState([]);
    const [name, setName] = useState("");
    const [remark, setRemark] = useState("");
    const [id, setId] = useState(0);
    const [price, setPrice] = useState(0);
    const [img, setImg] = useState("");
    const [myFile, setMyFile] = useState<File | null>(null);
    const [foodType, setFoodType] = useState("food");

    useEffect(() => {
        fetchDataFoodTypes();
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const rows = await axios.get(config.apiServer + "/api/food/list");
            setFoods(rows.data.results);
            //  console.log(rows.data.results);
        } catch (e: any) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error",
            });
        }
    };
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
    const handleSave = async () => {
        try {
            const img = await handleUpload();
            const payload = {
                foodTypeId: foodTypeId,
                name: name,
                remark: remark,
                price: price,
                img: img,
                id: id,
                foodType: foodType
            };
            if (id == 0) {
                const res = await axios.post(
                    config.apiServer + "/api/food/create",
                    payload
                );
                Swal.fire({
                    title: "success",
                    text: res.data.message,
                    icon: "success",
                    timer: 1000
                });
            } else {
                const res =  await axios.put(config.apiServer + "/api/food/update", payload);
                setId(0);
                Swal.fire({
                    title: "success",
                    text: res.data.message,
                    icon: "success",
                    timer: 1000
                });
            }
            fetchData();
            document.getElementById("modalFood_btnClose")?.click();
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
        setPrice(0);
        setImg("");
        setId(0);
        setMyFile(null);
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
                await axios.delete(config.apiServer + "/api/food/remove/" + id);
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
    const edit = async (item: any) => {
        setFoodTypeId(item.foodTypeId);
        setId(item.id);
        setName(item.name);
        setRemark(item.remark);
        setPrice(item.price);
        setImg(item.img);
        setMyFile(item.img);
    };
    const handleSelectedFile = (e: any) => {
        if (e.target.files.length > 0) {
            setMyFile(e.target.files[0]);
        }
    };
    const handleUpload = async () => {
        try {
            if (myFile == null) {
                Swal.fire({
                    title: "error",
                    text: "กรุณาเลือกไฟล์",
                    icon: "error",
                });
            }
            const formData = new FormData();
            formData.append("myFile", myFile as Blob);
            const res = await axios.post(
                config.apiServer + "/api/food/upload",
                formData
            );
            console.log(res.data.fileName);
            return res.data.fileName;
        } catch (e: any) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error",
            });
        }
    };
    const getFoodTypeName = (foodType: string): string => {
        if (foodType == 'food') {
            return 'อาหาร';
        } else {
            return 'เครื่องดื่ม';
        }
    }
    return (
        <div className="card mt-3">
            <div className="card-header">อาหาร</div>
            <div className="card-body">
                <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#modalFood"
                    onClick={() => {
                        handleClearForm();
                    }}
                >
                    <i className="fa fa-plus me-2"></i>เพิ่มรายการ
                </button>
                <table className="mt-3 table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th style={{ width: "200px", }}>ภาพ</th>
                            <th style={{ width: "200px" }}>ประเภท</th>
                            <th style={{ width: "100px" }}>ชนิด</th>
                            <th style={{ width: "200px" }}>ชื่อ</th>
                            <th>หมายเหตุ</th>
                            <th style={{ width: "100px" }} className="text-end">
                                ราคา
                            </th>
                            <th style={{ width: "200px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {foods.map((item: any) => (
                            <tr key={item.id}>
                                <td>
                                    <img
                                        src={config.apiServer + "/uploads/" + item.img}
                                        alt={item.name}
                                        width="100"
                                    />
                                </td>
                                <td>{item.FoodType.name}</td>
                                <td>{getFoodTypeName(item.foodType)}</td>
                                <td>{item.name}</td>
                                <td>{item.remark}</td>
                                <td className="text-end">{item.price}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-primary me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modalFood"
                                        onClick={(e) => {
                                            edit(item);
                                        }}
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
            <MyModal id="modalFood" title="อาหาร">
                <div>ประเภท</div>
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
                <div>ภาพ</div>
                <input
                    className="form-control"
                    type="file"
                    onChange={(e) => handleSelectedFile(e)}
                />
                <div>
                    {img !== "" ? (
                        <img
                            src={config.apiServer + "/uploads/" + img}
                            alt={name}
                            width={100}
                            height={100}
                            className="mt-3"
                        />
                    ) : (
                        <img
                            src={myFile ? URL.createObjectURL(myFile) : config.apiServer + "/uploads/default.png"}
                            alt={name}
                            width={100}
                            height={100}
                            className="mt-3"
                        />
                    )}
                </div>
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
                <div className="mt-3">ราคา</div>
                <input
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                />
                <div className="mt-3">ประเภทอาหาร</div>
                <div className="mt-1 gap-2 flex">
                    <div>
                        <input
                            type="radio"
                            name="foodType"
                            value="food"
                            checked={foodType === "food"}
                            onChange={(e) => setFoodType(e.target.value)}
                        />
                        <span className="ms-2">อาหาร</span></div>
                    <div>
                        <input
                            type="radio"
                            name="foodType"
                            value="drink"
                            checked={foodType === "drink"}
                            onChange={(e) => setFoodType(e.target.value)}
                        />
                        <span className="ms-2">เครื่องดื่ม</span>
                    </div>
                </div>
                <div className="mt-3">
                    <button className="btn btn-primary" onClick={handleSave}>
                        <i className="fa fa-check me-2"></i>บันทึก
                    </button>
                </div>
            </MyModal>
        </div>
    );
}