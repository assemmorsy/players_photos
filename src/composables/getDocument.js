import { ref, watchEffect } from "vue";
import { projectFirestore } from "@/firebase/config";

const getDocument = (collection) => {
  const error = ref(null);
  const doc = ref(null);
  const loading = ref(false);
  const getDoc = async (id) => {
    let docRef = projectFirestore.collection(collection).doc(id);
    const unsub = docRef.onSnapshot(
      (snap) => {
        // update values
        // console.log(snap.data());
        doc.value = snap.data();
        error.value = null;
      },
      (err) => {
        console.error(err.message);
        doc.value = null;
        error.value = "something happened wrong.Please, try later.";
      }
    );

    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub());
    });
  };
  const getDocWithId = async (id) => {
    error.value = null;
    loading.value = true;
    const documentRef = projectFirestore.collection(collection).doc(id);
    try {
      const doc = await documentRef.get();
      error.value = null;
      loading.value = false;
      if (!doc.exists) {
        console.error("No such document!");
        return -1;
      } else {
        // console.log("Document data:", doc.data());
        return doc.data();
      }
    } catch (err) {
      console.error(err);
      error.value = "can't get the document data";
      loading.value = false;
    }
  };
  return { error, doc, getDoc, getDocWithId };
};
export default getDocument;
