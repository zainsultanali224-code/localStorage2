import {
    collection,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    getDocs,
    getCountFromServer,
} from "firebase/firestore";

import { db } from "./firebase";

async function getPaginationUsersTodos({
    userId,
    pageSize = 5,
    searchValue = "",
    lastVisible = null,
}) {
    try {
        const todosCollection = collection(db, "Users", userId, "Todos");

        let countConstraints = [];

        if (searchValue.trim()) {
            countConstraints.push(
                where("title", ">=", searchValue),
                where("title", "<=", searchValue + "\uf8ff")
            );
        }

        const countQuery = query(
            todosCollection,
            ...countConstraints
        );

        const countSnapshot = await getCountFromServer(countQuery);
        const totalItems = countSnapshot.data().count;

        let constraints = [
            orderBy("title"),
            limit(pageSize + 1),
        ];

        if (searchValue.trim()) {
            constraints.push(
                where("title", ">=", searchValue),
                where("title", "<=", searchValue + "\uf8ff")
            );
        }

        if (lastVisible) {
            constraints.push(startAfter(lastVisible));
        }

        const todosQuery = query(
            todosCollection,
            ...constraints
        );

        const snapshot = await getDocs(todosQuery);

        let docs = snapshot.docs;

        let hasNextPage = false;

        if (docs.length > pageSize) {
            hasNextPage = true;
            docs.pop();
        }

        const todos = docs.map((doc) => {
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
            lastVisible:
                docs.length > 0
                    ? docs[docs.length - 1]
                    : null,
            hasNextPage,
            totalItems,
        };
    } catch (error) {
        throw error;
    }
}

export default getPaginationUsersTodos;