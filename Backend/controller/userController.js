
/*******************handler function -> users************************/

const UserModel = require("../model/userModel");
const createUser = async function (req, res) {
    try {
        const userObject = req.body;

        const user = await UserModel.create(userObject);
        // send back the created user with status 201 (created)
        res.status(201).json(user);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "internal server error",
            error: err,
        })
    }
}

// const fetchUser = async () => {
//   try {
//     const res = await axios.get("http://localhost:3000/api/auth/profile", { withCredentials: true });
//     if (res.data.status === "success") {
//       setUser(res.data.user);
//     } else {
//       setUser(null);
//     }
//   } catch {
//     setUser(null);
//   }
// }


const getAllUser = async (req, res) => {
    try {

        const user = await UserModel.find();
        // if user is present -> send the resp
        if (user.length != 0) {
            res.status(200).json({
                message: user
            })
            // if it's not there then send user not found 
        } else {
            res.status(404).json({
                message: "did not get any user"
            })
        }
    } catch (err) {
        res.status(500).json({
            status: "Internal server error",
            message: err.message
        })
    }

}
const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findById(id);
        // if user is present -> send the resp
        if (user) {
            res.status(200).json({
                message: user
            })
            // if it's not there then send user not found 
        } else {
            res.status(404).json({
                message: "did not get the user"
            })
        }
    } catch (err) {
        res.status(500).json({
            status: "Internal server error",
            message: err.message
        })
    }

}
const deleteUser = async (req, res) => {
    try {
        let { id } = req.params;
        const user = await UserModel.findByIdAndDelete(id);
        if (user === null) {
            res.status(404).json({
                status: "sucess",
                message: "user does not exist",

            })
        } else {
            res.status(200).json({
                status: "sucess",
                message: "user is deleted",
                user: user
            })
        }


    } catch (err) {
        res.status(500).json({
            status: "Internal server error",
            message: err.message
        })
    }
}


module.exports = {
    createUser, getAllUser, getUser, deleteUser
}
