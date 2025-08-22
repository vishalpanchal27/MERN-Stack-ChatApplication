import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const SignUpPage = ({ setLogedIn }) => {

    const [formData, setFormData] = useState({ userName: "", fullName: "", password: "", confirmPassword: "", gender: "" })
    const [loading, setloading] = useState(false)
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [uploadedUrl, setUploadedUrl] = useState("");

    const handleChanges = (event) => {
        setFormData(prevData => {
            return {
                ...prevData,
                [event.target.name]: event.target.value
            }
        })
    }

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    console.log(formData)
    const signUpHandler = async () => {
        setloading(true);
       // e.preventDefault();
        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        if (file) data.append("profilePicture", file);
        try {
            const config = {
                headers: { "Content-Type": "multipart/form-data" }
            };

            const response = await axios.post(
                "/api/auth/signup",
                data,
                config
            );
            console.log(response);
            navigate('/app/welcome');
            localStorage.setItem("userData", JSON.stringify(response.data));
            setloading(false);
        } catch (err) {
            console.log(err);
        }
    }


    const navigate = useNavigate()
    return (
        <div className='welcome-container'>
            <div>
                <p>Select Profile Picture</p>
                <input type = "file" onChange = { handleFileChange } />
                {preview && <img src = {preview} alt = "preview" width = "200" />}

                {uploadedUrl && (
                    <div>
                        <h3>Uploaded Image:</h3>
                        <img src={uploadedUrl} alt="uploaded" width="200" />
                        <p>URL: {uploadedUrl}</p>
                    </div>
                )}
            </div>
            <div className="welcome-SignUp">
                <p className='wel-loginText'>Login Your Account</p>
                <TextField
                    required
                    onChange={handleChanges}
                    className='wel-idPassword'
                    id="userName"
                    label="Enter User Name"
                    name='userName'
                    value={formData.userName}
                    variant="outlined" />
                <TextField
                    required
                    onChange={handleChanges}
                    className='wel-idPassword'
                    id="fullName"
                    name='fullName'
                    value={formData.fullName}
                    label="Enter fullName"
                    variant="outlined" />
                <TextField
                    required
                    onChange={handleChanges}
                    className='wel-idPassword'
                    id="password"
                    name='password'
                    value={formData.password}
                    label="Password"
                    type='password'
                    variant="outlined" />
                <TextField
                    required
                    onChange={handleChanges}
                    className='wel-idPassword'
                    id="confirmPassword"
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    label="confirmPassword"
                    type='confirmPassword'
                    variant="outlined" />
                <TextField
                    required
                    onChange={handleChanges}
                    className='wel-idPassword'
                    id="gender"
                    name='gender'
                    value={formData.gender}
                    label="gender"
                    type='gender'
                    variant="outlined" />
                <Button variant="outlined" onClick={signUpHandler} >Submit</Button>
                <div>
                    If you have already Account <button onClick={() => { navigate('loginPage'); setLogedIn(true) }} >Login</button>
                </div>
            </div>

        </div>
    )
}

export default SignUpPage

// import { useState } from "react";
// import axios from "axios";

// function Signup() {
//     const [formData, setFormData] = useState({
//         fullName: "",
//         userName: "",
//         password: "",
//         confirmPassword: "",
//         gender: "male",
//     });
//     const [file, setFile] = useState(null);
//     const [preview, setPreview] = useState("");

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleFileChange = (e) => {
//         const selected = e.target.files[0];
//         setFile(selected);
//         setPreview(URL.createObjectURL(selected)); // 👈 preview before upload
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const data = new FormData();

//         // append all text fields
//         Object.keys(formData).forEach((key) => {
//             data.append(key, formData[key]);
//         });

//         // append profilePic
//         if (file) data.append("profilePicture", file);

//         try {
//             const res = await axios.post("http://localhost:3000/api/auth/signup", data, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             console.log("User created:", res.data);
//         } catch (err) {
//             console.error(err.response?.data || err.message);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} />
//             <input type="text" name="userName" placeholder="Username" onChange={handleChange} />
//             <input type="password" name="password" placeholder="Password" onChange={handleChange} />
//             <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />

//             <select name="gender" onChange={handleChange}>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//             </select>

//             {/* profile picture upload */}
//             <input type="file" accept="image/*" onChange={handleFileChange} />
//             {preview && <img src={preview} alt="preview" width="120" style={{ marginTop: "10px" }} />}

//             <button type="submit">Signup</button>
//         </form>
//     );
// }

// export default Signup;
