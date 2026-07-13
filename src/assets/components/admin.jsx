import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";


function Admin() {
    return (
        <div>
            <h2>User Id</h2>
            <h3>{user.uid}</h3>

            <h2>User Email</h2>
            <h3>{user.email}</h3>

            <h2>User Role</h2>
            <h3>{userDetails.role}</h3>

            
        </div>
    );
}

export default Admin;