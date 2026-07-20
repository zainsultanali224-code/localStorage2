import {
    collection,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    getDocs,
    getCountFromServer
} from "firebase/firestore";
import { db } from "./firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";

async function getPaginationUsersTodos({
    userId,
    pageNumber = 1,
    pageSize = 5,
    searchValue = "",
    lastVisible = null,
}) {
    const todosCollection = collection(db, "Users", userId, "Todos");
    let countConstraints = [];

    if (searchValue?.trim()) {
        countConstraints.push(
            where("title", ">=", searchValue),
            where("title", "<", searchValue + "\uf8ff")
            
        );
    }
    const countQuery = query(todosCollection, ...countConstraints);
    const countSnapshot = await getCountFromServer(countQuery);
    const totalItems = countSnapshot.data().count;
    try {
        const todosCollection = collection(db, "Users", userId, "Todos");

        let constraints = [
            orderBy("title", "asc"),
            limit(pageSize + 1)
        ];
        if (searchValue?.trim()) {
            constraints.push(
                where("title", ">=", searchValue),
                where("title", "<", searchValue + "\uf8ff")
            );
        }
        if (lastVisible) {
            constraints.push(startAfter(lastVisible));
        }

        const todosQuery = query(todosCollection, ...constraints);
        const todosSnapshot = await getDocs(todosQuery);
        const docs = todosSnapshot.docs;
        const hasNextPage = docs.length > pageSize;

        if (hasNextPage) docs.pop();
        const todos = docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt
                    ? data.createdAt.toMillis()
                    : null,
            };
        });

        return {
            data: todos,
            lastVisible: docs[docs.length - 1],
            hasNextPage,
            pageSize: todos.length,
            totalItems,
        };
    } catch (error) {
        console.error("Pagination error:", error);
        throw error;
    }
}
export default getPaginationUsersTodos;