import { createUserWithEmailAndPassword } from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import { auth, db } from "../config/firebase.config";

/**
 * Cria um novo usuário no Firebase Auth e salva no Firestore.
 * @param {Object} param0
 * @param {string} param0.email - E-mail do usuário
 * @param {string} param0.password - Senha
 * @param {string} param0.nome - Nome completo do usuário
 * @param {string} param0.role - Role (ex: "admin", "viewer", etc.)
 */


export const registerUser = async ({ nome, email, password, role}) => {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        console.log(user);

        await setDoc(doc(db, "users", user.uid), {
            email,
            nome,
            role,
        });
        console.log("Usuário criado com sucesso:", user.uid);
        return user;
    }
    catch (err) {
        console.error("Erro ao criar usuário:", err);
    }
}